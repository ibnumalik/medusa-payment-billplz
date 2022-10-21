/**
 *
 */
import fetch from "node-fetch"
import { log } from "./utils/log"

const baseUrl = "https://www.billplz.com/api/"
const sandboxBaseUrl = "https://www.billplz-sandbox.com/api/"

export default class Billplz {
  constructor(options) {
    this.options = options
    this._isSandbox = !options.production
    this._apiKey = options.api_key
    this._collectionId = options.collection_id
    this._xSignatureKey = options.x_signature_key
    this._apiEndpoint = this._isSandbox ? sandboxBaseUrl : baseUrl
  }

  post(path, params) {
    const url = this._apiEndpoint + path
    return this.fetcher(url, { method: "POST", body: JSON.stringify(params) })
  }

  get(path) {
    const url = this._apiEndpoint + path
    return this.fetcher(url, { method: "GET" })
  }

  //create collection
  create_collection(params) {
    return this.post("v4/collections", params)
  }

  //create open collection
  create_collectionOpen(params) {
    return this.post("v4/open_collections", params)
  }

  //create bill
  create_bill(params) {
    return this.post("v3/bills", {
      collection_id: this._collectionId,
      ...params,
    })
  }

  //get bill
  get_bill(billId) {
    return this.get("v3/bills/" + billId)
  }

  //delete bill
  delete_bill(billId) {
    return this.fetcher(this._apiEndpoint + "v3/bills/" + billId, {
      method: "DELETE",
    })
  }

  //change collection status
  // status = 'activate' | 'deactivate'
  change_collection_status(collectionId, status) {
    return this.post(`v3/collections/${collectionId}/${status}`)
  }

  //registration check
  registration_check(bankAccountNumber) {
    return this.get("v3/check/bank_account_number/" + bankAccountNumber)
  }

  // Get payment gateways
  getPaymentGateways() {
    return this.get("v4/payment_gateways")
  }

  getFpxBanks() {
    return this.get("v3/fpx_banks")
  }

  updateOptions(options) {
    const encodedToken = globalThis.Buffer.from(this._apiKey).toString("base64")

    return {
      ...options,
      headers: {
        Authorization: `Basic ${encodedToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    }
  }

  fetcher(url, options) {
    const fetchOptions = this.updateOptions(options)
    log("fetching...", url, options, this.options, fetchOptions)
    return fetch(url, fetchOptions).then((response) => response.json())
  }
}
