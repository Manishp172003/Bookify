import { sendEmail } from "./emailService.js";

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const getPhone = (user) => user?.phone || user?.mobile || "Not provided";

const row = (label, value) => `
  <tr>
    <td style="padding:6px 12px;border:1px solid #e5e7eb;background:#f9fafb;"><strong>${escapeHtml(label)}</strong></td>
    <td style="padding:6px 12px;border:1px solid #e5e7eb;">${escapeHtml(value)}</td>
  </tr>`;

const table = (rows) => `
  <table style="border-collapse:collapse;width:100%;max-width:520px;">
    ${rows.join("")}
  </table>`;

const layout = (title, body) => `
  <div style="font-family:Arial,sans-serif;color:#111827;">
    <h2>${escapeHtml(title)}</h2>
    ${body}
    <p style="margin-top:24px;">Regards,<br/>Bookify Team</p>
  </div>`;

const formatAddress = (address) => {
  if (!address) {
    return null;
  }

  const parts = [
    address.fullName,
    address.address,
    address.city,
    address.pincode,
    address.phone,
  ].filter(Boolean);

  return parts.length ? parts.join(", ") : null;
};

export const sendBuyerOrderEmail = async ({ order, buyer, seller, book }) => {
  if (!buyer?.email) {
    return null;
  }

  const rows = [
    row("Order ID", order._id),
    row("Book", book?.title || "Book"),
    row("Amount", `₹${order.amount}`),
    row("Payment Method", order.paymentMethod),
    row("Payment Status", order.paymentStatus),
    row("Order Status", order.status),
    row("Seller Name", seller?.fullName || "Seller"),
    row("Seller Email", seller?.email || "Not provided"),
    row("Seller Mobile", getPhone(seller)),
  ];

  return sendEmail({
    to: buyer.email,
    subject: `Bookify - Order Confirmed #${order._id}`,
    htmlContent: layout(
      "Your order is confirmed",
      `<p>Hello ${escapeHtml(buyer.fullName || "there")},</p>
       <p>Your order has been placed successfully.</p>
       ${table(rows)}`
    ),
  });
};

export const sendSellerOrderEmail = async ({ order, buyer, seller, book }) => {
  if (!seller?.email) {
    return null;
  }

  const rows = [
    row("Order ID", order._id),
    row("Book", book?.title || "Book"),
    row("Order Type", order.orderType),
    row("Amount", `₹${order.amount}`),
    row("Payment Method", order.paymentMethod),
    row("Payment Status", order.paymentStatus),
    row("Buyer Name", buyer?.fullName || "Buyer"),
    row("Buyer Mobile", getPhone(buyer)),
    row("Buyer Email", buyer?.email || "Not provided"),
  ];

  const address = formatAddress(order.shippingAddress);

  if (address) {
    rows.push(row("Shipping Address", address));
  }

  return sendEmail({
    to: seller.email,
    subject: `Bookify - New Order #${order._id}`,
    htmlContent: layout(
      "You have received a new order",
      `<p>Hello ${escapeHtml(seller.fullName || "there")},</p>
       <p>A buyer has placed an order for your book. Please process it.</p>
       ${table(rows)}`
    ),
  });
};

export const sendOrderEmails = async (details) => {
  const results = await Promise.allSettled([
    sendBuyerOrderEmail(details),
    sendSellerOrderEmail(details),
  ]);

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(
        `Order email failed (${index === 0 ? "buyer" : "seller"}):`,
        result.reason
      );
    }
  });

  return results;
};

export const sendOrderConfirmationEmail = async ({
  email,
  name,
  orderId,
  amount,
}) => {
  return sendEmail({
    to: email,
    subject: "Bookify - Order Confirmation",
    htmlContent: layout(
      "Bookify Order Confirmation",
      `<p>Hello ${escapeHtml(name)},</p>
       <p>Your order has been placed successfully.</p>
       ${table([row("Order ID", orderId), row("Amount", `₹${amount}`)])}
       <p>Thank you for using Bookify.</p>`
    ),
  });
};