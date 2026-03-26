import { notFound } from "next/navigation"
import fs from "fs"
import path from "path"

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // 🔥 EZ A LÉNYEG
  const { id } = await params

  const filePath = path.join(process.cwd(), "app/data/reports.json")

  if (!fs.existsSync(filePath)) {
    return notFound()
  }

  const file = fs.readFileSync(filePath, "utf-8")
  const reports = JSON.parse(file)

  const data = reports[id]

  if (!data) {
    return notFound()
  }

  const score = data.ai?.score || 0

  const verdict =
    score >= 7 ? "GOOD DEAL" : score >= 4 ? "AVERAGE" : "AVOID"

  const color =
    score >= 7
      ? "bg-green-500/20 text-green-400"
      : score >= 4
      ? "bg-yellow-500/20 text-yellow-400"
      : "bg-red-500/20 text-red-400"

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="max-w-xl w-full p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">

        <h1 className="text-2xl font-bold mb-4">
          {data.car?.title || "Car"}
        </h1>

        <p className="opacity-70 mb-6">
          {data.car?.price || "No price"}
        </p>

        <div className={`p-6 rounded-xl text-center ${color}`}>
          <div className="text-sm opacity-70 mb-2">AI Verdict</div>
          <div className="text-3xl font-bold">{verdict}</div>
          <div className="text-sm mt-1">{score}/10</div>
        </div>

        <div className="mt-6 text-sm opacity-80">
          {data.ai?.analysis || "No analysis"}
        </div>
      </div>
    </main>
  )
}