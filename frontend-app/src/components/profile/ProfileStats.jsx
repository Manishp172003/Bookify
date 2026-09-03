function ProfileStats() {
  const stats = [
    {
      value: "12",
      label: "Books Purchased",
      color: "text-[#6C4BF4]",
    },
    {
      value: "8",
      label: "Books Sold",
      color: "text-[#6C4BF4]",
    },
    {
      value: "₹1,850",
      label: "Total Earned",
      color: "text-[#22C55E]",
    },
    {
      value: "4.8",
      label: "Rating",
      color: "text-[#FF8A3D]",
    },
  ];

  return (
    <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-gray-100 bg-white px-4 py-5 text-center shadow-sm"
        >
          <p className={`text-2xl font-bold ${stat.color}`}>
            {stat.value}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ProfileStats;