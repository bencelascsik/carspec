import { notFound } from "next/navigation"
import fs from "fs"
import path from "path"

export default async function ReportPage({
  params,
}: {
  params: { id: string }
}) {
  const filePath = path.join(process.cwd(), "app/data/reports.json")

  if (!fs.existsSync(filePath)) {
    return notFound()
  }

  const file = fs.readFileSync(filePath, "utf-8")
  const reports = JSON.parse(file)

  const data = reports[params.id]

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
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-12">
      <div className="max-w-3xl w-full space-y-8">

        {/* TITLE */}
        <div>
          <h1 className="text-3xl font-bold">
            {data.title || "Unknown car"}
          </h1>
          <p className="text-gray-400 mt-2">
            {data.price || "Price not available"}
          </p>
        </div>

        {/* HERO SCORE */}
        <div className="flex items-center justify-between bg-white/5 p-6 rounded-2xl border border-white/10">
          <div>
            <p className="text-gray-400 text-sm">AI Score</p>
            <p className="text-5xl font-bold">
              {score} <span className="text-lg text-gray-400">/ 10</span>
            </p>
          </div>

          <div
            className={`px-4 py-2 rounded-full text-sm font-semibold ${color}`}
          >
            {verdict}
          </div>
        </div>

        {/* ANALYSIS */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <p className="text-sm text-gray-400 mb-2">Analysis</p>
          <p className="leading-relaxed text-gray-200">
            {data.ai?.analysis || "No analysis available"}
          </p>
        </div>

        {/* IMAGES */}
        {data.images?.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {data.images.map((img: string, i: number) => (
              <img
                key={i}
                src={img}
                className="rounded-xl object-cover w-full h-40"
              />
            ))}
          </div>
        )}

      </div>
    </main>
  )
}