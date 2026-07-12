"use client";

import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AddAssetModal({ children, onSuccess }: { children: React.ReactNode, onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [tagNumber, setTagNumber] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  
  const queryClient = useQueryClient();

  // Fetch reference data (Assuming we have basic endpoints for these)
  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => (await axios.get("/api/departments")).data
  });

  const mutation = useMutation({
    mutationFn: async (newAsset: any) => {
      const { data } = await axios.post("/api/assets", newAsset);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assetsList"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "kpis"] });
      setOpen(false);
      setName("");
      setTagNumber("");
      setCategoryId("");
      setDepartmentId("");
      if (onSuccess) onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !tagNumber || !departmentId) return;
    
    mutation.mutate({
      name,
      assetTag: tagNumber,
      categoryId: categoryId || "11111111-1111-1111-1111-111111111111", 
      departmentId: departmentId,
      locationId: "22222222-2222-2222-2222-222222222222",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register New Asset</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Asset Name / Model</Label>
            <Input
              id="name"
              placeholder="e.g. MacBook Pro 16"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={mutation.isPending}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tag">Asset Tag Number</Label>
            <Input
              id="tag"
              placeholder="e.g. AST-1001"
              value={tagNumber}
              onChange={(e) => setTagNumber(e.target.value)}
              disabled={mutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label>Department Assignment</Label>
            <Select disabled={mutation.isPending} onValueChange={(val) => setDepartmentId(val || "")} value={departmentId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                {departments?.map((dept: any) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full px-3.5 py-2.5 text-sm font-semibold bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors"
          >
            {mutation.isPending ? "Registering..." : "Register Asset"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
