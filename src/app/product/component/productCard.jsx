'use client'

import React from "react"
import { useState } from "react"
import { deleteProduct, updateProduct } from "@/service/productService"
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

  const ProductCard = ({ product, onUpdated }) => {
  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({})

  const {
    id,
    code,
    name,
    description,
    price,
    currency,
    status,
    createAt,
    updateAt
  } = product

  const formattedDate = (date) =>
    new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    })

  async function handleDelete() {
    const idNumber = id.split("_")[1]
    const res = await deleteProduct(idNumber)

    if (res.status.code === "SUCCESS") {
      alert(res.status.message)
      router.refresh();
    } else {
      // show error
    }
  }

  const handleEdit = () => {
    setEditForm({ code, name, description, price, currency, status })
    setEditOpen(true)
  }

  const handleEditChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
  }

  const handleEditSubmit = async () => {
    const idNumber = id.split("_")[1]
    const res = await updateProduct(idNumber, editForm)

    if (res.status.code === "SUCCESS") {
      alert(res.status.message)
      router.refresh();
      setEditOpen(false)
      onUpdated?.()
    } else {
      // show error
    }
  }

  return (
    <>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>

        <DialogContent className="sm:max-w-125 rounded-2xl border border-zinc-200 p-0 overflow-hidden">

          <div className="h-1 w-full bg-linear-to-r from-teal-400 to-emerald-500" />

          <DialogHeader className="px-6 pt-5 pb-2">
            <DialogTitle className="text-base font-semibold tracking-tight text-zinc-900">
              Edit Product
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-3 px-6 pb-6 pt-2">

            <div className="grid grid-cols-2 gap-3">

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-700 uppercase tracking-wider">Code</Label>
                <Input
                  value={editForm.code ?? ""}
                  onChange={(e) => handleEditChange("code", e.target.value)}
                  className="h-9 rounded-xl border-zinc-200 text-sm focus-visible:ring-teal-400"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-700 uppercase tracking-wider">Name</Label>
                <Input
                  value={editForm.name ?? ""}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                  className="h-9 rounded-xl border-zinc-200 text-sm focus-visible:ring-teal-400"
                />
              </div>

            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 uppercase tracking-wider">Description</Label>
              <Textarea
                value={editForm.description ?? ""}
                onChange={(e) => handleEditChange("description", e.target.value)}
                className="rounded-xl border-zinc-200 text-sm resize-none focus-visible:ring-teal-400 min-h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-700 uppercase tracking-wider">Price</Label>
                <Input
                  type="number"
                  value={editForm.price ?? ""}
                  onChange={(e) => handleEditChange("price", e.target.value)}
                  className="h-9 rounded-xl border-zinc-200 text-sm focus-visible:ring-teal-400"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-700 uppercase tracking-wider">Currency</Label>
                <Select
                  value={editForm.currency}
                  onValueChange={(value) => handleEditChange("currency", value)}
                >
                  <SelectTrigger className="h-9 rounded-xl border-zinc-200 text-sm focus:ring-teal-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="KHR">KHR</SelectItem>
                    <SelectItem value="THB">THB</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 uppercase tracking-wider">Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value) => handleEditChange("status", value)}
              >
                <SelectTrigger className="h-9 rounded-xl border-zinc-200 text-sm focus:ring-teal-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="ACTIVE">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      ACTIVE
                    </span>
                  </SelectItem>
                  <SelectItem value="INACTIVE">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
                      INACTIVE
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-1">
              <Button
                onClick={handleEditSubmit}
                className="w-full h-9 bg-zinc-900 hover:bg-zinc-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Update Product
              </Button>
            </div>

          </div>

        </DialogContent>

      </Dialog>

      <Card className="relative overflow-hidden border border-zinc-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">

        <div className={`absolute top-0 left-0 right-0 h-1 ${status === "ACTIVE" ? "bg-linear-to-r from-emerald-400 to-teal-500" : "bg-linear-to-r from-rose-400 to-red-500"}`} />

        <CardHeader className="flex flex-row justify-between items-start pt-6 pb-2">
          <CardTitle className="text-base font-semibold tracking-tight text-zinc-900">
            {name}
          </CardTitle>
          <Badge
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full border-0 ${
              status === "ACTIVE"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-600"
            }`}
          >
            {status}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4 pb-4">
          <p className="text-xs font-mono text-zinc-400 tracking-wider uppercase">{code}</p>
          <p className="text-3xl font-bold tracking-tight text-zinc-900">
            <span className="text-sm font-normal text-zinc-400 mr-1">{currency}</span>
            {price.toFixed(2)}
          </p>
          <div className="text-xs text-zinc-400 space-y-1.5 pt-3 border-t border-zinc-100">
            <p className="flex justify-between"><span className="text-zinc-300">ID</span><span className="font-mono">{id}</span></p>
            <p className="flex justify-between"><span className="text-zinc-300">Created</span><span>{formattedDate(createAt)}</span></p>
            <p className="flex justify-between"><span className="text-zinc-300">Updated</span><span>{formattedDate(updateAt)}</span></p>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2 pt-0 pb-5">
          <Button
            variant="outline"
            className="flex-1 h-9 text-sm font-medium border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 rounded-xl transition-colors"
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button
            className="flex-1 h-9 text-sm font-medium bg-rose-500 hover:bg-rose-600 text-white border-0 rounded-xl transition-colors"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </CardFooter>

      </Card>
    </>
  )
}

export default ProductCard