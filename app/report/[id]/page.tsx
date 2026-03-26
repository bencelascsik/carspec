"use client"

import { useSearchParams } from "next/navigation"

export default function ReportPage() {
  const params = useSearchParams()

  const score = Number(params.get("score") || 0)
  const verdict = params.get("verdict") || "UNKNOWN"

  const color =
    score >= 7
      ? "bg-green-500/20 text-green-400"
      : score >= 4
      ? "bg-yellow-500/20 text-yellow-400"
      : "bg-red-500/20 text-red-400"

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className={`p-10 rounded-2xl text-center ${color}`}>
        <p className="opacity-60 mb-2">AI Verdict</p>
        <h1 className="text-5xl font-bold mb-4">{verdict}</h1>
        <p className="text-xl">{score}/10</p>
      </div>
    </main>
  )
}