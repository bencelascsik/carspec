"use client"

import { useState, useEffect } from "react"

type Lang = "EN" | "HU" | "DE"
type Theme = "light" | "dark"

export default function Home() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [lang, setLang] = useState<Lang>("EN")
  const [theme, setTheme] = useState<Theme>("dark")

  const t: any = {
    EN: {
      title: "Carspec",
      subtitle: "Instantly analyze any used car listing with AI.",
      placeholder: "Paste car listing URL...",
      button: "Analyze",
    },
    HU: {
      title: "Carspec",
      subtitle: "Használt autók AI elemzése.",
      placeholder: "Illeszd be a linket...",
      button: "Elemzés",
    },
    DE: {
      title: "Carspec",
      subtitle: "Autoanalyse mit KI.",
      placeholder: "Link einfügen...",
      button: "Analysieren",
    },
  }

  useEffect(() => {
    document.documentElement.classList.remove("dark")
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    }
  }, [theme])

  const handleAnalyze = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ url }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error()

      setResult(data)
    } catch {
      setError("Error ❌")
    }

    setLoading(false)
  }

  const score = result?.ai?.score ?? 0

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black dark:bg-black dark:text-white px-4">

      {/* TOP BAR */}
      <div className="absolute top-6 right-6 flex items-center gap-4">

        {/* LANG */}
        <div className="text-sm">
          <button onClick={() => setLang("HU")}>HU</button> |{" "}
          <button onClick={() => setLang("EN")}>EN</button> |{" "}
          <button onClick={() => setLang("DE")}>DE</button>
        </div>

        {/* THEME */}
        <div className="flex gap-2 border rounded-lg px-2 py-1">
          <button onClick={() => setTheme("light")}>☀️</button>
          <button onClick={() => setTheme("dark")}>🌙</button>
        </div>

      </div>

      <h1 className="text-5xl font-bold mb-4">{t[lang].title}</h1>
      <p className="mb-8 opacity-70">{t[lang].subtitle}</p>

      <input
        type="text"
        placeholder={t[lang].placeholder}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full max-w-xl px-6 py-4 rounded-xl bg-gray-100 text-black dark:bg-white dark:text-black mb-4"
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full max-w-xl py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white"
      >
        {loading ? "Analyzing..." : t[lang].button}
      </button>

      {error && <div className="mt-6 text-red-400">{error}</div>}

      {result && (
        <div className="mt-10 w-full max-w-xl p-6 rounded-xl bg-black/40 dark:bg-white/10">

          <h2 className="text-xl font-bold mb-2">
            {result?.car?.title}
          </h2>

          <p className="opacity-70 mb-4">
            {result?.car?.price}
          </p>

          <div className={`p-6 rounded-xl text-center ${
            score >= 7
              ? "bg-green-500/20 text-green-400"
              : score >= 4
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-red-500/20 text-red-400"
          }`}>
            <div>AI Verdict</div>
            <div className="text-2xl font-bold">
              {score >= 7 ? "GOOD DEAL" : score >= 4 ? "AVERAGE" : "AVOID"}
            </div>
            <div>{score}/10</div>
          </div>

        </div>
      )}

    </main>
  )
}