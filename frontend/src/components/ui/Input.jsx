const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  required = false,
  className = "",
  disabled = false,
}) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`w-full px-4 py-3 border rounded-xl text-base focus:outline-none transition-all
        ${
          disabled
            ? "bg-gray-200 border-gray-300 cursor-not-allowed text-gray-500"
            : "bg-gray-50/50 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        }  ${className}`}
    />
  );
};

export default Input;
