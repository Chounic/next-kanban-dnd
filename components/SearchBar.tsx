"use client";

import type React from "react";

import { useState } from "react";

export default function SearchBar() {
  const [search, setSearch] = useState("");

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    // Implement filter logic here
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Filter tasks..."
        className="w-full p-2 border rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring "
        value={search}
        onChange={handleFilter}
      />
    </div>
  );
}
