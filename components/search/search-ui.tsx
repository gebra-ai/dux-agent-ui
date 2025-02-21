"use client"
import { useContext, useState, useEffect } from "react"
import * as Switch from "@radix-ui/react-switch"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { IconLoader2 } from "@tabler/icons-react"
import { ThemeSwitcher } from "../utility/theme-switcher"
import { ChatbotUIContext } from "@/context/context"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select"

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

interface PublicIndex {
  index: string;
  health: string;
  status: string;
  docs_count: string;
  size: string;
}

export function SearchUI() {
  const [searchTerm, setSearchTerm] = useState("")
  const [headerList, setHeaderList] = useState<any>([])
  const [keys, setKeys] = useState<any>([])
  const [isSemanticSearch, setIsSemanticSearch] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [allIndices, setIndices] = useState<PublicIndex[]>([])
  const [selectedIndices, setSelectedIndices] = useState<string[]>([])
  const [isIndicesDropdownOpen, setIsIndicesDropdownOpen] = useState(false)

  const { profile } = useContext(ChatbotUIContext)

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search)
        const chatId = searchParams?.get("chatId")
        let es_url: any = searchParams.get("es_url")
        let version: any = searchParams.get("version")
        es_url = es_url ? es_url : process.env.NEXT_PUBLIC_ES_URL
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_END_POINT}/v1/es/indices`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-chat-id": chatId || ""
          },
          body: JSON.stringify({
            user: profile?.user_id,
            es_url: es_url,
            version: version
          })
        });

        if (response.ok) {
          const data = await response.json();
          setIndices(data || []);
          if (data?.length > 0) {
            setSelectedIndices([data[0].index]);
          }
        }
      } catch (error) {
        console.error("Error fetching indices:", error);
      }
    };

    fetchIndices();
  }, [profile]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const dropdownElement = document.getElementById('indices-dropdown')
      if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
        setIsIndicesDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleIndexToggle = (indexName: string) => {
    setSelectedIndices(prev => {
      if (prev.includes(indexName)) {
        return prev.filter(index => index !== indexName);
      }
      return [...prev, indexName];
    });
  };

  const handleSelectAll = () => {
    if (selectedIndices.length === allIndices?.length) {
      // If all are selected, deselect all
      setSelectedIndices([]);
    } else {
      // Select all
      setSelectedIndices(allIndices?.map(item => item.index) || []);
    }
  };
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const handleSearch = async () => {
    setHasSearched(true)
    setIsLoading(true)
    try {
      const searchParams = new URLSearchParams(window.location.search)
      const chatId = searchParams?.get("chatId")
      if (!chatId) throw new Error("Chat ID not found")
      const db_name = searchParams.get("db_name")
      let es_url: any = searchParams.get("es_url")
      let version: any = searchParams.get("version")
      es_url = es_url ? es_url : process.env.NEXT_PUBLIC_ES_URL
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
          es_url,
          index_names: selectedIndices,
          version: version
        })
      })

      const data = await response.json()
      if (response.ok) {
        if (isSemanticSearch) {
          setResults(data.results.data)
        } else {
          setResults(data.results.data.hits)
          const keyList = Object.keys(data.results.data.hits[0]).map((key: string) => capitalizeFirstLetter(key))
          setHeaderList(keyList)
          setKeys(Object.keys(data.results.data.hits[0]))
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
        className={`transition-all duration-300 h-full flex flex-col ${hasSearched ? "mt-4" : "mt-[30px]"
          }`}
      >
        <div className="flex gap-4 mb-4">
          {/* <ThemeSwitcher /> */}
          <Input
            type="text"
            placeholder="Enter your search query..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className=" w-[417px]"
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? <Loader /> : null}
            Search
          </Button>
        </div>
        <div className="flex mb-4 flex-col">
          <div className="flex items-center gap-2 h-[30px] pb-[20px] pt-[10px]">
            <span className="pr=[20px]">Search Method: </span>
            <span className={`${!isSemanticSearch? "font-bold" : ""}`}>Elastic</span>
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
            <span className={`${isSemanticSearch? "font-bold" : ""}`}>Semantic</span>
          </div>
          {(!isSemanticSearch && allIndices?.length > 0) && (
            <div className="flex items-center">
              <label className="text-sm font-medium">Pic Elastic Search Indices: </label>
              <div className="relative">
                <button
                  onClick={() => setIsIndicesDropdownOpen(!isIndicesDropdownOpen)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  Selected Indices ({selectedIndices.length})
                </button>
                {isIndicesDropdownOpen && (
                  <div
                    id="indices-dropdown"
                    className="absolute top-full mt-1 z-50 bg-popover border rounded p-2 max-h-32 overflow-y-auto min-w-[200px]"
                  >
                    <div className="border-b pb-2 mb-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedIndices.length === allIndices?.length}
                          onChange={handleSelectAll}
                          className="rounded"
                        />
                        <span
                          onClick={handleSelectAll}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          {selectedIndices.length === allIndices?.length ? 'Deselect All' : 'Select All'}
                        </span>
                      </label>
                    </div>
                    {allIndices?.map((item: PublicIndex) => (
                      <label key={item.index} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedIndices.includes(item.index)}
                          onChange={() => handleIndexToggle(item.index)}
                          className="rounded"
                        />
                        <span className="text-sm">{item.index}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {isLoading ? (
          <div className="flex justify-center items-center mt-8">
            <Loader />
          </div>
        ) : (
          hasSearched && (
            <div className="mt-8">
              {results?.length > 0 ? (
                <div className="h-[calc(100vh-150px)] flex flex-col border rounded-lg overflow-hidden">
                  <div className="overflow-auto custom-scrollbar">
                    <table className="w-full border-collapse">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-gray-200">
                          {isSemanticSearch ? (
                            <>
                              <th className="p-3 text-center font-semibold w-[150px] border-r">Score</th>
                              <th className="p-3 text-center font-semibold">Content</th>
                            </>
                          ) : (
                            headerList.map((key: any, index: number) => <th key={index} className="p-3 text-center font-semibold">{key}</th>)

                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {(Array.isArray(results) && results.length > 0) && results.map((result: any, index) => (
                          <tr key={index}>
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
                              keys.map((key: any, index: number) =>
                                <td className="p-3 align-top text-left border-r overflow-y-auto">
                                  <pre className="whitespace-pre-wrap max-h-[400px]">
                                    {typeof result[key] == "object" ? JSON.stringify(result[key], null, 2) : result[key]}
                                  </pre>
                                </td>
                              )

                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-[calc(100vh-250px)]">
                  <p className="text-lg text-muted-foreground">No matching results found. Please try a different query</p>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  )
}
