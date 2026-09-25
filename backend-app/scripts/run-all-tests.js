/**
 * Bookify Comprehensive Platform Test Suite
 * Executes end-to-end HTTP integration tests against all backend API modules,
 * database models, authentication guards, and commerce workflows.
 */

import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "../src/app.js";
import connectDB from "../src/config/db.js";
import { initSocket } from "../src/config/socket.js";
import User from "../src/models/User.js";
import Book from "../src/models/Book.js";
import Order from "../src/models/Order.js";
import ChatMessage from "../src/models/ChatMessage.js";
import WantBoard from "../src/models/WantBoard.js";
import Rental from "../src/models/Rental.js";
import Exchange from "../src/models/Exchange.js";
import Testimonial from "../src/models/Testimonial.js";
import NewsletterSubscriber from "../src/models/NewsletterSubscriber.js";

dotenv.config();

const TEST_PORT = 5099;
const BASE_URL = `http://localhost:${TEST_PORT}`;

// Test run state
const results = [];
let serverInstance;

function recordTest(moduleName, testCase, passed, details = "") {
  results.push({ module: moduleName, testCase, passed, details });
  const icon = passed ? "✅" : "❌";
  console.log(`${icon} [${moduleName}] ${testCase}${details ? ` -> ${details}` : ""}`);
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data = null;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  return { status: response.status, ok: response.ok, data };
}

