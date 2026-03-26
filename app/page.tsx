"use client"

import { useState, useEffect } from "react"

type Lang = "en" | "hu" | "de"
type Theme = "light" | "dark" | "auto"

export default function Home() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState<Lang>("en")
  const [theme, setTheme] = useState<Theme>("auto")

  const texts = {
    en: {
      title: "Carspec",
      subtitle: "Instantly analyze any used car listing with AI.",
      placeholder: "Paste car listing URL...",
      button: "Analyze Car",
      loading: "Analyzing...",
    },
    hu: {
      title: "Carspec",
      subtitle: "Elemezz használt autókat AI segítségével.",
      placeholder: "Illeszd be a linket...",
      button: "Elemzés",
      loading: "Elemzés...",
    },
    de: {
      title: "Carspec",
      subtitle: "Analysiere Autos mit KI.",
      placeholder: "Link einfügen...",
      button: "Analysieren",
      loading: "Analyse...",
    },
  }

  const t = texts[lang]

  useEffect(() => {
    const root = document.documentElement

    if (theme === "dark") {
      root.classList.add("dark")
    } else if (theme === "light") {
      root.classList.remove("dark")
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      root.classList.toggle("dark", prefersDark)
    }
  }, [theme])

  const handleAnalyze = async () => {
    if (!url) return

    setLoading(true)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error()

      window.location.href = `/report/${data.id}`
    } catch (err) {
      alert("Error ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-white text-black dark:bg-black dark:text-white">

      {/* TOP BAR */}
      <div className="absolute top-6 right-6 flex gap-3">

        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
          className="px-3 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black"
        >
          <option value="en">EN</option>
          <option value="hu">HU</option>
          <option value="de">DE</option>
        </select>

        <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">

          <button onClick={() => setTheme("light")} className="px-3 py-2">
            ☀️
          </button>

          <button onClick={() => setTheme("dark")} className="px-3 py-2">
            🌙
          </button>

          <button onClick={() => setTheme("auto")} className="px-3 py-2">
            ⚙️
          </button>

        </div>
      </div>

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-6xl font-semibold">{t.title}</h1>
        <p className="mt-4 opacity-70">{t.subtitle}</p>
      </div>

      {/* INPUT */}
      <div className="w-full max-w-2xl space-y-4">

        <input
          type="text"
          placeholder={t.placeholder}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-6 py-4 rounded-2xl bg-gray-100 text-black dark:bg-white dark:text-black outline-none"
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full py-4 rounded-2xl text-lg font-medium bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white disabled:bg-blue-400"
        >
          {loading ? t.loading : t.button}
        </button>

      </div>

      {/* FOOTER */}
      <p className="mt-10 text-sm opacity-50">
        Carspec • AI powered
      </p>

    </main>
  )
}