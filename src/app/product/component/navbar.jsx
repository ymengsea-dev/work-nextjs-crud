"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import AddProductModal from "./addProductModal"

export default function Navbar({ onSearch }) {
  return (
    <div className="flex items-center justify-between mb-6 bg-gray-400 p-4 rounded-xl shadow">
      
      <h1 className="text-xl font-bold">
        Product Management
      </h1>

      <div className="flex gap-4 items-center">
        
        <Input
          placeholder="Search product..."
          className="w-62.5"
          onChange={(e) => onSearch(e.target.value)}
        />

        <AddProductModal />

      </div>
    </div>
  )
}