import React from "react";
import { Link } from "react-router-dom";
import { useCommerce } from "../../context/CommerceContext";

import { ShoppingBag } from "lucide-react";

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

  // Show up to 3 recent buyer orders
  const buyerOrders = (orders || []).filter((o) => !o.isSellerOrder);
  const displayOrders = buyerOrders.slice(0, 3);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-[#17152A]">Recent Orders</h3>
        {displayOrders.length > 0 && (
          <Link 
            to="/dashboard/orders" 
            className="text-xs font-semibold text-[#6C4BF4] cursor-pointer hover:underline"
          >
            View All
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {displayOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDE7FF] text-[#6C4BF4] mb-2.5">
              <ShoppingBag size={18} />
            </div>
            <p className="text-xs font-semibold text-[#17152A]">No orders placed yet</p>
            <p className="text-[11px] text-gray-400 mt-0.5 max-w-[200px]">
              Find textbooks for your course and save up to 70%.
            </p>
            <Link
              to="/explore"
              className="mt-3 inline-flex items-center rounded-lg bg-[#6C4BF4] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#5B3DE0] transition shadow-xs"
            >
              Browse Textbooks
            </Link>
          </div>
        ) : (
          displayOrders.map((order, idx) => {
          const title = order.title || order.bookTitle || order.items?.[0]?.title || `Order #${order.id || idx + 1}`;
          const sellerName = order.sellerName || order.user || order.seller?.name || "Campus Seller";
          const price = order.total ? `₹${order.total}` : (order.price || "₹450");
          const bgClass = order.bgClass || (idx % 3 === 0 ? "from-[#2E189A] to-[#6C4BF4]" : idx % 3 === 1 ? "from-[#C2410C] to-[#F97316]" : "from-[#0F766E] to-[#14B8A6]");

          const image = order.items?.[0]?.image || order.image;

          return (
            <Link
              key={order.id || idx}
              to={order.id ? `/orders/${order.id}/tracking` : "/dashboard/orders"}
              className="flex items-center gap-3 group hover:bg-[#F8F7FF] -mx-2 p-2 rounded-xl transition cursor-pointer"
            >
              {image ? (
                <div className="h-11 w-8 shrink-0 overflow-hidden rounded bg-gray-100 border border-black/5 shadow-2xs">
                  <img src={image} alt={title} className="h-full w-full object-cover" />
                </div>
              ) : (
                <BookCover title={title} bgClass={bgClass} />
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#17152A] group-hover:text-[#6C4BF4] transition">
                  {title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-gray-400">
                    {sellerName}
                  </p>
                  {(order.status === "placed" || order.status === "Placed") && (
                    <span className="rounded-full bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.2">
                      Needs Confirm
                    </span>
                  )}
                </div>
              </div>

              <span className="text-sm font-semibold text-[#17152A] shrink-0">
                {price}
              </span>
            </Link>
          );
        }))}
      </div>
    </div>
  );
}

export default RecentOrders;