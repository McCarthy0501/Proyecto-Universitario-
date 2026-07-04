import { ChevronLeft, ChevronRight } from 'lucide-react';

function Pagination({ currentPage, totalPages, onPageChange }) {
 if (totalPages <= 1) return null;

 const pages = [];
 const delta = 2;

 for (let i = 1; i <= totalPages; i++) {
 if (
 i === 1 ||
 i === totalPages ||
 (i >= currentPage - delta && i <= currentPage + delta)
 ) {
 pages.push(i);
 } else if (pages[pages.length - 1] !== '...') {
 pages.push('...');
 }
 }

 return (
 <div className="flex items-center justify-center gap-1 mt-8">
 <button
 onClick={() => onPageChange(currentPage - 1)}
 disabled={currentPage === 1}
 className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
 >
 <ChevronLeft size={18} />
 </button>

 {pages.map((p, i) =>
 p === '...' ? (
 <span key={`dots-${i}`} className="px-2 text-gray-400">...</span>
 ) : (
 <button
 key={p}
 onClick={() => onPageChange(p)}
 className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
 p === currentPage
 ? 'bg-indigo-600 text-white'
 : 'hover:bg-gray-100 text-gray-700'
 }`}
 >
 {p}
 </button>
 )
 )}

 <button
 onClick={() => onPageChange(currentPage + 1)}
 disabled={currentPage === totalPages}
 className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
 >
 <ChevronRight size={18} />
 </button>
 </div>
 );
}

export default Pagination;
