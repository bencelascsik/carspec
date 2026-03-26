"use client"

import { useState, useEffect } from "react"

export default function Home() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [lang, setLang] = useState("EN")
  const [theme, setTheme] = useState("dark")

  // 🌍 TRANSLATIONS
  const t: any = {
    EN: {
      title: "Carspec",
      subtitle: "Instantly analyze any used car listing with AI.",
      placeholder: "Paste car listing URL...",
      button: "Analyze",
      loading: "Analyzing...",
    },
    HU: {
      title: "Carspec",
      subtitle: "Használt autók AI elemzése.",
      placeholder: "Illeszd be a hirdetés linkjét...",
      button: "Elemzés",
      loading: "Elemzés...",
    },
    DE: {
      title: "Carspec",
      subtitle: "Gebrauchtwagen mit KI analysieren.",
      placeholder: "Link einfügen...",
      button: "Analysieren",
      loading: "Analysiere...",
    },
  }

  // 🌙 THEME SWITCH
  useEffect(() => {
    document.documentElement.classList.remove("dark")
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    }
  }, [theme])

  // 🚀 ANALYZE FUNCTION
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

      if (!res.ok) {
        throw new Error(data.error || "Error")
      }

      // ✅ NO REDIRECT
      setResult(data)

    } catch (err) {
      setError("Error occurred")
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black dark:bg-black dark:text-white transition-all px-4">

      {/* TOP BAR */}
      <div className="absolute top-6 right-6 flex items-center gap-4">

        {/* LANGUAGE */}
        <div className="text-sm opacity-70">
          <button onClick={() => setLang("HU")}>HU</button> |{" "}
          <button onClick={() => setLang("EN")}>EN</button> |{" "}
          <button onClick={() => setLang("DE")}>DE</button>
        </div>

        {/* THEME */}
        <div className="flex gap-2 border rounded-lg px-2 py-1">
          <button onClick={() => setTheme("light")}>☀️</button>
          <button onClick={() => setTheme("dark")}>🌙</button>
          <button onClick={() => setTheme("auto")}>⚙️</button>
        </div>

      </div>

      {/* TITLE */}
      <h1 className="text-5xl font-bold mb-4">{t[lang].title}</h1>
      <p className="mb-8 opacity-70">{t[lang].subtitle}</p>

      {/* INPUT */}
      <div className="w-full max-w-xl flex flex-col gap-4">
        <input
          type="text"
          placeholder={t[lang].placeholder}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-100 text-black dark:bg-white dark:text-black outline-none"
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white ${
            loading
              ? "bg-blue-400"
              : "bg-blue-600 hover:bg-blue-500 active:scale-95"
          } transition-all`}
        >
          {loading ? t[lang].loading : t[lang].button}
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mt-6 bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="mt-10 w-full max-w-xl">

          {/* VERDICT */}
          <div className={`p-6 rounded-xl text-center mb-6 ${
            result.ai.score >= 7
              ? "bg-green-500/20 text-green-400"
              : result.ai.score >= 4
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-red-500/20 text-red-400"
          }`}>
            <p className="opacity-70 mb-2">AI Verdict</p>
            <h2 className="text-3xl font-bold">{result.ai.verdict}</h2>
            <p>{result.ai.score}/10</p>
          </div>

          {/* CAR DATA */}
          <div className="bg-black/40 dark:bg-white/10 p-4 rounded-xl mb-4">
            <p><b>{result.car.title}</b></p>
            <p>Price: {result.car.price}</p>
            <p>Mileage: {result.car.mileage}</p>
            <p>Year: {result.car.year}</p>
          </div>

          {/* ANALYSIS */}
          <div className="bg-black/40 dark:bg-white/10 p-4 rounded-xl text-sm">
            {result.ai.analysis}
          </div>

        </div>
      )}

      {/* FOOTER */}
      <p className="mt-10 text-sm opacity-50">Carspec • AI powered</p>

    </main>
  )
}