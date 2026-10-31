export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message } = req.body
  if (!message) {
    return res.status(400).json({ error: 'Message required' })
  }

  try {
    const pageId = process.env.FB_PAGE_ID
    const token = process.env.FB_PAGE_ACCESS_TOKEN
    const GRAPH_API_URL = `https://graph.facebook.com/v20.0/${pageId}/feed`

    const fbRes = await fetch(GRAPH_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        access_token: token
      })
    })

    const data = await fbRes.json()
    if (!fbRes.ok) {
      throw new Error(data.error?.message || 'FB post failed')
    }

    return res.status(200).json({ success: true, id: data.id })
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message })
  }
}