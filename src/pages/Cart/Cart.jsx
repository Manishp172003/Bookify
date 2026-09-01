import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Trash2, Sparkles, ShieldCheck } from "lucide-react";
import { useCommerce } from "../../context/CommerceContext";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";

function Cart() {
  const {
    cartItems,
    cartCount,
    removeFromCart,
    updateQuantity,
    moveToWishlist,
    clearCart,
    subtotal,
    deliveryFee,
    platformFee,
    discount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    availableCoupons
  } = useCommerce();

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#17152A] sm:text-3xl">
              My Shopping Cart
            </h1>
            <span className="rounded-full bg-[#E9E4FF] px-3 py-1 text-xs font-bold text-[#6C4BF4]">
              {cartCount} {cartCount === 1 ? "Book" : "Books"}
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Review your selected academic books before proceeding to escrow checkout.
          </p>
        </div>

        {/* Clear cart action */}
        {cartItems.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-red-500 transition cursor-pointer"
          >
            <Trash2 size={14} /> Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        /* Empty Cart State */
        <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm my-6">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F0ECFF] text-[#6C4BF4]">
            <ShoppingBag size={38} />
          </div>
          <h2 className="text-xl font-extrabold text-[#17152A]">Your Cart is Empty</h2>
          <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-gray-500 leading-relaxed">
            Looks like you haven't added any books yet. Explore thousands of pre-loved academic textbooks and study guides from verified students!
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#6C4BF4] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#6C4BF4]/25 transition hover:bg-[#5B3DE0] hover:shadow-xl active:scale-95"
            >
              <Sparkles size={16} /> Explore Available Books
            </Link>
            <Link
              to="/dashboard/wishlist"
              className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-[#F8F7FF] px-6 py-3.5 text-sm font-bold text-[#17152A] transition hover:border-[#6C4BF4] hover:bg-[#F0ECFF] hover:text-[#6C4BF4]"
            >
              View Saved Wishlist
            </Link>
          </div>
        </div>
      ) : (
        /* Main Cart Grid */
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Cart Items List (7 cols on lg, 8 on xl) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
                onMoveToWishlist={moveToWishlist}
              />
            ))}

            {/* Reassurance banner */}
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-xs text-emerald-800">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                <span>All orders are backed by Bookify 100% Buyer Protection and 48-Hour Inspection Escrow.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (5 cols on lg, 4 on xl) */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
            <CartSummary
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              platformFee={platformFee}
              discount={discount}
              total={total}
              appliedCoupon={appliedCoupon}
              onApplyCoupon={applyCoupon}
              onRemoveCoupon={removeCoupon}
              availableCoupons={availableCoupons}
              cartCount={cartCount}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
