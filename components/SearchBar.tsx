"use client"

import type React from "react"

import { useState } from "react"

export default function SearchBar() {
  const [search, setSearch] = useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    // Implement search logic here
  }

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search tasks..."
        className="w-full p-2 border rounded"
        value={search}
        onChange={handleSearch}
      />
    </div>
  )
}

