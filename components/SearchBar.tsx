"use client";

import { TaskWithSubTasks } from "@/app/(dashboard)/page";
import type React from "react";
import { useState } from "react";


type SearchBarProps = {
  search: string;
  setSearch: (value: string) => void;
};

export default function SearchBar({ search, setSearch }: SearchBarProps) {

  return (
      <input
        type="text"
        placeholder="Filtrer les tâches..."
        className="w-1/2 sm:w-1/5 p-2 mb-12 border rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring "
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
  );
}
