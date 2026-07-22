import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, total, limit, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between mt-6 sm:mt-8 glass rounded-2xl p-3 sm:p-4 animate-fade-in-up">
      <p className="text-text-secondary text-xs sm:text-sm">
        <span className="font-medium text-text">{start}-{end}</span> of <span className="font-medium text-text">{total}</span>
      </p>
      <div className="flex items-center gap-1 sm:gap-2">
        <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}
          className="p-2 rounded-xl glass glow-gold disabled:opacity-30 disabled:cursor-not-allowed text-text">
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm text-text-secondary px-1 sm:hidden">
          {page} / {totalPages}
        </span>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button key={p} onClick={() => onPageChange(p)}
            className={`hidden sm:block w-9 h-9 rounded-xl text-sm font-medium ${
              p === page
                ? "bg-primary text-white shadow-[0_4px_16px_-2px_rgba(254,193,21,0.4)] scale-105"
                : "glass text-text glow-gold"
            }`}>
            {p}
          </button>
        ))}
        <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}
          className="p-2 rounded-xl glass glow-gold disabled:opacity-30 disabled:cursor-not-allowed text-text">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
