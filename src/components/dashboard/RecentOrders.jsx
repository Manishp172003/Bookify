function BookCover({ title, bgClass }) {
  const words = title.split(" ");
  const initials = words.length >= 2 
    ? `${words[0].substring(0, 1)}${words[1].substring(0, 1)}` 
    : title.substring(0, 2);
  
  return (
    <div className={`h-11 w-8 shrink-0 rounded bg-gradient-to-br ${bgClass} flex flex-col justify-between p-1 text-[7px] font-extrabold text-white shadow-sm border border-black/5 leading-none text-center select-none uppercase tracking-tighter`}>
      <span className="text-[3px] opacity-75 block text-left">BOOK</span>
      <span className="my-auto block leading-[8px] break-all">{initials}</span>
      <span className="text-[3px] opacity-50 block text-right">ED.</span>
    </div>
  );
}

function RecentOrders() {
  const orders = [
    { 
      title: "Java The Complete Reference", 
      user: "Rahul Sharma", 
      price: "₹450",
      bgClass: "from-[#2E189A] to-[#6C4BF4]"
    },
    { 
      title: "DBMS Concepts", 
      user: "Priya Verma", 
      price: "₹300",
      bgClass: "from-[#C2410C] to-[#F97316]"
    },
    { 
      title: "Operating Systems", 
      user: "Aman Tiwari", 
      price: "₹400",
      bgClass: "from-[#0F766E] to-[#14B8A6]"
    },
  ];

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-[#17152A]">Recent Orders</h3>
        <button className="text-xs font-semibold text-[#6C4BF4] cursor-pointer hover:underline bg-transparent border-none">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.title}
            className="flex items-center gap-3"
          >
            <BookCover title={order.title} bgClass={order.bgClass} />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#17152A]">
                {order.title}
              </p>
              <p className="mt-0.5 text-xs text-gray-400">
                {order.user}
              </p>
            </div>

            <span className="text-sm font-semibold text-[#17152A] shrink-0">
              {order.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentOrders;