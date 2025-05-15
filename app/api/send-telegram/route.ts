import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { message, token } = await request.json()

    // Use the provided token or fall back to a default
    const botToken = token || process.env.TELEGRAM_BOT_TOKEN || "8115894799:AAGckh-QqdWre1Bkfq6l8FrQcNqmVPgLJV4"
    const chatId = process.env.TELEGRAM_CHAT_ID || "-1002000000000" // Replace with your actual chat ID

    // Send message to Telegram
    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    })

    const telegramData = await telegramResponse.json()

    if (!telegramResponse.ok) {
      console.error("Telegram API error:", telegramData)
      return NextResponse.json(
        { success: false, error: `Telegram API error: ${telegramData.description || "Unknown error"}` },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, data: telegramData })
  } catch (error) {
    console.error("Error sending message to Telegram:", error)
    return NextResponse.json(
      { success: false, error: `Failed to send message: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
