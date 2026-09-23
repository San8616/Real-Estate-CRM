export default function Badge({ children, variant = 'neutral', className = '' }) {
  const variantStyles = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200/80',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/80',
    indigo: 'bg-purple-50 text-purple-700 border-purple-200/80',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    amber: 'bg-amber-50 text-amber-800 border-amber-200/80',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/80',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
    violet: 'bg-violet-50 text-violet-700 border-violet-200/80',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full border transition-colors ${
        variantStyles[variant] || variantStyles.neutral
      } ${className}`}
    >
      {children}
    </span>
  );
}
