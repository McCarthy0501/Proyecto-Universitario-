const VARIANTS = {
 new: 'bg-green-500 text-white',
 discount: 'bg-red-500 text-white',
 'sold-out': 'bg-gray-700 text-white',
};

function Badge({ variant = 'discount', text, className = '' }) {
 return (
 <span
 className={`absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-xs font-semibold ${VARIANTS[variant]} ${className}`}
 >
 {text}
 </span>
 );
}

export default Badge;
