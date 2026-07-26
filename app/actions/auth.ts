"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAdmin(formData: FormData) {
  const pin = formData.get("pin");

  if (pin === "2026") {
    // Await the cookies object (Required in Next.js 15+)
    const cookieStore = await cookies();
    
    // Issue a secure, HTTP-only cookie valid for 24 hours
    cookieStore.set("ecolens-admin-auth", "verified", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, 
      path: "/",
    });
    
    // Send them straight to the secure dashboard
    redirect("/dashboard");
  }
  
  return { error: "Invalid authorization code." };
}

export async function logoutAdmin() {
  // Await the cookies object before deleting
  const cookieStore = await cookies();
  cookieStore.delete("ecolens-admin-auth");
  
  redirect("/admin/login");
}