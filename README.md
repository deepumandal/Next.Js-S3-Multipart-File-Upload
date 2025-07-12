# 🧩 Next.js + S3 Multipart File Upload

A modern and scalable **multipart file uploader** built with **Next.js API routes** and **Amazon S3** using presigned URLs. This project is ideal for uploading large files (even up to GBs!) from the frontend directly to S3 — with minimal server strain, granular progress tracking, and smooth parallel uploads.

---

## 🚀 Purpose

To **demonstrate how to upload large files** (PDFs, videos, ZIPs, etc.) from a Next.js frontend by:
- Splitting into 100 equal chunks
- Uploading via **presigned URLs** securely
- Tracking progress per chunk
- Completing the upload using AWS's multipart system

> ✅ Designed for performance, scalability, and learning!

---

## 👨‍💻 Author

**Made by:** [Deepak Mandal](https://github.com/deepumandal)  
💼 Full Stack Developer | MERN + DevOps + AWS  
🔗 [LinkedIn](https://linkedin.com/in/deepumandal) | 🐦 [Twitter](https://x.com/Prime__23)

---

## 🌐 Live Demo

Try the working demo here:  
**[nextjs-s3-upload.deepumandal.in](https://nextjs-s3-upload.deepumandal.in)**  
> _Note: Demo may restrict file size for testing purposes._

---

## 🔑 Environment Setup

Create a `.env.local` file in the root:

```env
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
AWS_SECRET_KEY_ID=YOUR_AWS_SECRET_KEY_ID
AWS_BUCKET_NAME=YOUR_BUCKET_NAME
