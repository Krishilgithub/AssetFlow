import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useQueryClient, useMutation } from "@tanstack/react-query";

type FieldType = 'text' | 'number' | 'date' | 'boolean' | 'textarea';

interface CustomField {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
}

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Short Text' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'boolean', label: 'Yes/No' },
];

export function AddCategoryModal({ isOpen, onClose, onSuccess }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [showAddField, setShowAddField] = useState(false);
  const [newField, setNewField] = useState<CustomField>({ name: '', label: '', type: 'text', required: false });
  const queryClient = useQueryClient();

  const createCategoryMut = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, schema_definition: customFields })
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
      setCustomFields([]);
      setShowAddField(false);
    }
  });

  const handleAddField = () => {
    if (!newField.label.trim()) return;
    const fieldName = newField.label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    setCustomFields(prev => [...prev, { ...newField, name: fieldName }]);
    setNewField({ name: '', label: '', type: 'text', required: false });
    setShowAddField(false);
  };

  const removeField = (idx: number) => {
    setCustomFields(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden bg-white border-neutral-200 max-h-[90vh] overflow-y-auto">
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
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all bg-neutral-50/50 text-neutral-900 font-medium placeholder:text-neutral-400 placeholder:font-normal resize-none"
            />
          </div>

          {/* Custom Fields Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Category-Specific Fields</label>
              <button
                type="button"
                onClick={() => setShowAddField(true)}
                className="text-xs font-semibold text-black hover:underline"
              >
                + Add Field
              </button>
            </div>

            {customFields.length === 0 && !showAddField && (
              <p className="text-xs text-neutral-400 italic">No custom fields defined. Add fields like "Warranty Period", "Model Number", etc.</p>
            )}

            {customFields.map((f, i) => (
              <div key={i} className="flex items-center gap-2 p-2 border border-neutral-200 rounded-lg bg-neutral-50/50">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-neutral-900">{f.label}</p>
                  <p className="text-[10px] text-neutral-400 capitalize">{f.type}{f.required ? ' · Required' : ''}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeField(i)}
                  className="text-red-400 hover:text-red-600 text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            ))}

            {showAddField && (
              <div className="p-3 border border-dashed border-neutral-300 rounded-lg bg-neutral-50 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Field Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Warranty Period"
                      value={newField.label}
                      onChange={(e) => setNewField(p => ({ ...p, label: e.target.value }))}
                      className="w-full px-2 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Field Type</label>
                    <select
                      value={newField.type}
                      onChange={(e) => setNewField(p => ({ ...p, type: e.target.value as FieldType }))}
                      className="w-full px-2 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white"
                    >
                      {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="fieldRequired"
                    checked={newField.required}
                    onChange={(e) => setNewField(p => ({ ...p, required: e.target.checked }))}
                    className="w-3.5 h-3.5"
                  />
                  <label htmlFor="fieldRequired" className="text-xs text-neutral-600">Required field</label>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddField(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddField}
                    disabled={!newField.label.trim()}
                    className="px-3 py-1.5 text-xs font-bold bg-black text-white rounded-lg disabled:opacity-50"
                  >
                    Add Field
                  </button>
                </div>
              </div>
            )}
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

