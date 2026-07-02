import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, userId, amount } = body;

    if (!token || !userId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: token, userId, amount" },
        { status: 400 }
      );
    }

    // Call the HDFC bank webhook running locally on port 3003
    const response = await fetch("http://127.0.0.1:3003/hdfcWebhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        user_identifier: userId,
        amount: amount.toString(),
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to trigger webhook on bank processor" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Webhook successfully processed by bank server",
      data,
    });
  } catch (error: any) {
    console.error("Webhook proxy error:", error);
    return NextResponse.json(
      { error: "Could not reach bank-webhook server on http://127.0.0.1:3003. Make sure it is running." },
      { status: 500 }
    );
  }
}
