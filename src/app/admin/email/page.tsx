'use client';

import { useState } from 'react';

export default function EmailSenderPage() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setPreviewUrl('');

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, text }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Email sent successfully!');
        if (data.previewUrl) {
          setPreviewUrl(data.previewUrl);
        }
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
          Send Notification Email
        </h1>
        <p className="text-[#555555] text-sm mt-1">Send manual updates, order files, or notifications to customers.</p>
      </div>

      <div className="max-w-xl mx-auto bg-[#F8FAFC] border border-[#E2E8F0] p-8 rounded-2xl">
        <h2 className="text-sm font-bold text-[#111111] mb-5 flex items-center gap-2">
          <i className="fa-solid fa-envelope text-[#7C6CFF]"></i>
          Compose Email Notification
        </h2>

        <form onSubmit={handleSend} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <i className="fa-solid fa-user text-[#888888]"></i> Recipient Email
            </label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-sm focus:outline-none transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <i className="fa-solid fa-heading text-[#888888]"></i> Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Your purchase update from Tassofly"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-sm focus:outline-none transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <i className="fa-solid fa-pen-to-square text-[#888888]"></i> Body Message
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message here..."
              rows={5}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-sm focus:outline-none transition-all duration-200"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7C6CFF] hover:bg-[#6B5BEE] text-white py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-paper-plane"></i>
            {loading ? 'Sending...' : 'Send Email'}
          </button>
        </form>
        {message && (
          <div className="mt-5 p-3.5 bg-slate-100 border border-slate-200 text-[#555555] rounded-xl text-center font-semibold text-xs">
            {message}
          </div>
        )}
        {previewUrl && (
          <div className="mt-3 text-center">
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7C6CFF] text-xs font-semibold hover:underline"
            >
              <i className="fa-solid fa-up-right-from-square mr-1"></i> View Sent Email Log Preview (Ethereal Sandbox)
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
