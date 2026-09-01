/**
 * Mock Razorpay Payment Service for Frontend Prototype
 */
export function openRazorpayCheckout({ order, customer, onSuccess, onError, onDismiss }) {
  return new Promise((resolve) => {
    // Simulate a loading delay for the payment gateway popup
    setTimeout(() => {
      // Direct success simulation for student prototype
      const mockPaymentId = `pay_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      onSuccess({
        razorpay_payment_id: mockPaymentId,
        razorpay_order_id: `order_${Math.random().toString(36).substr(2, 9)}`,
        razorpay_signature: `sig_${Math.random().toString(36).substr(2, 9)}`
      });
      resolve();
    }, 1500);
  });
}
