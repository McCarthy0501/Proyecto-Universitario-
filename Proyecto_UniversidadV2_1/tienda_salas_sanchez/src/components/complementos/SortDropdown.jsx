import { ArrowUpDown } from 'lucide-react';

const OPTIONS = [
 { value: '-created_date', label: 'Más nuevos' },
 { value: 'price_asc', label: 'Menor precio' },
 { value: 'price_desc', label: 'Mayor precio' },
 { value: 'name', label: 'A - Z' },
 { value: 'rating', label: 'Mejor valorados' },
];

function SortDropdown({ value, onChange }) {
 return (
 <div className="flex items-center gap-2">
 <ArrowUpDown size={16} className="text-gray-500" />
 <select
 value={value}
 onChange={(e) => onChange(e.target.value)}
 className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
 >
 {OPTIONS.map((opt) => (
 <option key={opt.value} value={opt.value}>
 {opt.label}
 </option>
 ))}
 </select>
 </div>
 );
}

export default SortDropdown;
