import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  console.log("Locale-aware redirect handler executed:", request.url);

  try {
    const requestUrl = new URL(request.url)
    const accessToken = requestUrl.searchParams.get("access_token")
    const refreshToken = requestUrl.searchParams.get("refresh_token")

    if (!accessToken || !refreshToken) {
      console.error("Missing tokens in redirect")
      return new NextResponse(JSON.stringify({ error: "Missing authentication tokens" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    })

    if (error || !data.session) {
      console.error("Session error:", error)
      return new NextResponse(JSON.stringify({ error: error?.message || "No session established" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { data: homeWorkspace, error: workspaceError } = await supabase
      .from("workspaces")
      .select("*")
      .eq("user_id", data.session.user.id)
      .eq("is_home", true)
      .single()

    if (workspaceError || !homeWorkspace) {
      return NextResponse.redirect(`${requestUrl.origin}/setup`)
    }

    return NextResponse.redirect(`${requestUrl.origin}/${homeWorkspace.id}/chat`)

  } catch (error: any) {
    console.error("Authentication error:", error)
    return new NextResponse(JSON.stringify({ error: error.message || "Unknown error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}