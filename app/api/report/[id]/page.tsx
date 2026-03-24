"use client"

import { useEffect, useState } from "react"

export default function ReportPage({
  params,
}: {
  params: { id: string }
}) {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/report/${params.id}`)
      .then(res => res.json())
      .then(setData)
  }, [params.id])

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0b0b0c] text-white">
        Loading...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0b0b0c] text-white flex flex-col items-center px-6 py-20">

      <h1 className="text-4xl mb-6">Carspec Report</h1>

      <div className="w-full max-w-xl bg-[#111113] p-6 rounded-3xl">

        {/* IMAGES */}
        {data.images?.length > 0 && (
          <img
            src={data.images[0]}
            className="w-full h-64 object-cover rounded-2xl mb-6"
          />
        )}

        <h2 className="text-2xl mb-2">{data.title}</h2>
        <p className="text-gray-400 mb-6">{data.price}</p>

        <div className="flex justify-between mb-6">
          <div className="text-4xl">{data.ai?.score}/10</div>

          <div className={`px-4 py-2 rounded-full ${
            data.ai?.score >= 7
              ? "bg-green-500/20 text-green-400"
              : data.ai?.score >= 4
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-red-500/20 text-red-400"
          }`}>
            {data.ai?.score >= 7
              ? "GOOD DEAL"
              : data.ai?.score >= 4
              ? "AVERAGE"
              : "AVOID"}
          </div>
        </div>

        <div className="bg-black/40 p-4 rounded-xl text-sm">
          {data.ai?.analysis}
        </div>

      </div>

    </main>
  )
}