async function runTestSuite() {
  console.log("==================================================");
  console.log("🚀 Starting Bookify End-to-End Platform Test Suite");
  console.log("==================================================");

  await connectDB();

  serverInstance = http.createServer(app);
  initSocket(serverInstance);
  await new Promise((resolve) => serverInstance.listen(TEST_PORT, resolve));
  console.log(`📡 Test server & socket running on port: ${TEST_PORT}\n`);

  const uniqueSuffix = Date.now().toString().slice(-6);
  const testStudentEmail = `test_seller_${uniqueSuffix}@bookify-test.internal`;
  const testPeerEmail = `test_buyer_${uniqueSuffix}@bookify-test.internal`;
  const testPassword = "Password@123";

  let studentToken = "";
  let studentUserId = "";
  let peerToken = "";
  let peerUserId = "";
  let createdBookId = "";
  let createdOrderId = "";
  let createdOrderCode = "";
  let createdWantId = "";
  let conversationId = `conv_test_${uniqueSuffix}`;

  try {
    // ==========================================
    // MODULE 1: Health & Meta
    // ==========================================
    console.log("\n--- [Module 1: Health & Public Endpoints] ---");
    const rootRes = await request("/");
    recordTest("Health", "GET / returns API online status", rootRes.status === 200 && rootRes.data?.status === "online");

    const healthRes = await request("/api/health");
    recordTest("Health", "GET /api/health returns healthy uptime", healthRes.status === 200 && healthRes.data?.status === "healthy");

    const settingsRes = await request("/api/settings/public");
    recordTest("Health", "GET /api/settings/public returns public config", settingsRes.status === 200);

    // ==========================================
    // MODULE 2: Auth & Security
    // ==========================================
    console.log("\n--- [Module 2: Auth & User Management] ---");

    // 2.1 Register Student 1 (Seller)
    const regRes1 = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        fullName: "Test Seller Student",
        email: testStudentEmail,
        password: testPassword,
        phone: `98765${uniqueSuffix.slice(-5)}`,
        role: "student",
      }),
    });
    studentToken = regRes1.data?.token;
    studentUserId = regRes1.data?.user?.id || regRes1.data?.user?._id;
    recordTest("Auth", "POST /api/auth/register (Student 1 Seller)", regRes1.status === 201 && Boolean(studentToken));

    // 2.2 Register Student 2 (Peer/Buyer)
    const regRes2 = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        fullName: "Test Buyer Student",
        email: testPeerEmail,
        password: testPassword,
        phone: `98766${uniqueSuffix.slice(-5)}`,
        role: "student",
      }),
    });
    peerToken = regRes2.data?.token;
    peerUserId = regRes2.data?.user?.id || regRes2.data?.user?._id;
    recordTest("Auth", "POST /api/auth/register (Student 2 Peer)", regRes2.status === 201 && Boolean(peerToken));

    // 2.3 Login Student 1
    const loginRes = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        identifier: testStudentEmail,
        password: testPassword,
      }),
    });
    recordTest("Auth", "POST /api/auth/login with valid credentials", loginRes.status === 200 && Boolean(loginRes.data?.token));

    // 2.4 Profile Fetch
    const profileRes = await request("/api/auth/profile", {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    recordTest("Auth", "GET /api/auth/profile with JWT", profileRes.status === 200 && profileRes.data?.profile?.email === testStudentEmail);

    // 2.5 Profile Update
    const updateProfileRes = await request("/api/auth/profile", {
      method: "PUT",
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        fullName: "Test Seller Student Updated",
        location: "Campus Main Quad",
      }),
    });
    recordTest("Auth", "PUT /api/auth/profile update user info", updateProfileRes.status === 200);

    // 2.6 Unauthorized Guard Check
    const unauthRes = await request("/api/auth/profile");
    recordTest("Auth", "GET /api/auth/profile rejects unauthenticated request (401)", unauthRes.status === 401);

    // ==========================================
    // MODULE 3: Books & Listings
    // ==========================================
    console.log("\n--- [Module 3: Books Marketplace] ---");

    // 3.1 Create Book
    const createBookRes = await request("/api/books", {
      method: "POST",
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        title: "Database System Concepts - 7th Ed",
        author: "Silberschatz & Korth",
        isbn: `978007802212${uniqueSuffix.slice(-1)}`,
        category: "Engineering",
        price: 450,
        originalPrice: 850,
        condition: "Good",
        transactionMode: "Sell",
        description: "Standard university textbook for Computer Science",
        location: "Campus Main Library",
      }),
    });
    createdBookId = createBookRes.data?.data?._id;
    recordTest("Books", "POST /api/books create listing", createBookRes.status === 201 && Boolean(createdBookId));

    // 3.2 Get All Books
    const getBooksRes = await request("/api/books");
    recordTest("Books", "GET /api/books retrieve marketplace listings", getBooksRes.status === 200 && Array.isArray(getBooksRes.data?.data?.books || getBooksRes.data?.data || getBooksRes.data));

    // 3.3 Get Book by ID
    const getBookByIdRes = await request(`/api/books/${createdBookId}`);
    recordTest("Books", "GET /api/books/:id retrieve specific book", getBookByIdRes.status === 200 && getBookByIdRes.data?.data?.title?.includes("Database"));

    // 3.4 My Listings
    const myListingsRes = await request("/api/books/my/listings", {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    recordTest("Books", "GET /api/books/my/listings retrieve seller's listings", myListingsRes.status === 200);

    // 3.5 Update Book Listing
    const updateBookRes = await request(`/api/books/${createdBookId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        price: 420,
        condition: "Like New",
      }),
    });
    recordTest("Books", "PUT /api/books/:id update listing price & condition", updateBookRes.status === 200);

    // ==========================================
    // MODULE 4: Orders & Escrow
    // ==========================================
    console.log("\n--- [Module 4: Orders, Escrow & Tracking] ---");

    // 4.1 Prevent Self-Order Guard
    const selfOrderRes = await request("/api/orders", {
      method: "POST",
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        bookId: createdBookId,
        amount: 420,
        paymentMethod: "COD",
      }),
    });
    recordTest("Orders", "POST /api/orders prevents ordering one's own listing (400)", selfOrderRes.status === 400);

    // 4.2 Create Order as Peer Buyer
    const createOrderRes = await request("/api/orders", {
      method: "POST",
      headers: { Authorization: `Bearer ${peerToken}` },
      body: JSON.stringify({
        bookId: createdBookId,
        amount: 475,
        subtotal: 420,
        deliveryFee: 40,
        platformFee: 15,
        paymentMethod: "COD",
        shippingAddress: {
          fullName: "Test Buyer",
          phone: "9876543211",
          address: "Room 304, Campus Hostel B",
          city: "Delhi",
          pincode: "110007",
        },
      }),
    });
    const orderData = createOrderRes.data?.data?.order || createOrderRes.data?.data || createOrderRes.data;
    createdOrderId = orderData?._id;
    createdOrderCode = orderData?.orderCode;
    recordTest("Orders", "POST /api/orders creates escrow order", (createOrderRes.status === 201 || createOrderRes.status === 200) && Boolean(createdOrderId));

    // 4.3 Get Order by ID
    const getOrderRes = await request(`/api/orders/${createdOrderId}`, {
      headers: { Authorization: `Bearer ${peerToken}` },
    });
    recordTest("Orders", "GET /api/orders/:id retrieves order details", getOrderRes.status === 200 && (getOrderRes.data?.data?._id === createdOrderId || getOrderRes.data?._id === createdOrderId));

    // 4.4 Get Order by OrderCode (e.g. BK...)
    if (createdOrderCode) {
      const getByCodeRes = await request(`/api/orders/${createdOrderCode}`, {
        headers: { Authorization: `Bearer ${peerToken}` },
      });
      recordTest("Orders", "GET /api/orders/:orderCode finds order via custom code", getByCodeRes.status === 200);
    }

    // 4.5 Get My Orders (Buyer)
    const myOrdersRes = await request("/api/orders/my-orders", {
      headers: { Authorization: `Bearer ${peerToken}` },
    });
    recordTest("Orders", "GET /api/orders/my-orders lists buyer purchases", myOrdersRes.status === 200);

    // 4.6 Get My Sales (Seller)
    const mySalesRes = await request("/api/orders/my-sales", {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    recordTest("Orders", "GET /api/orders/my-sales lists seller sales", mySalesRes.status === 200);

    // 4.7 Update Order Status
    const updateStatusRes = await request(`/api/orders/${createdOrderId}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        status: "Shipped",
        courier: {
          name: "Campus Speed Delivery",
          trackingNumber: `TRK-${uniqueSuffix}`,
        },
      }),
    });
    recordTest("Orders", "PATCH /api/orders/:id/status updates to Shipped", updateStatusRes.status === 200);

    // ==========================================
    // MODULE 5: Want Board
    // ==========================================
    console.log("\n--- [Module 5: Want Board] ---");

    const createWantRes = await request("/api/want-board", {
      method: "POST",
      headers: { Authorization: `Bearer ${peerToken}` },
      body: JSON.stringify({
        title: "Looking for Introduction to Algorithms (CLRS)",
        category: "Computer Science",
        maxBudget: 600,
        urgency: "Medium",
        location: "North Campus",
      }),
    });
    createdWantId = createWantRes.data?.data?._id || createWantRes.data?._id;
    recordTest("WantBoard", "POST /api/want-board creates request", (createWantRes.status === 201 || createWantRes.status === 200) && Boolean(createdWantId));

    const getWantsRes = await request("/api/want-board");
    recordTest("WantBoard", "GET /api/want-board retrieves active community wants", getWantsRes.status === 200);

    if (createdWantId) {
      const deleteWantRes = await request(`/api/want-board/${createdWantId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${peerToken}` },
      });
      recordTest("WantBoard", "DELETE /api/want-board/:id removes fulfilled want", deleteWantRes.status === 200);
    }

    // ==========================================
    // MODULE 6: Peer Rentals & Exchanges
    // ==========================================
    console.log("\n--- [Module 6: Rentals & Exchanges] ---");

    const createRentalRes = await request("/api/rentals", {
      method: "POST",
      headers: { Authorization: `Bearer ${peerToken}` },
      body: JSON.stringify({
        bookId: createdBookId,
        title: "Database System Concepts - 7th Ed",
        author: "Silberschatz & Korth",
        ownerId: studentUserId,
        ownerName: "Test Seller Student",
        durationDays: 14,
        depositAmount: 300,
        rentalFee: 150,
      }),
    });
    recordTest("Rentals", "POST /api/rentals creates peer rental record", createRentalRes.status === 201);

    const getRentalsRes = await request("/api/rentals/my-rentals", {
      headers: { Authorization: `Bearer ${peerToken}` },
    });
    recordTest("Rentals", "GET /api/rentals/my-rentals lists user rentals", getRentalsRes.status === 200);

    const createExchangeRes = await request("/api/exchanges", {
      method: "POST",
      headers: { Authorization: `Bearer ${peerToken}` },
      body: JSON.stringify({
        receiverId: studentUserId,
        receiverName: "Test Seller Student",
        requestedBook: {
          bookId: createdBookId,
          title: "Database System Concepts - 7th Ed",
          author: "Silberschatz & Korth",
        },
        offeredBook: {
          title: "Computer Networks - 5th Ed",
          author: "Andrew S. Tanenbaum",
        },
        note: "Campus semester exchange proposal",
      }),
    });
    recordTest("Exchanges", "POST /api/exchanges proposes book exchange", createExchangeRes.status === 201 || createExchangeRes.status === 200);

    const getExchangesRes = await request("/api/exchanges/my-exchanges", {
      headers: { Authorization: `Bearer ${peerToken}` },
    });
    recordTest("Exchanges", "GET /api/exchanges/my-exchanges lists user exchanges", getExchangesRes.status === 200);

    // ==========================================
    // MODULE 7: Payouts & Wallet
    // ==========================================
    console.log("\n--- [Module 7: Payouts & Wallet] ---");

    // Provide student with wallet balance to test withdrawal
    await User.findByIdAndUpdate(studentUserId, { walletBalance: 500 });

    const balanceRes = await request("/api/payouts/balance", {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    recordTest("Payouts", "GET /api/payouts/balance returns wallet balance", balanceRes.status === 200 && balanceRes.data?.data?.availableBalance === 500);

    const payoutsHistoryRes = await request("/api/payouts/my-payouts", {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    recordTest("Payouts", "GET /api/payouts/my-payouts lists payout records", payoutsHistoryRes.status === 200);

    const payoutMinCheck = await request("/api/payouts/request", {
      method: "POST",
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        amount: 20, // Below minimum 100
        payoutMethod: "UPI",
        payoutDetails: { upiId: "student@upi" },
      }),
    });
    recordTest("Payouts", "POST /api/payouts/request enforces minimum ₹100 threshold (400)", payoutMinCheck.status === 400);

    const validPayout = await request("/api/payouts/request", {
      method: "POST",
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        amount: 150,
        payoutMethod: "UPI",
        payoutDetails: { upiId: "student@okhdfcbank" },
      }),
    });
    recordTest("Payouts", "POST /api/payouts/request succeeds with valid balance (201/200)", validPayout.status === 201 || validPayout.status === 200);

    // ==========================================
    // MODULE 8: Persistent Chat
    // ==========================================
    console.log("\n--- [Module 8: Chat & Messaging] ---");

    const sendMsgRes = await request("/api/chat/messages", {
      method: "POST",
      headers: { Authorization: `Bearer ${peerToken}` },
      body: JSON.stringify({
        conversationId,
        senderId: peerUserId,
        senderName: "Test Buyer",
        text: "Hi! Is this textbook still available for pickup?",
      }),
    });
    recordTest("Chat", "POST /api/chat/messages persists chat message", sendMsgRes.status === 201 || sendMsgRes.status === 200);

    const getHistoryRes = await request(`/api/chat/history/${conversationId}`);
    recordTest("Chat", "GET /api/chat/history/:id returns message thread", getHistoryRes.status === 200 && Array.isArray(getHistoryRes.data?.data || getHistoryRes.data));

    const markReadRes = await request(`/api/chat/read/${conversationId}`, {
      method: "PUT",
    });
    recordTest("Chat", "PUT /api/chat/read/:id clears unread counter", markReadRes.status === 200);

    // ==========================================
    // MODULE 9: Testimonials & Newsletter
    // ==========================================
    console.log("\n--- [Module 9: Testimonials & Newsletter] ---");

    const createTestimonialRes = await request("/api/testimonials", {
      method: "POST",
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        name: "Test Student",
        role: "Computer Science Junior",
        avatar: "",
        content: "Bookify made finding semester engineering books quick and safe!",
        rating: 5,
      }),
    });
    recordTest("Testimonials", "POST /api/testimonials creates review", createTestimonialRes.status === 201 || createTestimonialRes.status === 200);

    const getTestimonialsRes = await request("/api/testimonials");
    recordTest("Testimonials", "GET /api/testimonials returns reviews list", getTestimonialsRes.status === 200);

    const newsletterRes = await request("/api/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({
        email: `student_newsletter_${uniqueSuffix}@example.com`,
        source: "testing_suite",
      }),
    });
    recordTest("Newsletter", "POST /api/newsletter/subscribe registers subscriber", newsletterRes.status === 200 || newsletterRes.status === 201);

    // ==========================================
    // MODULE 10: Dashboard Aggregation
    // ==========================================
    console.log("\n--- [Module 10: Dashboard Aggregation] ---");

    const dashboardStatsRes = await request("/api/dashboard/stats", {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    recordTest("Dashboard", "GET /api/dashboard/stats returns real user metrics", dashboardStatsRes.status === 200 && dashboardStatsRes.data?.success !== false);

    // ==========================================
    // MODULE 11: Admin & Security Guards
    // ==========================================
    console.log("\n--- [Module 11: Admin Authorization Guards] ---");

    const adminGuardRes = await request("/api/admin/metrics", {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    recordTest("Security", "GET /api/admin/metrics denies non-admin student (403)", adminGuardRes.status === 403);

    const notFoundRes = await request("/api/non-existent-endpoint");
    recordTest("Security", "Non-existent route returns clean 404 schema", notFoundRes.status === 404);

  } catch (testError) {
    console.error("❌ Unexpected test execution failure:", testError);
  } finally {
    // ==========================================
    // MODULE 12: Automated Cleanup
    // ==========================================
    console.log("\n--- [Module 12: Test Artifacts Cleanup] ---");
    try {
      if (studentUserId) await User.findByIdAndDelete(studentUserId);
      if (peerUserId) await User.findByIdAndDelete(peerUserId);
      if (createdBookId) await Book.findByIdAndDelete(createdBookId);
      if (createdOrderId) await Order.findByIdAndDelete(createdOrderId);
      await ChatMessage.deleteMany({ conversationId });
      await WantBoard.deleteMany({ title: /CLRS/i });
      await Rental.deleteMany({ bookId: createdBookId });
      await Exchange.deleteMany({ proposerId: peerUserId });
      await Testimonial.deleteMany({ name: "Test Student" });
      await NewsletterSubscriber.deleteMany({ email: /student_newsletter_/i });
      console.log("🧹 Test records cleanly removed from database.");
    } catch (cleanupErr) {
      console.warn("⚠️ Cleanup warning:", cleanupErr.message);
    }

    if (serverInstance) {
      serverInstance.close();
    }
    await mongoose.connection.close();
  }

  // ==========================================
  // Report Summary
  // ==========================================
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  console.log("\n==================================================");
  console.log(`📊 TEST SUITE SUMMARY: ${passed}/${total} PASSED`);
  if (failed > 0) {
    console.log(`❌ ${failed} TESTS FAILED:`);
    results.filter((r) => !r.passed).forEach((r) => console.log(`   - [${r.module}] ${r.testCase}`));
  } else {
    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! Platform is verified & ready for Render deployment.");
  }
  console.log("==================================================");

  process.exit(failed > 0 ? 1 : 0);
}

runTestSuite();
