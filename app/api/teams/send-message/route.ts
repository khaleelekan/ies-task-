import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // 1. Parse the request body
    const { webhookUrl, message } = await request.json()

    // 2. Validate inputs
    if (!webhookUrl || !message) {
      return NextResponse.json(
        { error: "Webhook URL and message are required" },
        { status: 400 }
      )
    }

    // 3. Validate webhook URL format
    if (!webhookUrl.includes("webhook.office.com")) {
      return NextResponse.json(
        { error: "Invalid Microsoft Teams webhook URL" },
        { status: 400 }
      )
    }

    // 4. Prepare Teams message card
    const teamsMessage = {
      "@type": "MessageCard",
      "@context": "https://schema.org/extensions",
      "summary": "i-eSchool Notification",
      "themeColor": "6264A7",
      "title": "i-eSchool Admin Panel",
      "sections": [
        {
          "activityTitle": "New Message",
          "activitySubtitle": new Date().toLocaleString(),
          "text": message,
        },
      ],
    }

    // 5. Send to Teams
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teamsMessage),
    })

    // 6. Handle Teams API response
    if (!response.ok) {
      const errorText = await response.text()
      console.error("Teams API error:", errorText)
      throw new Error("Failed to send message to Teams")
    }

    // 7. Return success
    return NextResponse.json({
      success: true,
      message: "Message sent to Microsoft Teams successfully",
    })
  } catch (error) {
    console.error("Error sending to Teams:", error)
    return NextResponse.json(
      {
        error: "Failed to send message to Teams",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}