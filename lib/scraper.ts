import axios from "axios"
import * as cheerio from "cheerio"

const API_KEY = process.env.SCRAPER_API_KEY

export async function scrapeCar(url: string) {
  try {
    console.log("🔍 Scraping:", url)

    if (!API_KEY) {
      throw new Error("Missing SCRAPER_API_KEY")
    }

    const apiUrl = `http://api.scraperapi.com?api_key=${API_KEY}&url=${encodeURIComponent(
      url
    )}&render=true&premium=true&country_code=hu`

    const { data } = await axios.get(apiUrl)

    // DEBUG: nézd meg mit kaptunk vissza
    console.log("📦 HTML length:", data.length)

    const $ = cheerio.load(data)

    // 🧠 TITLE (több fallback)
    let title =
      $("h1").first().text().trim() ||
      $("meta[property='og:title']").attr("content") ||
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

    console.log("✅ RESULT:", {
      title,
      price,
      images: images.length,
    })

    return {
      title,
      price,
      images: images.slice(0, 5),
    }
  } catch (error: any) {
    console.error("❌ SCRAPER ERROR:", error.message)

    return {
      title: "Unknown car",
      price: "Price not available",
      images: [],
    }
  }
}