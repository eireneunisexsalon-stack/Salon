"use server";

import Razorpay from "razorpay";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function createOrder(amount: number) {
  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return { success: true, order };
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return { success: false, error: error.message };
  }
}

export async function verifyPayment(data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  booking_id: string;
  amount: number;
}) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id, amount } = data;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return { success: false, error: "Invalid payment signature" };
    }

    // 1. Update Booking Status
    const { error: bookingError } = await supabase
      .from("bookings")
      .update({
        payment_status: "paid",
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        amount: amount,
        status: "confirmed"
      })
      .eq("id", booking_id);

    if (bookingError) throw bookingError;

    // 2. Record Wallet Transaction
    const { error: transactionError } = await supabase
      .from("wallet_transactions")
      .insert([
        {
          booking_id,
          amount,
          type: "credit",
          status: "success",
          description: `Online payment for booking ${booking_id}`
        }
      ]);

    if (transactionError) throw transactionError;

    return { success: true };
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return { success: false, error: error.message };
  }
}
