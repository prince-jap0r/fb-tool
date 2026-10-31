import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [message, setMessage] = useState('')
  const [publishAt, setPublishAt] = useState('')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchPosts() }, [])

  async function fetchPosts() {
    const { data } = await supabase
      .from('scheduled_posts')
      .select('*')
      .order('publish_at', { ascending: true })
    if (data) setPosts(data)
  }

  async function handlePostNow() {
    if (!message) return alert('Message likho')
    setLoading(true)
    const res = await fetch('/api/post-now', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    })
    const j = await res.json()
    setLoading(false)
    if (j.success) {
      setMessage('')
      fetchPosts()
      alert('Posted!')
    } else alert('Error: ' + j.error)
  }

  async function handleSchedule() {
    if (!message || !publishAt) return alert('Message and time dao')
    const { error } = await supabase.from('scheduled_posts').insert([
      {
        message,
        publish_at: new Date(publishAt).toISOString(),
        status: 'pending'
      }
    ])
    if (error) alert(error.message)
    else {
      setMessage('')
      setPublishAt('')
      fetchPosts()
      alert('Scheduled!')
    }
  }

  return (
    <div style={{
      background: '#0f0f12', color: 'white',
      minHeight: '100vh', padding: 16,
      fontFamily: 'system-ui'
    }}>
      <h1 style={{ fontSize: 24, fontWeight: 800 }}>FB Tool Dashboard</h1>

      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Post message..."
        style={{
          width: '100%', marginTop: 12, background: '#1c1c20',
          border: '1px solid #2a2a2e', borderRadius: 12,
          padding: 12, color: 'white', minHeight: 100
        }}
      />

      <input
        type="datetime-local"
        value={publishAt}
        onChange={e => setPublishAt(e.target.value)}
        style={{
          width: '100%', marginTop: 12, background: '#1c1c20',
          border: '1px solid #2a2a2e', borderRadius: 12,
          padding: 12, color: 'white'
        }}
      />

      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <button
          onClick={handlePostNow}
          disabled={loading}
          style={{
            flex: 1, background: 'white', color: 'black',
            padding: 12, borderRadius: 12, fontWeight: 700
          }}
        >Post Now</button>
        <button
          onClick={handleSchedule}
          style={{
            flex: 1, background: '#2a2a2e', color: 'white',
            padding: 12, borderRadius: 12, fontWeight: 700,
            border: '1px solid #3a3a3e'
          }}
        >Schedule</button>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Scheduled Posts</h2>
        {posts.map(p => (
          <div key={p.id} style={{
            background: '#1c1c20', padding: 12,
            borderRadius: 12, marginBottom: 8,
            border: '1px solid #2a2a2e'
          }}>
            <div style={{ fontSize: 12, opacity: 0.6 }}>
              {new Date(p.publish_at).toLocaleString()} - {p.status}
            </div>
            <div style={{ marginTop: 4 }}>{p.message}</div>
          </div>
        ))}
      </div>
    </div>
  )
}