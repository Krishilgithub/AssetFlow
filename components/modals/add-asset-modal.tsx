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

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddAssetModal({ isOpen, onClose, onSuccess }: AddAssetModalProps) {
  const [form, setForm] = useState({
    name: "",
    assetTag: "",
    serialNumber: "",
    categoryId: "",
    departmentId: "",
    locationId: "",
    purchaseCost: "",
    purchaseDate: "",
    notes: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, any>>({});

  const queryClient = useQueryClient();

  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await fetch("/api/departments");
      if (!res.ok) throw new Error("Failed to fetch departments");
      return res.json();
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });

  const { data: locations = [] } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await fetch("/api/locations");
      if (!res.ok) throw new Error("Failed to fetch locations");
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, any> = {
        name: form.name,
        assetTag: form.assetTag,
        categoryId: form.categoryId,
        departmentId: form.departmentId,
      };
      if (form.serialNumber) payload.serialNumber = form.serialNumber;
      if (form.locationId) payload.locationId = form.locationId;
      if (form.purchaseCost) payload.purchaseCost = parseFloat(form.purchaseCost);
      if (form.purchaseDate) payload.purchaseDate = form.purchaseDate;
      if (form.notes) payload.notes = form.notes;
      if (Object.keys(customFieldValues).length > 0) payload.customFields = customFieldValues;

      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          Array.isArray(errData.error)
            ? errData.error.map((e: any) => `${e.path?.join(".")}: ${e.message}`).join(", ")
            : errData.error || "Failed to create asset"
        );
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assetsList"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "kpis"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "charts"] });
      setForm({ name: "", assetTag: "", serialNumber: "", categoryId: "", departmentId: "", locationId: "", purchaseCost: "", purchaseDate: "", notes: "" });
      setCustomFieldValues({});
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
    if (!form.name.trim()) return setError("Asset name is required");
    if (!form.assetTag.trim()) return setError("Asset tag is required");
    if (!form.categoryId) return setError("Category is required");
    if (!form.departmentId) return setError("Department is required");
    mutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white border-neutral-200">
        <div className="p-6 pb-4 border-b border-neutral-100">
          <DialogTitle className="text-lg font-bold text-neutral-900 tracking-tight">
            Register New Asset
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-500 mt-1 font-medium">
            Add a new physical asset to the inventory registry.
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Required Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Asset Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. MacBook Pro 16"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                disabled={mutation.isPending}
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Asset Tag <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. AST-1001"
                value={form.assetTag}
                onChange={(e) => setForm((p) => ({ ...p, assetTag: e.target.value }))}
                disabled={mutation.isPending}
                className="text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Serial Number
            </Label>
            <Input
              placeholder="e.g. SN-2024-XXXX"
              value={form.serialNumber}
              onChange={(e) => setForm((p) => ({ ...p, serialNumber: e.target.value }))}
              disabled={mutation.isPending}
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.categoryId}
                onValueChange={(v) => setForm((p) => ({ ...p, categoryId: v ?? "" }))}
                disabled={mutation.isPending}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.length === 0 && (
                    <SelectItem value="__none__" disabled>
                      No categories found
                    </SelectItem>
                  )}
                  {categories.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Department <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.departmentId}
                onValueChange={(v) => setForm((p) => ({ ...p, departmentId: v ?? "" }))}
                disabled={mutation.isPending}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept: any) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {locations.length > 0 && (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Location
              </Label>
              <Select
                value={form.locationId}
                onValueChange={(v) => setForm((p) => ({ ...p, locationId: v ?? "" }))}
                disabled={mutation.isPending}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select location (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc: any) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name}{loc.city ? ` — ${loc.city}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Purchase Cost ($)
              </Label>
              <Input
                type="number"
                placeholder="0.00"
                value={form.purchaseCost}
                onChange={(e) => setForm((p) => ({ ...p, purchaseCost: e.target.value }))}
                disabled={mutation.isPending}
                className="text-sm"
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Purchase Date
              </Label>
              <Input
                type="date"
                value={form.purchaseDate}
                onChange={(e) => setForm((p) => ({ ...p, purchaseDate: e.target.value }))}
                disabled={mutation.isPending}
                className="text-sm"
              />
            </div>
          </div>

          {/* Dynamic Category-Specific Fields */}
          {(() => {
            const selectedCategory = categories.find((c: any) => c.id === form.categoryId);
            const schemaFields: Array<{ name: string; label: string; type: string; required: boolean }> = selectedCategory?.schema_definition || [];
            if (schemaFields.length === 0) return null;
            return (
              <div className="space-y-2 border-t border-neutral-100 pt-4">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{selectedCategory?.name} — Category Fields</p>
                <div className="grid grid-cols-2 gap-3">
                  {schemaFields.map((f) => {
                    const value = customFieldValues[f.name] ?? '';
                    const onChange = (val: any) => setCustomFieldValues(p => ({ ...p, [f.name]: val }));
                    return (
                      <div key={f.name} className="space-y-1.5">
                        <Label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                          {f.label} {f.required && <span className="text-red-500">*</span>}
                        </Label>
                        {f.type === 'textarea' ? (
                          <textarea
                            rows={2}
                            value={value}
                            onChange={e => onChange(e.target.value)}
                            placeholder={`Enter ${f.label.toLowerCase()}`}
                            required={f.required}
                            disabled={mutation.isPending}
                            className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all resize-none"
                          />
                        ) : f.type === 'boolean' ? (
                          <div className="flex items-center gap-2 mt-2">
                            <input
                              type="checkbox"
                              checked={!!value}
                              onChange={e => onChange(e.target.checked)}
                              disabled={mutation.isPending}
                              className="w-4 h-4"
                            />
                            <span className="text-xs text-neutral-600">Yes</span>
                          </div>
                        ) : (
                          <Input
                            type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                            value={value}
                            onChange={e => onChange(e.target.value)}
                            placeholder={`Enter ${f.label.toLowerCase()}`}
                            required={f.required}
                            disabled={mutation.isPending}
                            className="text-sm"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

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
            {mutation.isPending ? "Registering..." : "Register Asset"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
