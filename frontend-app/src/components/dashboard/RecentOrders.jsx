import React from "react";
import { Link } from "react-router-dom";
import { useCommerce } from "../../context/CommerceContext";

function BookCover({ title, bgClass = "from-[#2E189A] to-[#6C4BF4]" }) {
  const words = title ? title.split(" ") : ["BK"];
  const initials = words.length >= 2 
    ? `${words[0].substring(0, 1)}${words[1].substring(0, 1)}` 
    : (title ? title.substring(0, 2) : "BK");
  
  return (
    <div className={`h-11 w-8 shrink-0 rounded bg-gradient-to-br ${bgClass} flex flex-col justify-between p-1 text-[7px] font-extrabold text-white shadow-sm border border-black/5 leading-none text-center select-none uppercase tracking-tighter`}>
      <span className="text-[3px] opacity-75 block text-left">BOOK</span>
      <span className="my-auto block leading-[8px] break-all">{initials}</span>
      <span className="text-[3px] opacity-50 block text-right">ED.</span>
    </div>
  );
}

function RecentOrders() {
  const { orders } = useCommerce();

  // Show up to 3 recent orders
  const displayOrders = orders && orders.length > 0 ? orders.slice(0, 3) : [
    { 
      id: "ord_1",
      title: "Java The Complete Reference", 
      user: "Rahul Sharma", 
      price: "₹450",
      bgClass: "from-[#2E189A] to-[#6C4BF4]"
    },
    { 
      id: "ord_2",
      title: "DBMS Concepts", 
      user: "Priya Verma", 
      price: "₹300",
      bgClass: "from-[#C2410C] to-[#F97316]"
    },
    { 
      id: "ord_3",
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
        <Link 
          to="/dashboard/orders" 
          className="text-xs font-semibold text-[#6C4BF4] cursor-pointer hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {displayOrders.map((order, idx) => {
          const title = order.title || order.bookTitle || order.items?.[0]?.title || `Order #${order.id || idx + 1}`;
          const sellerName = order.sellerName || order.user || order.seller?.name || "Campus Seller";
          const price = order.total ? `₹${order.total}` : (order.price || "₹450");
          const bgClass = order.bgClass || (idx % 3 === 0 ? "from-[#2E189A] to-[#6C4BF4]" : idx % 3 === 1 ? "from-[#C2410C] to-[#F97316]" : "from-[#0F766E] to-[#14B8A6]");

          return (
            <div
              key={order.id || idx}
              className="flex items-center gap-3"
            >
              <BookCover title={title} bgClass={bgClass} />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#17152A]">
                  {title}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {sellerName}
                </p>
              </div>

              <span className="text-sm font-semibold text-[#17152A] shrink-0">
                {price}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecentOrders;