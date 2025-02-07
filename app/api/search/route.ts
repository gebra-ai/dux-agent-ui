import { NextRequest, NextResponse } from "next/server"

interface SearchRequest {
  query: string
  isSemanticSearch: boolean
  chat_id: string
  db_name: string
  es_url: string
}

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json()
    const { query, isSemanticSearch, chat_id, db_name, es_url } = body
    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      )
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/_search?query=${query}&is_semantic_search=${isSemanticSearch}&database_name=${db_name}&es_url=${es_url}`,
      {
        headers: {
          "x-chat-id": chat_id
        }
      }
    )
    const data = await response.json()
    return NextResponse.json({
      results: data
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
