import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get the chat ID from the URL query parameters
    const { searchParams } = new URL(request.url)
    const chatId = searchParams.get("chatId")
    
    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      )
    }

    // Call the backend API to get active flow stages
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/chat-flow/active`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-chat-id': chatId
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Backend returned status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching active chat flow:", error)
    return NextResponse.json(
      { error: "Failed to fetch active chat flow" },
      { status: 500 }
    )
  }
}