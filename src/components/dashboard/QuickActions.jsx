function QuickActions() {
  const actions = [
    {
      title: "Sell a Book",
      subtitle: "List your book",
      className: "border-red-100 bg-red-50 text-red-500",
    },
    {
      title: "Rent a Book",
      subtitle: "Save money",
      className: "border-orange-100 bg-orange-50 text-orange-500",
    },
    {
      title: "Exchange",
      subtitle: "Swap books",
      className: "border-green-100 bg-green-50 text-green-600",
    },
    {
      title: "Donate",
      subtitle: "Help others",
      className: "border-purple-100 bg-purple-50 text-[#6C4BF4]",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <h3 className="mb-4 font-semibold text-[#17152A]">
        Quick Actions
      </h3>

      <div className="grid grid-cols-3 gap-3">
        {actions.map((action) => (
          <button
            key={action.title}
            type="button"
            className={`rounded-lg border p-3 text-left transition hover:-translate-y-0.5 cursor-pointer ${action.className}`}
          >
            <p className="text-sm font-bold truncate">
              {action.title}
            </p>

            <p className="mt-1 text-[10px] opacity-70 truncate">
              {action.subtitle}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;