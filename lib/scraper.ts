import axios from "axios"
import * as cheerio from "cheerio"

export async function scrapeCar(url: string) {
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
    }
  })

  const $ = cheerio.load(data)

  const title = $("h1").first().text().trim()

  const price = $("*[class*=price]").first().text().trim()

  const details: any = {}

  $("tr").each((_, el) => {
    const key = $(el).find("td").first().text().trim()
    const value = $(el).find("td").last().text().trim()

    if (key && value) {
      details[key] = value
    }
  })

  console.log("SCRAPED:", title, price)

  return {
    title: title || "Unknown car",
    price: price || "Price not available",
    details
  }
}