import { PaymentService } from "medusa-interfaces"
import Billplz from "../billplz"
import fpxAllowlist from "../utils/fpx-allowlist"
import { log } from "../utils/log"

// const log = console.log

class BillplzPaymentService extends PaymentService {
  static identifier = "billplz"

  constructor(_, options) {
    super()
    this.storeUrl = options.store_url
    this.backendUrl = options.backend_url
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
   * Not supported
   */
  async createPayment(cart) {
    log("createPayment", cart)
    return { status: "pending" }
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
   * Create bills in Billplz
   */
  async authorizePayment(paymentSession, context) {
    log("authorizedPayment", { paymentSession, context })

    try {
      const { data } = paymentSession
      const { email, customer, total, id, billplz_ref, status } = data

      if (!billplz_ref) {
        return {
          status: "requires_more",
          data: { ...paymentSession, status: "requires_more" },
        }
      }

      if (status === "authorized") {
        return {
          status: "authorized",
          data: { ...paymentSession, status: "authorized" },
        }
      }

      const bill = await this.BillPlz.create_bill({
        email,
        name: `${customer.first_name} ${customer.last_name}`,
        amount: total,
        callback_url: `${this.backendUrl}/billplz/callback`,
        redirect_url: `${this.storeUrl}/checkout`,
        description: `cart_id:${id},idempotency_key:${id}`,
        reference_1_label: "Bank Code",
        reference_1: billplz_ref,
      })
      log("createPayment", bill)

      return {
        status: "requires_more",
        data: { ...data, ...bill, status: "requires_more" },
      }
    } catch (error) {
      log("error", JSON.stringify(error, Object.getOwnPropertyNames(error)))
    }
  }

  /**
   * Create payment based on user bank selection.
   */
  async updatePayment(sessionData, cart) {
    const { email, customer, total, id } = cart

    const combined = { ...sessionData, email, customer, total, id }
    log("updatePayment", { sessionData, cart, combined })

    return combined
  }

  /**
   * @param {object} sessionData - payment session data.
   * @param {object} update - payment session update data.
   * @returns {object} existing data merged with update data
   */
  async updatePaymentData(sessionData, update) {
    log("updatePaymentData", sessionData, update)
    // calculate x_signature to verify its not forged.
    try {
      if (update?.billplz_response?.["billplz[paid]"] === "true") {
        update.status = "authorized"
      }

      return { ...sessionData, ...update }
    } catch (error) {
      log("error", JSON.stringify(error, Object.getOwnPropertyNames(error)))
      console.error(error)
    }
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
