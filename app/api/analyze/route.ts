import OpenAI from "openai"
import { scrapeCar } from "@/lib/scraper"
import fs from "fs"
import path from "path"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    if (!url) {
      return Response.json({ error: "Missing URL" }, { status: 400 })
    }

    // 🔍 SCRAPE
    const car = await scrapeCar(url)

    // 🤖 AI PROMPT
    const prompt = `
You are a car expert.

Analyze this car listing:

Title: ${car.title}
Price: ${car.price}

Give a short evaluation:
- Is it overpriced or underpriced?
- Any red flags?
- Should someone buy it?

Respond ONLY in JSON:
{
  "score": number (1-10),
  "verdict": "good deal / average / overpriced",
  "analysis": "short explanation"
}
`

    const response = await openai.responses.create({
      model: "gpt-5-nano",
      input: prompt,
    })

    let ai = {
      score: 0,
      verdict: "unknown",
      analysis: "No analysis",
    }

    try {
      ai = JSON.parse(response.output_text || "{}")
    } catch {
      console.log("AI parse error")
    }

    // 🆔 ID
    const id = Math.random().toString(36).substring(2, 10)

    // 📁 SAVE
    const filePath = path.join(process.cwd(), "app/data/reports.json")

    let reports: any = {}

    if (fs.existsSync(filePath)) {
      const file = fs.readFileSync(filePath, "utf-8")
      reports = JSON.parse(file || "{}")
    }

    reports[id] = {
      title: car.title,
      price: car.price,
      images: car.images,
      ai,
      createdAt: new Date().toISOString(),
    }

    fs.writeFileSync(filePath, JSON.stringify(reports, null, 2))

    // ✅ RESPONSE
    return Response.json({ id })

  } catch (error: any) {
    console.error("ANALYZE ERROR:", error)

    return Response.json(
      { error: error.message || "Internal error" },
      { status: 500 }
    )
  }
}