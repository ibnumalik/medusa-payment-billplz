import cors from "cors"
import { Router } from "express"
import { getConfigFile } from "medusa-core-utils"
import { log } from "../utils/log"

const cache = {}

export default (rd, options) => {
  const app = Router()
  const route = Router()
  const { configModule } = getConfigFile(rd, "medusa-config")
  const { projectConfig } = configModule
  const corsOptions = {
    origin: projectConfig.store_cors.split(","),
    credentials: true,
  }

  app.get("/hello-world", (req, res) => res.json({ msg: 200, options }))
  app.use("/billplz", route)
  route.post("/callback", optionMiddleware(options), handleCallback)
  route.get("/payment_gateway", optionMiddleware(options), getPaymentGateway)
  route.options("/fpx_banks")
  route.get(
    "/fpx_banks",
    cors(corsOptions),
    optionMiddleware({ options }),
    getFpxBanks
  )

  return app
}

function optionMiddleware(options) {
  return (_, res, next) => {
    res.locals.pluginOptions = options
    next()
  }
}

async function getFpxBanks(req, res) {
  try {
    const key = `fpx_banks_billplz`

    if (cache[key]) {
      log("getFpxBanks from cache", cache[key])
      return res.json(cache[key])
    }

    const service = req.scope.resolve("billplzProviderService")

    const fpx = await service.getFpxBanks()
    cache[key] = fpx
    log("getFpxBanks from billplz", cache[key])

    res.json(fpx)
  } catch (error) {
    console.error(error)
    log("getFpxBanks Error", error)
    res.status(500).end()
  }
}

function handleCallback(req, res) {
  log("from billplz callback", req.body)

  res.json({ message: "success", local: res.locals })
}

async function getPaymentGateway(req, res) {
  log("getPaymentGateway", res.locals.pluginOptions)
  try {
    const key = `pgw_billplz`
    let gateways

    if (cache[key]) {
      log("getPaymentGateway from cache", cache[key])
      return res.json(cache[key])
    }

    const service = req.scope.resolve("billplzProviderService")

    gateways = await service.getPaymentGateways()
    cache[key] = gateways
    log("getPaymentGateway from billplz", cache[key])

    res.json(gateways)
  } catch (error) {
    console.error(error)
    log("getPaymentGateway Error", error)
    res.status(500).end()
  }
}

function getComputedXSignature(body, options) {
  const targetKeys = [
    "amount",
    "collection_id",
    "due_at",
    "email",
    "id",
    "mobile",
    "name",
    "paid_amount",
    "paid_at",
    "paid",
    "state",
    "url",
  ]

  const str = targetKeys.reduce((pv, cv, i) => {
    const key = targetKeys[i]
    const value = body[key]
    if (value) {
      pv += `${key}${value}`
    }

    return pv
  }, "")

  return crypto
    .createHmac("sha256", options.xSignature)
    .update(str)
    .digest("hex")
}
