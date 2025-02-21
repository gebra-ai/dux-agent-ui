"use client"
import React from "react"
import { IconLoader2 } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import Logo from "../icons/fill-gebra-icon"
import { useTheme } from "next-themes"
import { List, transformData } from "@/lib/release-constant";

export default function Loader() {
    return (
        <div className="flex size-full flex-col items-center justify-center">
            <IconLoader2 className="mt-4 size-12 animate-spin" />
        </div>
    )
}


export function ReleaseUI() {
    const { theme } = useTheme()
    const SIDEBAR_WIDTH = 300
    const [state, setState] = React.useState({
        active: List[0].id
    })
    const activeContent = List.filter((vl: any) => vl.id == state.active)[0];
    const data = transformData(List);
    return (
        <div className="flex size-full">
            <div
                className={cn(
                    "duration-200 dark:border-none border-r-2"
                )}
                style={{
                    // Sidebar
                    minWidth: `${SIDEBAR_WIDTH}px`,
                    maxWidth: `${SIDEBAR_WIDTH}px`,
                    width: `${SIDEBAR_WIDTH}px`
                }}
            >
                <div className="absolute -top-[8px] -left-[10px]">
                    <Logo width={180} height={110} theme={theme === "dark" ? "white" : "black"} />
                </div>
                <div className="mt-[110px]">
                    {
                        data.map((vl: any) => {
                            return <div>
                                <h6 key={vl.id} className={
                                    cn(
                                        "hover:bg-accent focus:bg-accent group mx-[11px] my-[10px] bg-lightgray p-[10px] cursor-pointer items-center rounded  focus:outline-none mb-[8px]",
                                        (state.active == vl.id || (vl.ids && vl.ids.indexOf(state.active) > -1)) && "bg-accent font-bold"
                                    )}
                                    onClick={() => {
                                        if(!vl.versions){
                                            setState({ ...state, active: vl.id })
                                        }
                                    }}
                                >
                                    {vl.title}
                                    {/* {vl.versions && <span className="float-right">({vl.versions.length})</span>} */}
                                </h6>
                                {
                                    vl.versions && vl.versions.map((v:any) => {
                                        return <h6 key={v.id} className={
                                            cn(
                                                "hover:bg-accent focus:bg-accent group mx-[11px] my-[10px] bg-lightgray p-[10px] cursor-pointer items-center rounded  focus:outline-none mb-[8px] ml-[35px]",
                                                state.active == v.id && "bg-accent font-bold"
                                            )}
                                            onClick={() => setState({ ...state, active: v.id })}
                                        >
                                            {v.title}
                                        </h6>
                                    })
                                }
                            </div>
                        })
                    }
                </div>
            </div>
            <div className="bg-muted/50 relative flex w-screen min-w-[90%] grow flex-col sm:min-w-fit p-[50px]">
                <div className="pb-[40px]">
                    <div className="border-b border-black pb-[15px]">
                        <h6 className="font-bold text-[25px]">{activeContent.title}</h6>
                        {activeContent.description && <p className="">{activeContent.description}</p>}
                    </div>
                </div>
                {
                    activeContent?.content?.map((vl: any, i: number) => {
                        return (
                            <div key={i} className="pb-[15px]">
                                {vl.title && <h6 className="font-bold">{vl.title}</h6>}
                                {vl.description && <p>{vl.description}</p>}
                                {vl.list && vl.list.length > 0 && (
                                    <ul className="list-disc pl-5 pt-[10px]">
                                        {vl.list.map((item: any, index: number) => (
                                            <li key={index} className="pb-[5px]">{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
