import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const client = await clientPromise;
    const db = client.db("vom_sauterhof");
    const homepageCollection = db.collection("homepage");

    await homepageCollection.updateOne({}, { $set: body }, { upsert: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating homepage content:", error);
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    );
  }
}
