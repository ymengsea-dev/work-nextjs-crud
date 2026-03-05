"use client"

import { useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import AddProductModal from "./addProductModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("q") ?? "";
  const status = searchParams.get("status") ?? "";

  const updateQuery = (updates) => {
    const params = new URLSearchParams(searchParams.toString());

    if (Object.prototype.hasOwnProperty.call(updates, "q")) {
      const value = updates.q ?? "";
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
    }

    if (Object.prototype.hasOwnProperty.call(updates, "status")) {
      const value = updates.status ?? "";
      if (value) {
        params.set("status", value);
      } else {
        params.delete("status");
      }
    }

    const query = params.toString();
    router.push(query ? `/product?${query}` : "/product");
  };

  const handleSearchChange = (value) => {
    updateQuery({ q: value });
  };

  const handleStatusChange = (value) => {
    updateQuery({ status: value === "ALL" ? "" : value });
  };

  return (
    <div className="flex items-center justify-between mb-6 rounded-2xl border border-zinc-200 bg-linear-to-r from-sky-500 via-teal-500 to-emerald-500 px-6 py-4 shadow-md">
      <div>
        <h1 className="text-xl font-semibold text-white tracking-tight">
          Product Management
        </h1>
        <p className="text-xs text-sky-50/80 mt-1">
          Search by name or ID and filter by status.
        </p>
      </div>

      <div className="flex gap-3 items-center">
        <Input
          placeholder="Search product by name or ID..."
          className="w-64 h-9 rounded-xl border-none bg-white/90 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-sky-300"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />

        <Select value={status || "ALL"} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[140px] h-9 rounded-xl border-none bg-white/90 text-xs font-medium text-zinc-700 shadow-sm focus:ring-2 focus:ring-emerald-300">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <AddProductModal />
      </div>
    </div>
  );
}
