import { appendFile } from "fs"

export const log = (...content) => {
  try {
    const now = new Date().toISOString();
    appendFile("log.txt", `${now}: ${JSON.stringify(content)} \n`, (err) => {
      if (err) throw err

      console.log("Logs saved!")
    })
  } catch (error) {
    console.error(error)
  }
}
