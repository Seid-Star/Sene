const categories = [
  { label: "All produce", value: "all" },
  { label: "Grains", value: "grains" },
  { label: "Vegetables", value: "vegetables" },
  { label: "Fruits", value: "fruits" },
];

function FilterBar({ value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => {
        const active = value === category.value;

        return (
          <button
            key={category.value}
            type="button"
            onClick={() => onChange(category.value)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
              active
                ? "bg-green-600 text-white shadow-sm"
                : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
            }`}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}

export default FilterBar;