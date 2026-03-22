import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Basic validation
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const trimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const { error } = await supabase
      .from("waitlist")
      .insert({ email: trimmed });

    if (error) {
      // Unique constraint violation — already signed up
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "This email is already on the waitlist." },
          { status: 409 }
        );
      }
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Waitlist API error:", err);
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
