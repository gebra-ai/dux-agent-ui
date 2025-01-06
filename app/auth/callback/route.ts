import { isAllowedEmail } from "@/lib/auth/auth-helpers"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next")

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    // Exchange the code for a session
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    // Check if the user's email is allowed
    if (user && !isAllowedEmail(user.email || '')) {
      // Sign out the user if email is not allowed
      await supabase.auth.signOut()
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=Only+@gebra.ai+emails+are+allowed`
      )
    }

    if (error) {
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=Could+not+authenticate+user`
      )
    }
  }

  if (next) {
    return NextResponse.redirect(requestUrl.origin + next)
  } else {
    return NextResponse.redirect(requestUrl.origin)
  }
}
