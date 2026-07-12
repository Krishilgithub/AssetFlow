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
import { useCurrentUser } from "@/lib/hooks/useDashboard";

interface AllocateAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetId: string;
  assetName: string;
  onSuccess?: () => void;
}

export function AllocateAssetModal({ isOpen, onClose, assetId, assetName, onSuccess }: AllocateAssetModalProps) {
  const [allocatedToId, setAllocatedToId] = useState("");
  const [expectedReturnDate, setExpectedReturnDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();

  // Fetch employees to assign to
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
      const payload: Record<string, any> = {
        assetId,
        allocatedToId,
        allocatedById: currentUser?.id || "00000000-0000-0000-0000-000000000001",
      };
      if (expectedReturnDate) payload.expectedReturnDate = expectedReturnDate;
      if (notes) payload.notes = notes;

      const res = await fetch("/api/allocations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to allocate asset");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assetsList"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "kpis"] });
      queryClient.invalidateQueries({ queryKey: ["allocations"] });
      setAllocatedToId("");
      setExpectedReturnDate("");
      setNotes("");
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
    if (!allocatedToId) return setError("Please select an employee to allocate the asset to.");
    mutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white border-neutral-200">
        <DialogHeader className="p-6 pb-4 border-b border-neutral-100">
          <DialogTitle className="text-lg font-bold text-neutral-900 tracking-tight">
            Allocate Asset
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-500 mt-1 font-medium">
            Assign &quot;{assetName}&quot; to a custodian custodian.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-650">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Assign To Employee <span className="text-red-500">*</span>
            </Label>
            <Select
              value={allocatedToId}
              onValueChange={(v) => setAllocatedToId(v ?? "")}
              disabled={mutation.isPending}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp: any) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name} ({emp.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Expected Return Date
            </Label>
            <Input
              type="date"
              value={expectedReturnDate}
              onChange={(e) => setExpectedReturnDate(e.target.value)}
              disabled={mutation.isPending}
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Notes
            </Label>
            <Input
              placeholder="e.g. For remote working setup"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={mutation.isPending}
              className="text-sm"
            />
          </div>

          <DialogFooter className="pt-4 border-t border-neutral-100 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
              className="px-4 py-2 text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 rounded-lg text-neutral-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 text-xs font-bold bg-neutral-950 hover:bg-neutral-900 text-white rounded-lg transition-colors"
            >
              {mutation.isPending ? "Assigning..." : "Assign Asset"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
