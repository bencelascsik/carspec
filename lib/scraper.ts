import axios from "axios"
import * as cheerio from "cheerio"

const API_KEY = process.env.SCRAPER_API_KEY

export async function scrapeCar(url: string) {
  try {
    console.log("Scraping URL:", url)

    // 🔥 ScraperAPI request
    const apiUrl = `http://api.scraperapi.com?api_key=${API_KEY}&url=${encodeURIComponent(
      url
    )}&render=true`

    const { data } = await axios.get(apiUrl)

    const $ = cheerio.load(data)

    // 🧠 TITLE
    let title =
      $("h1").first().text().trim() ||
      $("title").text().trim()

    // 🧠 PRICE (több fallback)
    let price =
      $(".price").first().text().trim() ||
      $("[class*=price]").first().text().trim() ||
      $("*:contains('Ft')").first().text().trim()

    // 🖼️ IMAGES
    const images: string[] = []

    $("img").each((_, el) => {
      const src =
        $(el).attr("src") ||
        $(el).attr("data-src") ||
        $(el).attr("data-original")

      if (
        src &&
        src.startsWith("http") &&
        src.includes("hasznaltauto") &&
        !images.includes(src)
      ) {
        images.push(src)
      }
    })

    // 🧹 CLEANUP
    title = title || "Unknown car"
    price = price || "Price not available"

    console.log("SCRAPED:", { title, price, imagesCount: images.length })

    return {
      title,
      price,
      images: images.slice(0, 5),
    }

  } catch (error: any) {
    console.error("SCRAPER ERROR:", error.message)

    return {
      title: "Unknown car",
      price: "Price not available",
      images: [],
    }
  }
}