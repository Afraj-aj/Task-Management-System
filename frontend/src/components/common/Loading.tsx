import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="glass rounded-2xl p-6">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
      <p className="text-text-secondary text-sm mt-4">Loading tasks...</p>
    </div>
  );
}
