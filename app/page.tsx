"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"

export default function Home() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState("dark")
  const [lang, setLang] = useState("hu")

  // THEME APPLY
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(theme)
  }, [theme])

  // TEXTS
  const t = {
    hu: {
      title: "carspec",
      subtitle:
        "Használtautók elemzése gyorsan és könnyedén, egy gombnyomásra.",
      placeholder: "Illeszd be a linket...",
      button: "Elemzés",
      loading: "Elemzés...",
    },
    en: {
      title: "carspec",
      subtitle: "Analyze used cars instantly with AI.",
      placeholder: "Paste car listing link...",
      button: "Analyze",
      loading: "Analyzing...",
    },
    de: {
      title: "carspec",
      subtitle: "Gebrauchtwagen sofort mit KI analysieren.",
      placeholder: "Link einfügen...",
      button: "Analysieren",
      loading: "Analyse läuft...",
    },
  }[lang]

  const handleAnalyze = async () => {
    if (!url) return alert("Add meg a linket!")

    setLoading(true)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ url }),
      })

      const data = await res.json()

      if (!data.id) throw new Error()

      window.location.href = `/report/${data.id}`
    } catch {
      alert("Hiba történt ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className={`
        min-h-screen flex flex-col items-center justify-center px-6
        transition-all duration-500
        ${
          theme === "dark"
            ? "bg-black text-white"
            : "bg-white text-black"
        }
      `}
    >
      {/* TOP BAR */}
      <div className="absolute top-6 right-6 flex items-center gap-6 text-sm opacity-80">
        {/* LANGUAGE */}
        <div className="flex gap-2">
          {["hu", "en", "de"].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`hover:opacity-100 transition ${
                lang === l ? "font-bold underline" : ""
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* THEME SWITCH */}
        <div className="flex items-center border border-white/20 rounded-xl p-1 backdrop-blur bg-white/5">
          <button
            onClick={() => setTheme("light")}
            className={`p-2 rounded-lg transition ${
              theme === "light"
                ? "bg-white text-black"
                : "hover:bg-white/10"
            }`}
          >
            <Sun size={16} />
          </button>

          <button
            onClick={() => setTheme("dark")}
            className={`p-2 rounded-lg transition ${
              theme === "dark"
                ? "bg-white text-black"
                : "hover:bg-white/10"
            }`}
          >
            <Moon size={16} />
          </button>
        </div>
      </div>

      {/* TITLE */}
      <h1 className="text-6xl font-bold mb-4 tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
        {t.title}
      </h1>

      {/* SUBTITLE */}
      <p className="opacity-60 mb-10 text-center max-w-xl">
        {t.subtitle}
      </p>

      {/* INPUT */}
      <div className="w-full max-w-xl space-y-4">
        <input
          type="text"
          placeholder={t.placeholder}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="
            w-full px-6 py-4 rounded-2xl outline-none
            bg-white/10 backdrop-blur text-white
            border border-white/10
            focus:border-blue-500 transition
          "
        />

        {/* BUTTON */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`
            w-full py-4 rounded-2xl font-medium text-lg
            transition-all duration-300
            ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 active:scale-[0.97]"
            }
            shadow-lg hover:shadow-blue-500/30
          `}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {t.loading}
            </div>
          ) : (
            t.button
          )}
        </button>
      </div>

      {/* FOOTER */}
      <p className="mt-10 text-sm opacity-40">
        carspec • AI powered
      </p>
    </main>
  )
}