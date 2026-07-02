import { Router, Request, Response } from "express";
import { z } from "zod";
import { rateLimit } from "express-rate-limit";
import { sendOwnerBookingSMS } from "../services/sms";

const router = Router();

const bookingSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  // Instagram username instead of email — @ optional, letters/digits/._ only.
  instagram: z
    .string()
    .trim()
    .min(1, "Instagram username is required")
    .max(60)
    .transform((v) => v.replace(/^@+/, ""))
    .refine(
      (v) => /^[A-Za-z0-9._]{1,30}$/.test(v),
      "Invalid Instagram username"
    ),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .max(30)
    .refine(
      (v) => /^\+?[\d\s\-().]+$/.test(v),
      "Invalid phone number format"
    )
    .refine(
      (v) => (v.match(/\d/g)?.length ?? 0) >= 10,
      "Phone number needs at least 10 digits"
    ),
  style: z.string().trim().max(60).optional().default(""),
  placement: z.string().trim().max(120).optional().default(""),
  size: z.string().trim().max(120).optional().default(""),
  date: z.string().trim().max(40).optional().default(""),
  idea: z.string().trim().min(1, "Tell us about the idea").max(2000),
});

// Guard the public endpoint against spam / abuse.
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many booking requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/bookings — validate a consultation request and text the owner.
router.post("/", bookingLimiter, async (req: Request, res: Response) => {
  try {
    const booking = bookingSchema.parse(req.body);

    const businessPhone = process.env.BUSINESS_PHONE;
    if (!businessPhone) {
      // The customer's request still "succeeds"; we just can't notify anyone.
      console.warn("BUSINESS_PHONE not set — owner will not be notified.");
    } else {
      try {
        await sendOwnerBookingSMS(businessPhone, booking);
      } catch (smsError) {
        // Don't fail the customer's submission if the SMS gateway hiccups.
        console.error("Owner SMS failed:", smsError);
      }
    }

    res.status(201).json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: error.errors });
    }
    console.error("Error handling booking:", error);
    res.status(500).json({ error: "Failed to submit booking" });
  }
});

export default router;
