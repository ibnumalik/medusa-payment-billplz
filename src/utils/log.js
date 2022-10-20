import { appendFile } from "fs"

export const log = (...content) => {
  try {
    appendFile("log.txt", JSON.stringify(content) + "\n", (err) => {
      if (err) throw err

      console.log("Logs saved!")
    })
  } catch (error) {
    console.error(error)
  }
}
