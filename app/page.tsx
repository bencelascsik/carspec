"use client"

import { useState, useEffect } from "react"

export default function Home() {
  const [link, setLink] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("carspec_history") || "[]")
    setHistory(stored)
  }, [])

  const handleAnalyze = async () => {
    setLoading(true)

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: link })
    })

    const data = await res.json()

    const stored = JSON.parse(localStorage.getItem("carspec_history") || "[]")
    const newHistory = [data, ...stored].slice(0, 10)
    localStorage.setItem("carspec_history", JSON.stringify(newHistory))
    setHistory(newHistory)

    setResult(data)
    setLoading(false)
  }

  const getVerdict = (score: number) => {
    if (score >= 7) return "BUY"
    if (score >= 4) return "MAYBE"
    return "AVOID"
  }

  return (
    <main className="min-h-screen bg-[#0b0b0c] text-white flex flex-col items-center px-6 py-20">

      <h1 className="text-5xl mb-6">Carspec</h1>

      <input
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Paste car listing link..."
        className="px-4 py-3 rounded-xl text-black w-full max-w-xl"
      />

      <button
        onClick={handleAnalyze}
        className="mt-4 px-6 py-3 bg-blue-600 rounded-xl"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {/* RESULT */}
      {result && (
        <div className="mt-12 w-full max-w-xl">

          {/* 🔥 HERO */}
          <div
            className={`rounded-3xl p-8 mb-6 text-center ${
              result.ai?.score >= 7
                ? "bg-green-500/10 border border-green-500/30"
                : result.ai?.score >= 4
                ? "bg-yellow-500/10 border border-yellow-500/30"
                : "bg-red-500/10 border border-red-500/30"
            }`}
          >
            {/* TOOLTIP LABEL */}
            <div className="relative group text-sm text-gray-400 mb-2 cursor-pointer">
              AI Verdict

              <div className="absolute hidden group-hover:block top-6 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
                AI decision based on price, risk and listing quality
              </div>
            </div>

            {/* BIG TEXT */}
            <div
              className={`text-5xl font-bold mb-2 ${
                result.ai?.score >= 7
                  ? "text-green-400"
                  : result.ai?.score >= 4
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {getVerdict(result.ai?.score)}
            </div>

            <div className="text-lg text-gray-300">
              {result.ai?.score}/10 score
            </div>
          </div>

          {/* IMAGE */}
          {result.images?.length > 0 && (
            <img
              src={result.images[0]}
              className="w-full h-64 object-cover rounded-2xl mb-6"
            />
          )}

          <h2 className="text-2xl mb-2">{result.title}</h2>
          <p className="text-gray-400 mb-6">{result.price}</p>

          <div className="bg-black/40 p-4 rounded-xl text-sm">
            {result.ai?.analysis}
          </div>

          {/* SHARE */}
          {result.shareUrl && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  window.location.origin + result.shareUrl
                )
                alert("Link copied!")
              }}
              className="mt-4 px-4 py-2 bg-white/10 rounded-xl"
            >
              Share report
            </button>
          )}

        </div>
      )}

      {/* HISTORY */}
      {history.length > 0 && (
        <div className="mt-10 w-full max-w-xl">
          <h3 className="mb-4 text-gray-400">Previous analyses</h3>

          {history.map((item, i) => (
            <div
              key={i}
              onClick={() => setResult(item)}
              className="p-3 bg-white/5 rounded-xl mb-2 cursor-pointer"
            >
              {item.title}
            </div>
          ))}
        </div>
      )}

    </main>
  )
}