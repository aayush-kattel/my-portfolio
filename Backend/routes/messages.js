const router      = require("express").Router();
const nodemailer  = require("nodemailer");
const Message     = require("../models/Message");
const auth        = require("../middleware/auth");
const rateLimit  = require("express-rate-limit");

/* ── Rate limiting for contact form ── */
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5,
  message: { error: "Too many messages, please try again later." },
});

/* ── Nodemailer transporter ── */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,   // App Password (not account password)
  },
});

// POST /api/messages  — public (contact form submission)
router.post("/", contactLimiter ,async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: "Name, email, and message are required." });

  try {
    // 1. Save to DB
    const saved = await Message.create({ name, email, subject, message });

    // 2. Thank-you email → visitor
    await transporter.sendMail({
      from: `"Aayush Kattel" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Thanks for reaching out! 🙌",
      html: `
        <div style="font-family:monospace;max-width:560px;margin:0 auto;padding:32px;background:#13131f;color:#e2e8f0;border-radius:12px;">
          <div style="margin-bottom:24px;">
            <span style="font-size:18px;font-weight:700;background:linear-gradient(90deg,#5ba898,#d4935a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Aayush Kattel</span>
            <span style="display:block;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#5ba898;margin-top:2px;">Full Stack Developer · Nepal</span>
          </div>
          <p style="color:#e2e8f0;">Hey <strong>${name}</strong>,</p>
          <p style="color:rgba(228,230,235,0.75);line-height:1.7;">Thanks for getting in touch! I've received your message and will get back to you as soon as possible — usually within 24–48 hours.</p>
          <div style="margin:24px 0;padding:16px;background:rgba(255,255,255,0.04);border-left:3px solid #5ba898;border-radius:6px;">
            <p style="margin:0;font-size:12px;color:rgba(228,230,235,0.5);">Your message:</p>
            <p style="margin:8px 0 0;font-size:13px;color:#e2e8f0;">${message}</p>
          </div>
          <p style="color:rgba(228,230,235,0.75);">Talk soon,<br/><strong style="color:#5ba898;">Aayush</strong></p>
          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;"/>
          <p style="font-size:10px;color:rgba(228,230,235,0.3);">This is an automated confirmation. Please do not reply to this email.</p>
        </div>
      `,
    });

    // 3. Notification email → owner
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: `📬 New message from ${name} — ${subject || "No subject"}`,
      html: `
        <div style="font-family:monospace;max-width:560px;margin:0 auto;padding:32px;background:#13131f;color:#e2e8f0;border-radius:12px;">
          <h2 style="color:#5ba898;margin-top:0;">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <tr><td style="padding:8px 0;color:rgba(228,230,235,0.5);width:90px;">Name</td><td style="color:#e2e8f0;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:rgba(228,230,235,0.5);">Email</td><td><a href="mailto:${email}" style="color:#5ba898;">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:rgba(228,230,235,0.5);">Subject</td><td style="color:#e2e8f0;">${subject || "—"}</td></tr>
          </table>
          <div style="margin-top:16px;padding:16px;background:rgba(255,255,255,0.04);border-left:3px solid #d4935a;border-radius:6px;">
            <p style="margin:0;color:#e2e8f0;line-height:1.7;">${message}</p>
          </div>
          <p style="font-size:11px;color:rgba(228,230,235,0.3);margin-top:20px;">Received at ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    res.status(201).json({ success: true, id: saved._id });
  } catch (e) {
    console.error("Message route error:", e.message);
    res.status(500).json({ error: "Failed to process message. Please try again." });
  }
});

// GET /api/messages  — protected (admin)
router.get("/", auth, async (req, res) => {
  try {
    res.json(await Message.find().sort({ createdAt: -1 }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PATCH /api/messages/:id  — mark read / replied
router.patch("/:id", auth, async (req, res) => {
  try {
    const doc = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// DELETE /api/messages/:id  — protected
router.delete("/:id", auth, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;