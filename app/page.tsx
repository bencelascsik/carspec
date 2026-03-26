"use client"

import { useState } from "react"

export default function Home() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleAnalyze = async () => {
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ url }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Error")
        setLoading(false)
        return
      }

      setResult(data)
    } catch (err) {
      setError("Network error")
    }

    setLoading(false)
  }

  const score = result?.ai?.score ?? 0

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <h1 className="text-5xl font-bold mb-4">Carspec</h1>
      <p className="opacity-70 mb-6">
        Instantly analyze any used car listing with AI.
      </p>

      <input
        type="text"
        placeholder="Paste car listing URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full max-w-xl px-6 py-4 rounded-xl bg-white text-black mb-4"
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full max-w-xl py-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition text-white font-medium"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {/* ERROR */}
      {error && (
        <div className="mt-6 text-red-400">{error}</div>
      )}

      {/* RESULT */}
      {result && (
        <div className="mt-10 w-full max-w-xl p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">

          <h2 className="text-xl font-semibold mb-2">
            {result?.car?.title || "Car"}
          </h2>

          <p className="opacity-70 mb-6">
            {result?.car?.price || "No price"}
          </p>

          {/* VERDICT */}
          <div
            className={`p-6 rounded-xl text-center mb-6 ${
              score >= 7
                ? "bg-green-500/20 text-green-400"
                : score >= 4
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            <div className="text-sm opacity-70 mb-2">AI Verdict</div>
            <div className="text-3xl font-bold">
              {score >= 7
                ? "GOOD DEAL"
                : score >= 4
                ? "AVERAGE"
                : "AVOID"}
            </div>
            <div className="text-sm mt-1">{score}/10</div>
          </div>

          {/* ANALYSIS */}
          <div className="text-sm opacity-80">
            {result?.ai?.analysis || "No analysis"}
          </div>
        </div>
      )}

      <p className="mt-10 opacity-50 text-sm">
        Carspec • AI powered
      </p>
    </main>
  )
}