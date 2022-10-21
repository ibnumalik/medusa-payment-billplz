import { PaymentService } from "medusa-interfaces"
import Billplz from "../billplz"
import fpxAllowlist from "../utils/fpx-allowlist"
import { log } from "../utils/log"

// const log = console.log

class BillplzPaymentService extends PaymentService {
  static identifier = "billplz"

  constructor(_, options) {
    super()
    this.BillPlz = new Billplz(options)
  }

  /**
   * Returns the currently held status.
   * @param {object} paymentData - payment method data from cart
   * @returns {string} the status of the payment
   */
  async getStatus(paymentData) {
    log("getStatus", paymentData)
    const { status } = paymentData
    return status
  }

  /**
   * Creates a manual payment with status "pending"
   * @param {object} cart - cart to create a payment for
   * @returns {object} an object with staus
   */
  async createPayment(cart) {
    try {
      log("try createPayment")
      const { email, customer, total, id } = cart
      const payment = await this.BillPlz.create_bill({
        email,
        name: `${customer.first_name} ${customer.last_name}`,
        amount: total,
        callback_url: "http://localhost:8000/billplz/callback",
        description: id,
      })
      log("createPayment", payment)
      return { status: "pending", ...payment }
    } catch (error) {
      log("error", JSON.stringify(error, Object.getOwnPropertyNames(error)))
    }
  }

  /**
   * Retrieves payment
   * @param {object} data - the data of the payment to retrieve
   * @returns {Promise<object>} returns data
   */
  async retrievePayment(data) {
    log("retrievePayment", data)
    return data
  }

  async retrieveSavedMethods() {
    log("retrieveSavedMethods")
    return []
  }

  /**
   * Updates the payment status to authorized
   * @returns {Promise<{ status: string, data: object }>} result with data and status
   */
  async authorizePayment() {
    const t = "t"
    log("authorizedPayment", t)
    return { status: "authorized", data: { status: "authorized" } }
  }

  /**
   * Noop, simply returns existing data.
   * @param {object} sessionData - payment session data.
   * @returns {object} same data
   */
  async updatePayment(sessionData, cart) {
    log("updatePayment", sessionData)

    if (cart.total && sessionData.amount === Math.round(cart.total)) {
      return sessionData
    }

    return this.createPayment(cart)
  }

  /**
   .
   * @param {object} sessionData - payment session data.
   * @param {object} update - payment session update data.
   * @returns {object} existing data merged with update data
   */
  async updatePaymentData(sessionData, update) {
    log("updatePaymentData", { sessionData, update })
    return { ...sessionData.data, ...update.data }
  }

  async deletePayment(paymentSession) {
    const { id } = paymentSession
    log("deletePayment", id)
    return this.BillPlz.delete_bill(id)
  }

  /**
   * Updates the payment status to captured
   * @param {object} paymentData - payment method data from cart
   * @returns {object} object with updated status
   */
  async capturePayment() {
    log("capturePayment")
    return { status: "captured" }
  }

  /**
   * Returns the data currently held in a status
   * @param {object} paymentData - payment method data from cart
   * @returns {object} the current data
   */
  async getPaymentData(session) {
    log("getPaymentData", session)
    return session.data
  }

  /**
   * Noop, resolves to allow manual refunds.
   * @param {object} payment - payment method data from cart
   * @returns {string} same data
   */
  async refundPayment(payment) {
    log("refundPayment", payment)
    return payment.data
  }

  /**
   * Updates the payment status to cancled
   * @returns {object} object with canceled status
   */
  async cancelPayment() {
    log("cancelPayment")
    return { status: "canceled" }
  }

  async getPaymentGateways() {
    return this.BillPlz.getPaymentGateways()
  }

  async getFpxBanks() {
    const { banks } = await this.BillPlz.getFpxBanks()

    return this.getAllowedFpx(banks)
  }

  getAllowedFpx(banks) {
    log(banks)
    return Object.keys(fpxAllowlist).map((fpxKey) => {
      const bank = banks.find((b) => b.name === fpxKey)
      return {
        ...bank,
        ...fpxAllowlist[fpxKey],
      }
    })
  }
}

export default BillplzPaymentService
