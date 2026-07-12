"use client";

import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddDepartmentModal({ isOpen, onClose, onSuccess }: AddDepartmentModalProps) {
  const [name, setName] = useState("");
  const [managerId, setManagerId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch all employees to pick a manager
  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await fetch("/api/employees");
      if (!res.ok) throw new Error("Failed to fetch employees");
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, any> = { name: name.trim() };
      if (managerId) payload.managerId = managerId;

      const res = await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to create department");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "kpis"] });
      setName("");
      setManagerId("");
      setError(null);
      onSuccess?.();
      onClose();
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Department name is required");
    mutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white border-neutral-200">
        <div className="p-6 pb-4 border-b border-neutral-100">
          <DialogTitle className="text-lg font-bold text-neutral-900 tracking-tight">
            Add Department
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-500 mt-1 font-medium">
            Create a new organizational unit or cost center.
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Department Name <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="e.g. Engineering"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={mutation.isPending}
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Department Head <span className="text-neutral-400 font-normal lowercase tracking-normal normal-case text-[10px] ml-1">(Optional)</span>
            </Label>
            <Select
              value={managerId}
              onValueChange={(v) => setManagerId(v ?? "")}
              disabled={mutation.isPending}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select a manager" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp: any) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 font-medium">
              {error}
            </div>
          )}
        </form>

        <DialogFooter className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="px-5 py-2 text-xs font-bold bg-black hover:bg-neutral-800 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {mutation.isPending ? "Creating..." : "Create Department"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
