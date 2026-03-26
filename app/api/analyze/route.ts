import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json({ error: "No URL" }, { status: 400 })
    }

    const score = Math.floor(Math.random() * 10) + 1

    const verdict =
      score >= 7 ? "GOOD DEAL" : score >= 4 ? "AVERAGE" : "AVOID"

    const id = Date.now().toString()

    const { error } = await supabase.from("reports").insert({
      id,
      url,
      score,
      verdict,
    })

    if (error) {
      console.error(error)
      return NextResponse.json({ error: "DB error" }, { status: 500 })
    }

    return NextResponse.json({ id })
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}