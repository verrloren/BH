import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET() {
  const token = (await cookies()).get("poster_token")?.value; 

  const url = `https://api.joinposter.com/v3/menu.getProducts?token=${token}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    return NextResponse.json(data.response);
  } catch (error) {
    console.error("Poster API error:", error);
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
  }
}