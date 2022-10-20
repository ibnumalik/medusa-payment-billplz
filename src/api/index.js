import { Router } from "express"
import { log } from "../utils/log"

export default () => {
  const app = Router()
  const route = Router()

  app.use("/billplz", route)

  route.post("/callback", (req, res) => {
    log("from billplz callback", req.body)

    res.json({ message: "success" })
  })

  return app
}

function getComputedXSignature(body) {
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
