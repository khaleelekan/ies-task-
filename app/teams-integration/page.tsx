"use client"

import { useState } from "react"
import { MessageSquare, Send, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TeamsIntegrationPage() {
  const [webhookUrl, setWebhookUrl] = useState("")
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSendMessage = async () => {
    setIsSending(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate inputs before sending
      if (!webhookUrl.trim()) {
        throw new Error("Please enter a webhook URL")
      }
      if (!message.trim()) {
        throw new Error("Please enter a message")
      }

      // Call your new API endpoint
      const response = await fetch("/api/teams/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          webhookUrl,
          message,
        }),
      })

      const data = await response.json()

      // Handle errors
      if (!response.ok) {
        throw new Error(data.error || "Failed to send message")
      }

      // Show success
      setSuccess("Message sent to Microsoft Teams successfully!")
      setMessage("") // Clear the message field
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Microsoft Teams Integration</h1>
        <p className="text-muted-foreground">
          Send notifications and messages to your Microsoft Teams channels
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Send Test Message
          </CardTitle>
          <CardDescription>
            Test your Teams webhook integration by sending a message
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Success Alert */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Webhook URL Input */}
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              type="url"
              placeholder="https://outlook.office.com/webhook/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              disabled={isSending}
            />
            <p className="text-sm text-muted-foreground">
              Get this from your Teams channel's Incoming Webhook connector
            </p>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSending}
              rows={6}
            />
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendMessage}
            disabled={isSending || !webhookUrl.trim() || !message.trim()}
            className="w-full"
          >
            {isSending ? (
              <>
                <span className="mr-2">Sending...</span>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Test Message
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle>How to Get Your Webhook URL</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Open Microsoft Teams (web or desktop app)</li>
            <li>Navigate to the channel where you want to receive messages</li>
            <li>Click the "..." menu next to the channel name</li>
            <li>Select "Manage channel" or "Connectors"</li>
            <li>Search for "Incoming Webhook" and click "Configure"</li>
            <li>Give your webhook a name (e.g., "i-eSchool Notifications")</li>
            <li>Optionally upload an image</li>
            <li>Click "Create" and copy the webhook URL</li>
            <li>Paste the URL in the field above</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}