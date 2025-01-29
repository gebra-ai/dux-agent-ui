"use client"

import Link from "next/link"
import { FC } from "react"
// import GRAYLOGO from "../icons/Grayscale Transparent.png"
// import LIGHTLOGO from "../icons/Transparent Logo.png"
import Logo from "../icons/fill-gebra-icon"
import { useTheme } from "next-themes"

interface BrandProps {
  theme?: "dark" | "light",
  type?: string
}

export const Brand: FC<BrandProps> = ({  type }) => {
  const { theme } = useTheme()
  return (
    <Link
      className="flex cursor-pointer flex-col items-center hover:opacity-50"
      href="https://www.gebra.ai"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="mb-2">
          {/* <img src={theme === "dark" ?GRAYLOGO.src  :LIGHTLOGO.src} alt="Gebra AI" style={{ width: 140 }} /> */}
          <Logo theme={theme === "dark" ? "white" : "black" } />
      </div>

      {type == "chat" &&  <div className="text-[25px] font-bold tracking-wide">Hello, what would you like to do?</div>}
    </Link>
  )
}
