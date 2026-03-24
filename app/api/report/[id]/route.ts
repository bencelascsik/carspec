"use client"

import { useEffect, useState } from "react"

export default function ReportPage({
  params,
}: {
  params: { id: string }
}) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/report/${params.id}`)
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0b0c] text-white flex items-center justify-center">
        Loading report...
      </main>
    )
  }

  if (!data || data.error) {
    return (
      <main className="min-h-screen bg-[#0b0b0c] text-white flex items-center justify-center">
        Report not found
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0b0b0c] text-white flex flex-col items-center px-6 py-20">

      {/* HEADER */}
      <h1 className="text-4xl font-semibold mb-6">
        Carspec Report
      </h1>

      <div className="w-full max-w-xl bg-[#111113] rounded-3xl p-6 border border-white/10">

        <h2 className="text-2xl font-semibold mb-2">
          {data.title}
        </h2>

        <p className="text-gray-400 mb-6">
          {data.price}
        </p>

        {/* SCORE */}
        <div className="flex items-center justify-between mb-6">

          <div className="text-4xl font-bold">
            {data.ai?.score}/10
          </div>

          <div
            className={`px-4 py-2 rounded-full text-sm ${
              data.ai?.score >= 7
                ? "bg-green-500/20 text-green-400"
                : data.ai?.score >= 4
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {data.ai?.score >= 7
              ? "GOOD DEAL"
              : data.ai?.score >= 4
              ? "AVERAGE"
              : "AVOID"}
          </div>

        </div>

        {/* ANALYSIS */}
        <div className="bg-black/40 p-4 rounded-xl text-sm leading-relaxed text-gray-200 whitespace-pre-wrap">
          {data.ai?.analysis}
        </div>

      </div>

    </main>
  )
}