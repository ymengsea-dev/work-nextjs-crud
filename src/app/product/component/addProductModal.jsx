"use client";

import { useState } from "react";
import { createProduct } from "@/service/productService";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddProductModal() {
  const router = useRouter();
  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    price: "",
    currency: "USD",
  });

  const handleChange = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { code, name, description, price, currency } = form;
    const res = await createProduct({
      code,
      name,
      description,
      price,
      currency,
    });

    if (res?.status.code == "SUCCESS") {
      setForm({
        code: "",
        name: "",
        description: "",
        price: "",
        currency: "USD",
      });
      alert(res.status.message);
      router.refresh();
    } else {
      alert(res?.status?.message || "Failed to create product.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-zinc-900 hover:bg-zinc-700 text-white rounded-xl px-5 h-9 text-sm font-medium transition-colors">
          Add Product
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-125 rounded-2xl border border-zinc-200 p-0 overflow-hidden">
        {/* Header accent bar */}
        <div className="h-1 w-full bg-linear-to-r from-teal-400 to-emerald-500" />

        <DialogHeader className="px-6 pt-5 pb-2">
          <DialogTitle className="text-base font-semibold tracking-tight text-zinc-900">
            Add Product
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-3 px-6 pb-6 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Code
              </Label>
              <Input
                value={form.code}
                onChange={(e) => handleChange("code", e.target.value)}
                className="h-9 rounded-xl border-zinc-200 text-sm focus-visible:ring-teal-400"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Name
              </Label>
              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="h-9 rounded-xl border-zinc-200 text-sm focus-visible:ring-teal-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Description
            </Label>
            <Textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="rounded-xl border-zinc-200 text-sm resize-none focus-visible:ring-teal-400 min-h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Price
              </Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className="h-9 rounded-xl border-zinc-200 text-sm focus-visible:ring-teal-400"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Currency
              </Label>
              <Select
                onValueChange={(value) => handleChange("currency", value)}
                defaultValue="USD"
              >
                <SelectTrigger className="h-9 rounded-xl border-zinc-200 text-sm focus:ring-teal-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="KHR">KHR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-1">
            <Button
              onClick={handleSubmit}
              className="w-full h-9 bg-zinc-900 hover:bg-zinc-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Save Product
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
