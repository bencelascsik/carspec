export const runtime = "nodejs"

import fs from "fs"
import path from "path"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { url } = body

    if (!url) {
      return new Response(JSON.stringify({ error: "Missing URL" }), {
        status: 400,
      })
    }

    const id = Date.now().toString()

    const result = {
      id,
      car: {
        title: "Mercedes-Benz C43 AMG",
        price: "13 990 000 Ft",
        mileage: "120 000 km",
        year: "2018",
      },
      ai: {
        score: Math.floor(Math.random() * 10),
        analysis:
          "This car looks decent based on price and mileage. Further inspection recommended.",
      },
    }

    const filePath = path.join(process.cwd(), "app/data/reports.json")

    let reports: any = {}

    if (fs.existsSync(filePath)) {
      const file = fs.readFileSync(filePath, "utf-8")
      reports = JSON.parse(file || "{}")
    }

    reports[id] = result

    fs.writeFileSync(filePath, JSON.stringify(reports, null, 2))

    // 🔥 FONTOS: teljes result megy vissza
    return new Response(JSON.stringify(result), {
      status: 200,
    })
  } catch (err) {
    console.error("API ERROR:", err)

    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    })
  }
}