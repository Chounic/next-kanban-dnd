"use client";

import type React from "react";
import { Input } from "./ui/input";


type SearchBarProps = {
  search: string;
  setSearch: (value: string) => void;
};

export default function SearchBar({ search, setSearch }: SearchBarProps) {

  return (
      <Input
        type="search"
        placeholder="Filtrer les tâches..."
        className="w-1/2 h-[unset] shadow-none sm:w-1/5 p-2 md:text-base mb-12 border rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring "
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
  );
}
