'use client';

import { useState } from 'react';
import PageLayout from '@/components/shared/PageLayout';
import { useAdmin } from '@/context/AdminContext';

/* Shared application form (used by Apply on a role + Send Resume) */
function ApplicationForm({ job, careersEmail, onDone }) {
  const { addApplication } = useAdmin();
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: job?.title || 'General Application', coverNote: '' });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const inputStyle = { backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) {
      setError('File too large — max 2MB.');
      return;
    }
    setError('');
    setFile(f);
  };

  const submit = () => {
    if (!form.name.trim() || !form.email.trim() || !file) {
      setError('Please fill your name, email and attach a resume file.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    const finish = () => {
      addApplication({
        ...form,
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
      });
      setSubmitted(true);
    };
    // Try to keep the actual file text alongside the application (best effort)
    const reader = new FileReader();
    reader.onload = () => finish();
    reader.onerror = () => finish();
    reader.readAsText(file);
  };

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'rgba(34,197,94,0.12)' }}>
          <svg className="w-7 h-7" fill="none" stroke="#22c55e" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>Application Sent! 🎉</h3>
        <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
          Thanks {form.name.split(' ')[0]} — our team will review your resume and get back to you.
        </p>
        <button onClick={onDone} className="h-10 px-6 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer" style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}>
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="text-[10px] font-bold mb-1 block" style={{ color: 'var(--text-muted)' }}>Full Name *</label>
        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name"
          className="w-full h-11 px-4 rounded-xl text-sm outline-none" style={inputStyle} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-bold mb-1 block" style={{ color: 'var(--text-muted)' }}>Email *</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com"
            className="w-full h-11 px-4 rounded-xl text-sm outline-none" style={inputStyle} />
        </div>
        <div>
          <label className="text-[10px] font-bold mb-1 block" style={{ color: 'var(--text-muted)' }}>Phone</label>
          <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(555) 000-0000"
            className="w-full h-11 px-4 rounded-xl text-sm outline-none" style={inputStyle} />
        </div>
      </div>
      <div>
        <label className="text-[10px] font-bold mb-1 block" style={{ color: 'var(--text-muted)' }}>Applying For</label>
        <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} readOnly={Boolean(job)}
          className="w-full h-11 px-4 rounded-xl text-sm outline-none" style={{ ...inputStyle, opacity: job ? 0.7 : 1 }} />
      </div>
      <div>
        <label className="text-[10px] font-bold mb-1 block" style={{ color: 'var(--text-muted)' }}>Resume / CV * (PDF or DOC, max 2MB)</label>
        <label
          className="flex items-center justify-center gap-2 h-14 rounded-xl text-xs font-semibold cursor-pointer transition-all border border-dashed"
          style={{ borderColor: 'var(--border-color)', color: file ? '#22c55e' : 'var(--text-muted)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
          {file ? `✓ ${file.name}` : 'Choose file / drop here'}
          <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFile} className="hidden" />
        </label>
      </div>
      <div>
        <label className="text-[10px] font-bold mb-1 block" style={{ color: 'var(--text-muted)' }}>Cover Note (optional)</label>
        <textarea value={form.coverNote} onChange={(e) => setForm({ ...form, coverNote: e.target.value })} rows={3} placeholder="Tell us briefly why you're a great fit..."
          className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={inputStyle} />
      </div>
      {error && <p className="text-[11px] font-semibold" style={{ color: '#ef4444' }}>{error}</p>}
      <div className="flex gap-2 mt-1">
        <button onClick={submit} className="flex-1 h-11 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer" style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}>
          Submit Application
        </button>
        <button onClick={onDone} className="h-11 px-4 rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer" style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
          Cancel
        </button>
      </div>
      <p className="text-[9px] text-center" style={{ color: 'var(--text-muted)' }}>
        Prefer email? Send it to <span style={{ color: 'var(--accent-lime)' }}>{careersEmail}</span>
      </p>
    </div>
  );
}

const valuesIcons = [
  <svg key="1" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--accent-lime)' }}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
  <svg key="2" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--accent-lime)' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  <svg key="3" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--accent-lime)' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
  <svg key="4" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--accent-lime)' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
];

const perkIcons = [
  <svg key="1" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
  <svg key="2" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  <svg key="3" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
  <svg key="4" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>,
  <svg key="5" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
  <svg key="6" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
];

