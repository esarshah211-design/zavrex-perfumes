# ZAVREX — Luxury Attar & Fragrance House

> **"Beyond Fragrance. Beyond Ordinary."**
> Artisanal, non-alcoholic concentrated perfume oils and pure attars handcrafted in **Peshawar, Pakistan**.

---

## 🏛️ Brand Overview

- **Brand:** ZAVREX
- **Origin:** Peshawar, Khyber Pakhtunkhwa, Pakistan
- **Specialty:** 100% Pure Perfume Oils (Attars), Assamese Agarwood, Cambodian Oud, Taif Rose, and Royal Ambergris
- **Official WhatsApp:** `+923109554240`
- **Social Media:** 
  - Instagram: `@zavrex.pk`
  - TikTok: `@zavrex.official`

---

## 💎 Features

1. **Luxury Editorial Visual Identity:**
   - Deep matte black canvas (`#0B0B0C`), Champagne gold accents (`#D4AF37`), warm ivory typography.
   - High-contrast serif headlines paired with modern sans-serif readability.
   - Ultra high-fidelity studio perfume photography.

2. **Full-Featured E-Commerce Experience:**
   - Multi-category shop: *Men's Collection*, *Women's Collection*, *Unisex Collection*, *Arabian Oud*, *Musk Collection*, *Signature Collection*.
   - Dynamic bottle volume selection (**6ml**, **12ml**, **30ml**) with instant price & inventory updates.
   - Olfactory pyramids with Top, Heart, and Base notes breakdown.
   - Slide-out cart drawer with free delivery progress calculation (Free over PKR 4,000 nationwide).
   - Promo voucher system (`ZAVREX10`, `ROYAL15`, `PESHAWAR`).

3. **Streamlined Pakistani Checkout:**
   - Tailored city selection (Peshawar, Islamabad, Lahore, Karachi, Rawalpindi, etc.).
   - **Cash on Delivery (COD)** — Pakistan's primary payment method.
   - **Direct Bank Transfer** — Meezan Bank, Nayapay, SadaPay instructions with account details.
   - Unique Order ID generation (`ZVX-2026-XXXX`).
   - 1-Click WhatsApp Order notification carrying the full structured order payload.

4. **Dedicated Secure Admin Dashboard (`/admin`):**
   - **Login Credentials:**
     - **Username:** `admin` (or `admin@zavrex.com`)
     - **Password:** `esarshah1234`
   - **Security Features:**
     - Passwords are encrypted and verified using Supabase Auth & salted cryptographic SHA-256 hash.
     - Never exposed in plaintext within frontend code.
     - Secure password change interface under **Security & Password** tab in dashboard.
     - Protected routes — all management capabilities require an authenticated session.
   - Overview metrics: Total Revenue (PKR), Total Orders, Pending Dispatches, Active Inventory.
   - Order management: Search, filter by status, change fulfillment state (Pending, Confirmed, Dispatched, Delivered, Cancelled), print packing slips.
   - Fragrance catalog manager: Add new perfumes, modify 6ml/12ml/30ml prices, adjust stock, manage olfactory notes and tags.
   - Website manager: Update hero headline, banners, WhatsApp number, Instagram/TikTok links, delivery fees.
   - Reviews manager: Moderate client appraisals.

5. **Dual-Mode Backend Engine:**
   - **Immediate Out-of-the-Box Mode:** Fully persistent via browser storage (localStorage) for seamless zero-setup evaluation in AI Studio and preview environments.
   - **Supabase Cloud Mode:** Real Supabase client with PostgreSQL schema, RLS policies, and sync methods ready to connect.

---

## 🗄️ Supabase Database Setup

To link your live Supabase cloud database:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard and run the schema script located in `src/lib/supabase.ts` (or copy it directly from the Admin Panel under **Supabase & Deployment**).
3. The SQL schema provisions:
   - `public.products`
   - `public.orders`
   - `public.reviews`
   - `public.settings`
   - `public.inquiries`
   - Row Level Security (RLS) policies allowing public browsing/ordering and authenticated admin control.
4. Add your environment variables:
   ```env
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key"
   ```

---

## 🚀 Netlify Deployment Guide

The project is pre-configured with `netlify.toml` and `public/_redirects` for Single Page Application (SPA) routing.

### Step 1: Push to GitHub / GitLab
```bash
git add .
git commit -m "Deploy ZAVREX luxury fragrance house"
git push origin main
```

### Step 2: Import into Netlify
1. Log in to [Netlify](https://app.netlify.com).
2. Click **"Add new site"** &gt; **"Import an existing project"**.
3. Select your repository.
4. Netlify will auto-detect settings from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. *(Optional)* Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under **Site configuration > Environment variables**.
6. Click **Deploy Site**.

---

## 📱 Mobile-First Social Architecture

Most traffic arrives via Instagram reels and TikTok links. ZAVREX includes:
- A pinned thumb-navigation bar on mobile screens.
- Zero-clutter sticky header under 15% viewport height limit.
- Direct 1-tap WhatsApp consultation buttons with pre-filled fragrance inquiries.

---

## 🛡️ License

Private Luxury Attar E-Commerce Platform — © 2026 ZAVREX. All rights reserved.
