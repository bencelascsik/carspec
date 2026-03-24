import OpenAI from "openai"
import { scrapeCar } from "@/lib/scraper"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { url } = body

    if (!url) {
      return Response.json({ error: "Missing URL" })
    }

    // 1. SCRAPE
    const car = await scrapeCar(url)

    // 2. PROMPT
    const prompt = `
You are a professional car evaluator.

Car data:
Title: ${car.title}
Price: ${car.price}
Details: ${JSON.stringify(car.details)}

Analyze:
- Is the price fair compared to the market?
- Any red flags?
- Would you personally buy it?

Respond ONLY in JSON format:
{
  "score": number (1-10),
  "verdict": "good deal / average / overpriced",
  "analysis": "short explanation"
}
`

    // 3. AI CALL
    const response = await openai.responses.create({
      model: "gpt-5-nano",
      input: prompt,
    })

    const aiText = response.output_text

    // 4. RETURN
    return Response.json({
      ...car,
      ai: aiText
    })

  } catch (error: any) {
    console.error(error)

    return Response.json({
      error: error.message || "Something went wrong"
    })
  }
}