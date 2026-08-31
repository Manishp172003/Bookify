import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Lock, ShoppingBag, Sparkles } from "lucide-react";
import { useCommerce } from "../../context/CommerceContext";
import AddressCard from "../../components/checkout/AddressCard";
import OrderSummary from "../../components/checkout/OrderSummary";
import EscrowCard from "../../components/checkout/EscrowCard";
import PaymentButton from "../../components/checkout/PaymentButton";
import { openRazorpayCheckout } from "../../services/paymentService";

function Checkout() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartCount,
    subtotal,
    deliveryFee,
    platformFee,
    discount,
    total,
    appliedCoupon,
    addresses,
    selectedAddressId,
    selectedAddress,
    selectAddress,
    addAddress,
    shippingMethod,
    setShippingMethod,
    createOrder,
    showToast
  } = useCommerce();

  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      showToast("Your cart is empty. Add items to checkout.", "warning");
      return;
    }

    if (!selectedAddress) {
      showToast("Please choose or add a delivery address.", "warning");
      return;
    }

    setIsProcessing(true);

    try {
      const mockOrderPayload = {
        id: `BK${Math.floor(10000000 + Math.random() * 90000000)}`,
        items: cartItems,
        total: total,
        address: selectedAddress
      };

      await openRazorpayCheckout({
        order: mockOrderPayload,
        customer: {
          name: selectedAddress.name,
          phone: selectedAddress.phone
        },
        onSuccess: (paymentResult) => {
          setIsProcessing(false);
          const newOrder = createOrder({
            paymentMethod: "Razorpay (UPI / NetBanking)",
            transactionId: paymentResult.razorpay_payment_id || `pay_${Date.now()}`
          });
          showToast("Payment Successful! Your order is placed. 🎉");
          navigate("/order-confirmation", { state: { orderId: newOrder.id } });
        },
        onError: (err) => {
          setIsProcessing(false);
          showToast("Payment failed or was cancelled. Please try again.", "error");
        },
        onDismiss: () => {
          setIsProcessing(false);
        }
      });
    } catch (error) {
      console.error("Checkout error:", error);
      setIsProcessing(false);
      showToast("An unexpected error occurred during checkout.", "error");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F0ECFF] text-[#6C4BF4]">
          <ShoppingBag size={36} />
        </div>
        <h2 className="text-2xl font-extrabold text-[#17152A]">No Items to Checkout</h2>
        <p className="mt-2 text-sm text-gray-500">
          Your cart is currently empty. Add books from our student marketplace to proceed with checkout.
        </p>
        <div className="mt-6">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#6C4BF4] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#6C4BF4]/25 hover:bg-[#5B3DE0]"
          >
            <Sparkles size={16} /> Explore Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-8">
      {/* Back link & Title */}
      <div className="mb-6">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#6C4BF4] transition mb-3"
        >
          <ArrowLeft size={14} /> Back to Cart
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#17152A] sm:text-3xl">
              Secure Checkout & Escrow
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Confirm your delivery location and finalize your escrow protected payment.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>Escrow Protected Transaction</span>
          </div>
        </div>
      </div>

      {/* Grid Layout: Left sections (Addresses, Shipping, Escrow) vs Right (Summary & Payment) */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column (7 cols on lg, 8 on xl) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Section 1: Delivery Address */}
          <AddressCard
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelectAddress={selectAddress}
            onAddAddress={addAddress}
          />

          {/* Section 2: Escrow Trust Banner */}
          <EscrowCard />
        </div>

        {/* Right Column (5 cols on lg, 4 on xl) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 sticky top-24">
          {/* Order items recap */}
          <OrderSummary
            items={cartItems}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            platformFee={platformFee}
            discount={discount}
            total={total}
            appliedCoupon={appliedCoupon}
            shippingMethod={shippingMethod}
          />

          {/* Shipping Method Selector & Pay Button */}
          <PaymentButton
            total={total}
            shippingMethod={shippingMethod}
            onSelectShippingMethod={setShippingMethod}
            onPay={handlePayment}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  );
}

export default Checkout;
