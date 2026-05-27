import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { z } from "zod"

const createBuildSchema = z.object({
  name: z.string().min(1).max(100),
  role: z.enum(["tank", "healer", "dps"]),
  class: z.string().min(1),
  gear: z.array(z.object({
    slot: z.string(),
    itemId: z.number(),
    quality: z.number(),
    trait: z.string(),
    enchant: z.string(),
  })).default([]),
  skills: z.array(z.object({
    slot: z.number(),
    abilityId: z.number(),
  })).default([]),
  cp: z.record(z.string(), z.number()).default({}),
})

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from("builds")
    .select("*")
    .eq("owner_id", session.user.id)
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = createBuildSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from("builds")
    .insert({ ...parsed.data, owner_id: session.user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
