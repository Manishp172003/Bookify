import cron from "node-cron";
import Order from "../models/Order.js";
import { getIO } from "../config/socket.js";

/**
 * Executes the escrow release logic:
 * Finds orders that have been 'Delivered' for >= 48 hours, with escrowStatus === 'Held',
 * and auto-releases them to 'Released'.
 */
export const runEscrowReleaseJob = async () => {
  try {
    const cutoffTime = new Date(Date.now() - 48 * 60 * 60 * 1000); // 48 hours ago

    const eligibleOrders = await Order.find({
      status: "Delivered",
      escrowStatus: "Held",
      deliveredAt: { $exists: true, $ne: null, $lte: cutoffTime },
    });

    if (eligibleOrders.length === 0) {
      return { releasedCount: 0 };
    }

    console.log(`[Escrow Cron] Found ${eligibleOrders.length} order(s) eligible for auto-release.`);

    let io = null;
    try {
      io = getIO();
    } catch {
      // Socket might not be initialized yet in test mode
    }

    let releasedCount = 0;

    for (const order of eligibleOrders) {
      order.escrowStatus = "Released";
      await order.save();
      releasedCount++;

      console.log(`[Escrow Cron] Auto-released escrow for order ${order._id} (₹${order.amount})`);

      if (io && order.sellerId) {
        io.to(`user:${order.sellerId.toString()}`).emit("escrowReleased", {
          orderId: order._id,
          amount: order.amount,
          message: "Escrow funds automatically released after 48h dispute-free delivery.",
        });
      }
    }

    return { releasedCount };
  } catch (error) {
    console.error("[Escrow Cron] Error executing auto-release job:", error.message);
    return { error: error.message };
  }
};

/**
 * Initializes the node-cron scheduled job.
 * Runs once every hour: '0 * * * *'
 */
export const startEscrowCron = () => {
  // Run once every hour
  cron.schedule("0 * * * *", async () => {
    console.log("[Escrow Cron] Running hourly escrow auto-release check...");
    await runEscrowReleaseJob();
  });

  console.log("⏰ Escrow auto-release cron schedule active (Hourly)");
};

export default startEscrowCron;
