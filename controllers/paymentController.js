import createError from "http-errors";
import { z } from "zod";
import { Payment } from "../models/Payment.js";

export const createPayment = async (req, res, next) => {
  try {
    const { amount, currency } = z.object({
      amount: z.number().positive(),
      currency: z.string().default("INR"),
    }).parse(req.body);

    const payment = await Payment.create({
      amount,
      currency,
      provider: "mock",
      status: "created",
      providerRef: "MOCK-" + Date.now(),
    });

    res.status(201).json({ message: "Payment created", data: { payment } });
  } catch (err) { next(err); }
};

export const markPaid = async (req, res, next) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, { status: "paid" }, { new: true });
    if (!payment) throw createError(404, "Payment not found");
    res.json({ message: "Payment marked paid", data: { payment } });
  } catch (err) { next(err); }
};

export const listPayments = async (_req, res, next) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json({ data: { payments } });
  } catch (err) { next(err); }
};
