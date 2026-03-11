# NexusBot Deployment & Webhook Setup

Since your GitHub Pages dashboard is static, it cannot handle Discord's webhook verification (which requires a `POST` response). To fix this, we've added a backend server to the bot itself.

Follow these steps to get your Webhooks verified:

## 1. Install Dependencies
Run this in your bot's folder:
```bash
npm install express
```

## 2. Start the Bot
Run your bot as usual:
```bash
node src/index.js
```
You should see: `[SERVER] Web server listening at http://localhost:3000`

## 3. Expose the Server (ngrok)
Discord cannot talk to `localhost`. You need a public URL.

1.  **Download ngrok**: [ngrok.com](https://ngrok.com/download)
2.  **Run ngrok**: Open a terminal and run:
    ```bash
    ngrok http 3000
    ```
3.  **Copy the Forwarding URL**: It will look like `https://a1b2-c3d4.ngrok.io`.

## 4. Discord Developer Portal
1.  Go to your **Discord App Settings** > **General Information**.
2.  Find **Interactions Endpoint URL** (or your Webhook URL field).
3.  Combine your ngrok URL with `/webhook`:
    - Example: `https://a1b2-c3d4.ngrok.io/webhook`
4.  Click **Save Changes**. Discord will now send a test request to your bot, which will reply with `200 OK` and verify successfully!

---
> [!TIP]
> **Production Tip**: For 24/7 uptime, consider hosting the bot on a VPS (like Oracle Cloud, AWS, or DigitalOcean) instead of your local machine.