export default function CareersPage() {
  const { pageContent, getPageData, jobOpenings, settings } = useAdmin();
  const content = pageContent?.careers;
  const data = getPageData('careers');
  const careersEmail = settings?.careersEmail || 'careers@verre.com';

  // Admin-managed roles — closed ones stay hidden from the public page
  const openRoles = (jobOpenings || []).filter((j) => j.open !== false);

  // Working department filter
  const departments = [...new Set(openRoles.map((j) => j.team))].map((name) => ({
    name,
    count: openRoles.filter((j) => j.team === name).length,
  }));
  const [activeDept, setActiveDept] = useState('All');
  const filteredRoles = activeDept === 'All' ? openRoles : openRoles.filter((j) => j.team === activeDept);

  // Apply modal
  const [applying, setApplying] = useState(null);

  return (
    <PageLayout title="Careers" breadcrumb="Careers">
      {/* Intro */}
      <div className="mb-12">
        <p className="text-sm leading-relaxed max-w-2xl whitespace-pre-line" style={{ color: 'var(--text-muted)' }}>
          {content?.intro || "Vére is redefining how people discover and buy footwear online. We're a small, high-impact team that moves fast, cares deeply about craft, and is building something that matters. If that excites you, we'd love to talk."}
        </p>
      </div>

      {/* Values — admin-managed */}
      <h2 className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: 'var(--text-primary)' }}>
        What We Stand For
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        {(data.values || []).map((v, i) => (
          <div key={i} className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="mb-3">{valuesIcons[i % valuesIcons.length]}</div>
            <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>{v.title}</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{v.desc}</p>
          </div>
        ))}
      </div>

      {/* Perks — admin-managed */}
      <h2 className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: 'var(--text-primary)' }}>
        Benefits & Perks
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
        {(data.perks || []).map((perk, i) => (
          <div key={i} className="flex gap-4 p-5 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex-shrink-0 mt-0.5">{perkIcons[i % perkIcons.length]}</div>
            <div>
              <h3 className="text-xs font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{perk.title}</h3>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{perk.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonials — admin-managed */}
      <h2 className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: 'var(--text-primary)' }}>
        From the Team
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-14">
        {(data.testimonials || []).map((t, i) => (
          <div key={i} className="p-6 rounded-2xl flex flex-col" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <svg className="w-5 h-5 mb-4 opacity-15" fill="var(--accent-lime)" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-xs leading-relaxed flex-1 mb-5" style={{ color: 'var(--text-muted)' }}>
              &quot;{t.quote}&quot;
            </p>
            <div className="pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
              <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{t.role} · {t.years}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Open Roles */}
      <div id="openings">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-primary)' }}>
            Open Roles
          </h2>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
            {openRoles.length} position{openRoles.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Department Filter — working */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveDept('All')}
            className="text-[11px] font-bold px-3 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer"
            style={{
              backgroundColor: activeDept === 'All' ? 'var(--accent-lime)' : 'var(--bg-surface)',
              color: activeDept === 'All' ? '#000' : 'var(--text-muted)',
              border: '1px solid var(--border-color)',
            }}
          >
            All ({openRoles.length})
          </button>
          {departments.map((d) => (
            <button
              key={d.name}
              onClick={() => setActiveDept(d.name)}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer"
              style={{
                backgroundColor: activeDept === d.name ? 'var(--accent-lime)' : 'var(--bg-surface)',
                color: activeDept === d.name ? '#000' : 'var(--text-muted)',
                border: '1px solid var(--border-color)',
              }}
            >
              {d.name} ({d.count})
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filteredRoles.length === 0 && (
            <div className="p-10 rounded-2xl text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <p className="text-xs font-bold mb-1" style={{ color: 'var(--text-primary)' }}>No open roles right now</p>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Check back soon — or send us your resume below.</p>
            </div>
          )}
          {filteredRoles.map((job) => (
            <div
              key={job.id}
              className="p-5 rounded-2xl transition-all hover:bg-white/[0.02]"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{job.title}</h3>
                  <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{job.desc}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md" style={{ backgroundColor: 'rgba(166, 255, 0, 0.08)', color: 'var(--accent-lime)', border: '1px solid rgba(166, 255, 0, 0.15)' }}>
                      {job.team}
                    </span>
                    <span className="text-[10px] px-2.5 py-1 rounded-md" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                      {job.type}
                    </span>
                    <span className="text-[10px] px-2.5 py-1 rounded-md" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                      {job.level}
                    </span>
                    <span className="text-[10px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                      {job.location}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setApplying(job)}
                  className="px-5 py-2.5 rounded-full text-[11px] font-bold flex-shrink-0 transition-all active:scale-95 cursor-pointer"
                  style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
                >
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-14 p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <div>
          <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Don&apos;t see your perfect role?</h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            We&apos;re always interested in meeting exceptional people. Send us your resume and we&apos;ll keep you in mind.
          </p>
        </div>
        <button
          onClick={() => setApplying({ title: 'General Application' })}
          className="px-6 py-3 rounded-full text-xs font-bold flex items-center gap-2 transition-all hover:scale-105 flex-shrink-0 cursor-pointer"
          style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
        >
          Send Resume
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Admin-managed sections */}
      {content?.sections?.length > 0 && (
        <div className="flex flex-col gap-6 mt-14">
          {content.sections.map((s, idx) => (
            <div key={idx} className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <h2 className="text-sm font-bold tracking-wider uppercase mb-3" style={{ color: 'var(--text-primary)' }}>{s.title}</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-muted)' }}>{s.body}</p>
            </div>
          ))}
        </div>
      )}

      {/* Apply / Send Resume modal — real form with resume upload */}
      {applying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setApplying(null)}>
          <div className="w-full max-w-md rounded-2xl p-6 animate-dropdown my-8" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{applying.title === 'General Application' ? 'Send Us Your Resume' : `Apply — ${applying.title}`}</h3>
              <button onClick={() => setApplying(null)} className="text-[11px] font-bold cursor-pointer transition-all hover:opacity-70" style={{ color: 'var(--text-muted)' }}>✕</button>
            </div>
            {applying.title !== 'General Application' && (
              <p className="text-[10px] mb-4" style={{ color: 'var(--text-muted)' }}>{applying.team} · {applying.type} · {applying.level} · {applying.location}</p>
            )}
            <ApplicationForm job={applying.title === 'General Application' ? null : applying} careersEmail={careersEmail} onDone={() => setApplying(null)} />
          </div>
        </div>
      )}
    </PageLayout>
  );
}
