'use client';

interface CakeWritingProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CakeWriting({ value, onChange }: CakeWritingProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="cakeWriting" className="block text-sm font-medium text-gray-700 uppercase">
        Add Writing on the cake
      </label>
      <input
        type="text"
        id="cakeWriting"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., Happy Birthday!"
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        maxLength={50}
      />
      <p className="text-xs text-gray-500">
        Maximum 50 characters
      </p>
    </div>
  );
}
