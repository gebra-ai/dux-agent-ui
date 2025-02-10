"use client"
import { useContext, useState } from "react"
import * as Switch from "@radix-ui/react-switch"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { IconLoader2 } from "@tabler/icons-react"
import { ThemeSwitcher } from "../utility/theme-switcher"
import { ChatbotUIContext } from "@/context/context"

export default function Loader() {
  return (
    <div className="flex size-full flex-col items-center justify-center">
      <IconLoader2 className="mt-4 size-12 animate-spin" />
    </div>
  )
}

interface SearchResult {
  content?: string
  similarity_score?: string
  raw?: any
}

export function SearchUI() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSemanticSearch, setIsSemanticSearch] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false) // Add this state

  const { profile } = useContext(ChatbotUIContext)

  const handleSearch = async () => {
    setHasSearched(true)
    setIsLoading(true)
    try {
      const searchParams = new URLSearchParams(window.location.search)
      const chatId = searchParams?.get("chatId")
      if (!chatId) throw new Error("Chat ID not found")
      const db_name = searchParams.get("db_name")
      const es_url = searchParams.get("es_url")
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: searchTerm,
          isSemanticSearch,
          chat_id: chatId,
          db_name,
          es_url
        })
      })

      const data = await response.json()
      if (response.ok) {
        if (isSemanticSearch) {
          setResults(data.results.data)
        } else {
          setResults(data.results.data.hits)
        }
      } else {
        console.error("Search failed:", data.error)
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 w-full p-4 overflow-hidden">
      <div
        className={`transition-all duration-300 h-full flex flex-col ${
          hasSearched ? "mt-4" : "mt-[30vh]"
        }`}
      >
        <div className="flex items-center gap-4 mb-4 flex-shrink-0">
          <ThemeSwitcher />
          <Input
            type="text"
            placeholder="Enter your search query..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <div className="flex items-center gap-2">
            <span>Elastic</span>
            <Switch.Root
              checked={isSemanticSearch}
              onCheckedChange={() => {
                setResults([])
                setIsSemanticSearch(!isSemanticSearch)
                
              }}
              className="w-10 h-5 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-500"
            >
              <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
            </Switch.Root>
            <span>Semantic</span>
          </div>
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? <Loader /> : null}
            Search
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center mt-8">
            <Loader />
          </div>
        ) : (
          hasSearched &&
          results?.length > 0 && (
            <div className="flex-1 mt-8">
              <div className="h-[calc(100vh-150px)] flex flex-col border rounded-lg overflow-hidden">
                <div className="overflow-auto">
                  <table className="w-full border-collapse">
                    <thead className="sticky top-0 z-10">
                      <tr>
                        {isSemanticSearch ? (
                          <>
                            <th className="p-3 text-center font-semibold w-[150px] border-r">Score</th>
                            <th className="p-3 text-center font-semibold">Content</th>
                          </>
                        ) : (
                          <th className="p-3 text-center font-semibold">Result</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {(Array.isArray(results) && results.length > 0 )&& results.map((result, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {isSemanticSearch ? (
                            <>
                              <td className="p-3 align-top text-center w-[150px] border-r">
                                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {Number(result.similarity_score)?.toFixed(4)}
                                </span>
                              </td>
                              <td className="p-3 align-top">
                                <div className="whitespace-pre-wrap">
                                  {result.content}
                                </div>
                              </td>
                            </>
                          ) : (
                            <td className="p-3">
                              <pre className="whitespace-pre-wrap">
                                {JSON.stringify(result, null, 2)}
                              </pre>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
