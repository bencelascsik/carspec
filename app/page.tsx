"use client"

import { useState } from "react"

export default function Home() {
  const [link, setLink] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    try {
      setLoading(true)

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: link })
      })

      const data = await res.json()
      setResult(data)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0b0c] text-white flex flex-col items-center px-6 py-20">

      {/* HEADER */}
      <h1 className="text-5xl font-semibold tracking-tight mb-4">
        Carspec
      </h1>

      <p className="text-gray-400 mb-10 text-center max-w-md">
        Instantly analyze any used car listing with AI.
        Know if it’s a good deal or a mistake.
      </p>

      {/* INPUT */}
      <div className="w-full max-w-xl flex flex-col gap-4">

        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Paste car listing link..."
          className="w-full px-5 py-4 rounded-2xl bg-white text-black text-lg outline-none shadow-md"
        />

        <button
          onClick={handleAnalyze}
          className="w-full py-4 rounded-2xl bg-blue-600 text-white font-medium text-lg shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition"
        >
          {loading ? "Analyzing..." : "Analyze Car"}
        </button>

      </div>

      {/* RESULT */}
      {result && (
        <div className="mt-16 w-full max-w-xl bg-[#111113] rounded-3xl p-6 shadow-lg border border-white/10">

          <h2 className="text-2xl font-semibold mb-1">
            {result.title || "Unknown car"}
          </h2>

          <p className="text-gray-400 mb-6">
            {result.price || "Price not available"}
          </p>

          {/* AI OUTPUT */}
          <div className="bg-black/40 p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap text-gray-200">
            {result.ai || "No analysis available"}
          </div>

        </div>
      )}

    </main>
  )
}