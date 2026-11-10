import { createClient } from '@supabase/supabase-js';

// Environment variables or fallback local state
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const SQL_SCHEMA_BLUEPRINT = `-- ==========================================
-- ZAVREX LUXURY FRAGRANCES - SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Products Table
create table if not exists public.products (
  id text primary key,
  name text not null,
  tagline text,
  category text not null,
  description text not null,
  prices jsonb not null,
  original_prices jsonb,
  images jsonb not null default '[]'::jsonb,
  notes jsonb not null,
  concentration text,
  longevity text,
  sillage text,
  stock jsonb not null,
  is_featured boolean default false,
  is_bestseller boolean default false,
  is_new_arrival boolean default false,
  is_signature boolean default false,
  rating numeric default 5.0,
  reviews_count integer default 0,
  origin text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Orders Table
create table if not exists public.orders (
  id text primary key,
  order_number text unique not null,
  customer jsonb not null,
  items jsonb not null,
  subtotal numeric not null,
  delivery_fee numeric not null default 0,
  discount_amount numeric not null default 0,
  promo_code text,
  total numeric not null,
  payment_method text not null,
  status text not null default 'pending',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Customer Reviews Table
create table if not exists public.reviews (
  id text primary key,
  product_id text references public.products(id) on delete cascade,
  product_name text not null,
  author text not null,
  city text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  title text not null,
  comment text not null,
  date text not null,
  verified_purchase boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Store Settings Table
create table if not exists public.settings (
  id text primary key default 'zavrex_main_settings',
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Inquiries Table
create table if not exists public.inquiries (
  id text primary key,
  name text not null,
  phone text not null,
  email text,
  message text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Row Level Security (RLS)
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.reviews enable row level security;
alter table public.settings enable row level security;
alter table public.inquiries enable row level security;

-- Public can read products, reviews and store settings
create policy "Public read products" on public.products for select using (true);
create policy "Public read reviews" on public.reviews for select using (true);
create policy "Public read settings" on public.settings for select using (true);

-- Public can place orders and send reviews/inquiries
create policy "Public insert orders" on public.orders for insert with check (true);
create policy "Public insert reviews" on public.reviews for insert with check (true);
create policy "Public insert inquiries" on public.inquiries for insert with check (true);

-- Authenticated admins can manage everything
create policy "Admin all products" on public.products for all to authenticated using (true);
create policy "Admin all orders" on public.orders for all to authenticated using (true);
create policy "Admin all reviews" on public.reviews for all to authenticated using (true);
create policy "Admin all settings" on public.settings for all to authenticated using (true);
create policy "Admin all inquiries" on public.inquiries for all to authenticated using (true);
`;
