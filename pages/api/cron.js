import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  try {
    const now = new Date().toISOString()

    const { data: pending, error } = await supabase
      .from('scheduled_posts')
      .select('*')
      .eq('status', 'pending')
      .lte('publish_at', now)

    if (error) throw error

    let publishedCount = 0

    for (const post of pending || []) {
      const pageId = process.env.FB_PAGE_ID
      const token = process.env.FB_PAGE_ACCESS_TOKEN
      const GRAPH_API_URL = `https://graph.facebook.com/v20.0/${pageId}/feed`

      const fbRes = await fetch(GRAPH_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: post.message,
          access_token: token
        })
      })

      if (fbRes.ok) {
        await supabase
          .from('scheduled_posts')
          .update({ status: 'published' })
          .eq('id', post.id)
        publishedCount++
      }
    }

    return res.status(200).json({ success: true, published: publishedCount })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}