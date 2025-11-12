export default function Input({
  label,
  name,
  type,
  form,
  onChange,
  placeholder,
  error,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-gray-300 text-[0.95rem]">{label}</label>

      <input
        name={name}
        type={type}
        value={form[name]}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-[200px] h-7
                bg-black/30 
                border rounded-xl px-5 py-4 
                text-gray-200 placeholder-gray-500 
                focus:outline-none focus:ring-2 text-[12px]
                ${
                  error
                    ? "border-red-500 focus:ring-red-500"
                    : "border-white/10 focus:ring-purple-600"
                }
            `}
      />

      {error && <span className="text-red-400 text-sm mt-1">{error}</span>}
    </div>
  );
}
