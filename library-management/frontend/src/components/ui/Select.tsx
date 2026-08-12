import { cn } from '../../lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const Select = ({ value, onChange, options, placeholder, className, disabled }: SelectProps) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    className={cn(
      'w-full px-3 py-2 rounded-lg border border-cream-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      className,
    )}
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);
