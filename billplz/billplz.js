"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _log = require("../utils/log");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var baseUrl = "https://www.billplz.com/api/";
var sandboxBaseUrl = "https://www.billplz-sandbox.com/api/";

var Billplz = /*#__PURE__*/function () {
  function Billplz(options) {
    (0, _classCallCheck2["default"])(this, Billplz);
    this.options = options;
    this._isSandbox = !options.production;
    this._apiKey = options.api_key;
    this._collectionId = options.collection_id;
    this._xSignatureKey = options.x_signature_key;
    this._apiEndpoint = this._isSandbox ? sandboxBaseUrl : baseUrl;
  }

  (0, _createClass2["default"])(Billplz, [{
    key: "post",
    value: function post(path, params) {
      var url = this._apiEndpoint + path;
      return this.fetcher(url, {
        method: "POST",
        body: JSON.stringify(params)
      });
    }
  }, {
    key: "get",
    value: function get(path) {
      var url = this._apiEndpoint + path;
      return this.fetcher(url, {
        method: "GET"
      });
    } //create collection

  }, {
    key: "create_collection",
    value: function create_collection(params) {
      return this.post("v4/collections", params);
    } //create open collection

  }, {
    key: "create_collectionOpen",
    value: function create_collectionOpen(params) {
      return this.post("v4/open_collections", params);
    } //create bill

  }, {
    key: "create_bill",
    value: function create_bill(params) {
      return this.post("v3/bills", _objectSpread({
        collection_id: this._collectionId
      }, params));
    } //get bill

  }, {
    key: "get_bill",
    value: function get_bill(billId) {
      return this.get("v3/bills/" + billId);
    } //delete bill

  }, {
    key: "delete_bill",
    value: function delete_bill(billId) {
      return this.fetcher(this._apiEndpoint + "v3/bills/" + billId, {
        method: "DELETE"
      });
    } //change collection status
    // status = 'activate' | 'deactivate'

  }, {
    key: "change_collection_status",
    value: function change_collection_status(collectionId, status) {
      return this.post("v3/collections/".concat(collectionId, "/").concat(status));
    } //registration check

  }, {
    key: "registration_check",
    value: function registration_check(bankAccountNumber) {
      return this.get("v3/check/bank_account_number/" + bankAccountNumber);
    } // Get payment gateways

  }, {
    key: "getPaymentGateways",
    value: function getPaymentGateways() {
      return this.get("v4/payment_gateways");
    }
  }, {
    key: "getFpxBanks",
    value: function getFpxBanks() {
      return this.get("v3/fpx_banks");
    }
  }, {
    key: "updateOptions",
    value: function updateOptions(options) {
      var encodedToken = globalThis.Buffer.from(this._apiKey).toString("base64");
      return _objectSpread(_objectSpread({}, options), {}, {
        headers: _objectSpread({
          Authorization: "Basic ".concat(encodedToken),
          "Content-Type": "application/json"
        }, options.headers)
      });
    }
  }, {
    key: "fetcher",
    value: function fetcher(url, options) {
      var fetchOptions = this.updateOptions(options);
      (0, _log.log)("fetching...", url, options, this.options, fetchOptions);
      return (0, _nodeFetch["default"])(url, fetchOptions).then(function (response) {
        return response.json();
      });
    }
  }]);
  return Billplz;
}();

exports["default"] = Billplz;