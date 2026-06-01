"use client";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, lastPage, total, onPageChange }: PaginationProps) {
  if (lastPage <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-4 border-t border-white/5">
      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
        {total} registros · Página {currentPage} de {lastPage}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-4 py-2 text-xs font-black text-gray-400 bg-white/5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          ← Anterior
        </button>
        {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
          const page = Math.max(1, Math.min(currentPage - 2, lastPage - 4)) + i;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 text-xs font-black rounded-lg transition-all ${
                page === currentPage
                  ? "bg-pop-gold text-pop-black"
                  : "text-gray-400 bg-white/5 hover:bg-white/10"
              }`}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= lastPage}
          className="px-4 py-2 text-xs font-black text-gray-400 bg-white/5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
