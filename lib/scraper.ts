import axios from "axios"
import * as cheerio from "cheerio"

export async function scrapeCar(url: string) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept-Language": "hu-HU,hu;q=0.9,en;q=0.8",
      },
    })

    const $ = cheerio.load(data)

    const title = $("h1").first().text().trim() || "Unknown car"
    const price =
      $(".price").first().text().trim() || "Price not available"

    const images: string[] = []
    $("img").each((_, el) => {
      const src = $(el).attr("src")
      if (src && src.includes("hasznaltauto")) {
        images.push(src)
      }
    })

    return {
      title,
      price,
      images: images.slice(0, 5),
    }
  } catch (err) {
    return {
      title: "Unknown car",
      price: "N/A",
      images: [],
    }
  }
}