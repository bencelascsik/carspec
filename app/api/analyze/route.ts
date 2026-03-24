import OpenAI from "openai"
import { scrapeCar } from "@/lib/scraper"
import { v4 as uuidv4 } from "uuid"
import fs from "fs"
import path from "path"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { url } = body

    // 🔎 SCRAPE
    const car = await scrapeCar(url)

    // 🤖 AI PROMPT
    const prompt = `
You are an expert car inspector.

Analyze this used car listing:

Title: ${car.title}
Price: ${car.price}

Respond STRICTLY in JSON:

{
  "score": number (1-10),
  "verdict": "good / average / bad",
  "analysis": "short explanation in simple language"
}
`

    const response = await openai.responses.create({
      model: "gpt-5-nano",
      input: prompt,
    })

    // 🧠 PARSE AI
    let aiData

    try {
      aiData = JSON.parse(response.output_text)
    } catch {
      aiData = {
        score: 5,
        verdict: "average",
        analysis: response.output_text
      }
    }

    // 🆔 GENERATE ID
    const id = uuidv4()

    const report = {
      id,
      ...car,
      ai: aiData,
      createdAt: new Date().toISOString()
    }

    // 📁 SAVE TO FILE
    const filePath = path.join(process.cwd(), "data", "reports.json")

    // ha nincs file → create
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]")
    }

    const fileData = fs.readFileSync(filePath, "utf-8")
    const reports = JSON.parse(fileData)

    reports.unshift(report)

    fs.writeFileSync(filePath, JSON.stringify(reports, null, 2))

    // 🔗 RETURN SHARE LINK
    return Response.json({
      ...report,
      shareUrl: `/report/${id}`
    })

  } catch (error: any) {
    console.error("ERROR:", error)

    return Response.json({
      error: error.message
    })
  }
}