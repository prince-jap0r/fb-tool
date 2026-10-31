# FB Tool - iPhone Setup Guide

iPhone থেকে ডাউনলোড ছাড়াই পুরো প্রজেক্ট বানানোর নিয়ম:

### ধাপ ১: GitHub Repo তৈরি
1. Safari তে github.com এ যাও
2. + > New repository > নাম দাও: fb-tool
3. Create repository চাপো

### ধাপ ২: ফাইলগুলো পেস্ট করো
1. Add file > Create new file এ যাও
2. উপরের কার্ড থেকে ফাইলের নাম কপি করো (যেমন: package.json)
3. নামের ঘরে পেস্ট করো। যদি ফোল্ডার থাকে যেমন lib/supabase.js - তাহলে পুরো পাথ লিখো
4. নিচের বড় কোড বক্স থেকে কোড Copy করে GitHub এর এডিটরে পেস্ট করো
5. Commit changes চাপো
6. একইভাবে ৯ টা ফাইলই বানাও

### ধাপ ৩: Supabase টেবিল
Supabase এ গিয়ে SQL Editor এ রান করো:
create table scheduled_posts (
  id uuid default gen_random_uuid() primary key,
  message text not null,
  publish_at timestamptz not null,
  status text default 'pending',
  created_at timestamptz default now()
);

### ধাপ ৪: Vercel Deploy
1. vercel.com এ GitHub দিয়ে লগইন
2. Import Project > fb-tool সিলেক্ট
3. Environment Variables এ .env.example এর ৪ টা ভ্যারিয়েবল বসাও
4. Deploy চাপো

ব্যাস! তোমার FB Automation টুল রেডি!

### ব্যবহার:
- Vercel লিংকে গিয়ে মেসেজ লিখো
- Post Now চাপলে সাথে সাথে পেজে পোস্ট হবে
- Schedule দিলে নির্ধারিত সময়ে Cron থেকে পোস্ট হবে
