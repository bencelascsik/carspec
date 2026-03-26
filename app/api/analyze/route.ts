import fs from "fs"
import path from "path"

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    if (!url) {
      return Response.json({ error: "Missing URL" }, { status: 400 })
    }

    // 🔥 FAKE AI (teszthez)
    const ai = {
      score: Math.floor(Math.random() * 10) + 1,
      verdict: "AI result",
      analysis: "This is a demo analysis.",
    }

    const id = Math.random().toString(36).substring(2, 10)

    const filePath = path.join(process.cwd(), "app/data/reports.json")

    let reports: any = {}

    if (fs.existsSync(filePath)) {
      const file = fs.readFileSync(filePath, "utf-8")
      reports = JSON.parse(file || "{}")
    }

    reports[id] = {
      url,
      ai,
      createdAt: new Date().toISOString(),
    }

    fs.writeFileSync(filePath, JSON.stringify(reports, null, 2))

    return Response.json({ id })

  } catch (error: any) {
    return Response.json(
      { error: error.message || "Error" },
      { status: 500 }
    )
  }
}