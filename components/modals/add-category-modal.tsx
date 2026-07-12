import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useQueryClient, useMutation } from "@tanstack/react-query";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddCategoryModal({ isOpen, onClose, onSuccess }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();

  const createCategoryMut = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onSuccess?.();
      onClose();
      setName("");
      setDescription("");
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white border-neutral-200">
        <div className="p-6 pb-4 border-b border-neutral-100">
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mb-4 border border-neutral-200 text-neutral-700 text-sm font-bold">
            🗂
          </div>
          <DialogTitle className="text-lg font-bold text-neutral-900 tracking-tight">Create Asset Category</DialogTitle>
          <DialogDescription className="text-sm text-neutral-500 mt-1.5 font-medium">
            Define a new classification ledger for grouping assets.
          </DialogDescription>
        </div>
        <div className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Category Name</label>
            <input
              type="text"
              placeholder="e.g. IT Hardware, Mobile Devices"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all bg-neutral-50/50 text-neutral-900 font-medium placeholder:text-neutral-400 placeholder:font-normal"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
              Description <span className="text-[10px] text-neutral-400 font-normal lowercase normal-case tracking-normal ml-1">(Optional)</span>
            </label>
            <textarea
              placeholder="Brief description of items in this category..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all bg-neutral-50/50 text-neutral-900 font-medium placeholder:text-neutral-400 placeholder:font-normal resize-none"
            />
          </div>
        </div>
        <DialogFooter className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => createCategoryMut.mutate()}
            disabled={!name.trim() || createCategoryMut.isPending}
            className="px-5 py-2 text-xs font-bold bg-black hover:bg-neutral-800 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-2"
          >
            {createCategoryMut.isPending ? "Creating..." : "Create Category"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
