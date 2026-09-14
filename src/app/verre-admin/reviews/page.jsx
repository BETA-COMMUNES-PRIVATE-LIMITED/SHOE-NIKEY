'use client';

import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';

const statusColors = {
  approved: { bg: 'rgba(34,197,94,0.12)', text: '#22c55e' },
  pending: { bg: 'rgba(251,191,36,0.12)', text: '#fbbf24' },
  rejected: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' },
};

function Stars({ rating }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="text-[11px]" style={{ color: i <= rating ? '#FFD700' : 'var(--border-color)' }}>★</span>
      ))}
    </span>
  );
}

export default function AdminReviewsPage() {
  const { reviews, updateReview, deleteReview } = useAdmin();
  const [filter, setFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = filter === 'all' ? reviews : reviews.filter((r) => r.status === filter);
  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>Reviews</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {reviews.length} total · Avg {avgRating} ★ · {pendingCount} pending approval
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {['all', 'pending', 'approved', 'rejected'].map((s) => {
          const count = s === 'all' ? reviews.length : reviews.filter((r) => r.status === s).length;
          return (
            <button key={s} onClick={() => setFilter(s)}
              className="px-4 py-2 rounded-full text-[11px] font-bold whitespace-nowrap capitalize transition-all"
              style={{
                backgroundColor: filter === s ? 'var(--accent-lime)' : 'var(--bg-surface)',
                color: filter === s ? '#000' : 'var(--text-muted)',
                border: '1px solid var(--border-color)',
              }}
            >{s} ({count})</button>
          );
        })}
      </div>

      {/* Reviews List */}
      <div className="flex flex-col gap-3">
        {filtered.map((review) => {
          const sc = statusColors[review.status] || statusColors.pending;
          return (
            <div key={review.id} className="rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
                    {review.customer.charAt(0)}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{review.customer}</p>
                      <Stars rating={review.rating} />
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md capitalize" style={{ backgroundColor: sc.bg, color: sc.text }}>{review.status}</span>
                    </div>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {review.product} · {review.date}
                    </p>
                    <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{review.text}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {review.status !== 'approved' && (
                    <button onClick={() => updateReview(review.id, { status: 'approved' })}
                      className="text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all hover:bg-green-500/10"
                      style={{ color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}
                    >
                      Approve
                    </button>
                  )}
                  {review.status !== 'rejected' && (
                    <button onClick={() => updateReview(review.id, { status: 'rejected' })}
                      className="text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all hover:bg-yellow-500/10"
                      style={{ color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}
                    >
                      Reject
                    </button>
                  )}
                  <button onClick={() => setConfirmDelete(review)}
                    className="text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all hover:bg-red-500/10"
                    style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>No reviews found</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Try a different filter.</p>
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setConfirmDelete(null)}>
          <div className="w-full max-w-sm rounded-2xl p-6 animate-dropdown" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>Delete Review?</h3>
            <p className="text-xs text-center mb-6" style={{ color: 'var(--text-muted)' }}>
              Review by {confirmDelete.customer} will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 h-10 rounded-full text-xs font-semibold" style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>Cancel</button>
              <button onClick={() => { deleteReview(confirmDelete.id); setConfirmDelete(null); }} className="flex-1 h-10 rounded-full text-xs font-bold" style={{ backgroundColor: '#ef4444', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
