import { PaymentService } from "medusa-interfaces"
import { log } from "../utils/log"

const baseUrl = "https://www.billplz.com/api"
const sandboxBaseUrl = "https://www.billplz-sandbox.com/api"
// const log = console.log

class BillplzPaymentService extends PaymentService {
  static identifier = "billplz"

  /** Indicates whether the operation will be in sandbox mode. */
  sandbox = false

  constructor(container, options) {
    super()
    this.sandbox = !options.production
    this.apiUrl = this.sandbox ? sandboxBaseUrl : baseUrl
    this.apiKey = options.api_key
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
    log("createPayment", ...args)
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
   * Updates the payment status to authorized
   * @returns {Promise<{ status: string, data: object }>} result with data and status
   */
  async authorizePayment() {
    const t = 't'
    log("authorizedPayment", t)
    return { status: "authorized", data: { status: "authorized" } }
  }

  /**
   * Noop, simply returns existing data.
   * @param {object} sessionData - payment session data.
   * @returns {object} same data
   */
  async updatePayment(sessionData) {
    log("updatePayment", sessionData)
    return sessionData.data
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

  async deletePayment() {
    log("deletePayment")
    return
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
}

export default BillplzPaymentService
