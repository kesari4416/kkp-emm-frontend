import { useEffect, useState } from "react";
import { api, formatApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

function Stars({ value, onSelect, size = 16, interactive = false, testidPrefix }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" role={interactive ? "radiogroup" : undefined}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onMouseEnter={() => interactive && setHover(n)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onSelect?.(n)}
          data-testid={interactive ? `${testidPrefix}-star-${n}` : undefined}
          className={interactive ? "cursor-pointer" : "cursor-default"}
          aria-label={`${n} star`}
        >
          <Star
            size={size}
            fill={(hover || value) >= n ? "currentColor" : "none"}
            className={(hover || value) >= n ? "text-[var(--accent)]" : "text-[var(--text-mute)]"}
          />
        </button>
      ))}
    </div>
  );
}

export default function Reviews({ productId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = () => api.get(`/products/${productId}/reviews`).then(({ data }) => setReviews(data));

  useEffect(() => {
    refresh();
  }, [productId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    setBusy(true);
    try {
      await api.post(`/products/${productId}/reviews`, { rating, title, body });
      toast.success("Review posted");
      setTitle("");
      setBody("");
      setRating(5);
      await refresh();
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setBusy(false);
    }
  };

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const myReview = user && reviews.find((r) => r.user_id === user.user_id);

  return (
    <section data-testid="reviews-section" className="border-t hairline pt-10 mt-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="eyebrow text-[var(--text-mute)]">Voices</div>
          <h2 className="font-display font-black text-3xl mt-1">Customer Reviews</h2>
        </div>
        {avg && (
          <div className="flex items-center gap-2">
            <Stars value={Math.round(avg)} />
            <span className="font-mono text-sm">{avg} · {reviews.length} review{reviews.length === 1 ? "" : "s"}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        <div>
          {reviews.length === 0 ? (
            <div className="border hairline-dark p-8 text-sm text-[var(--text-mute)]">
              No reviews yet. Be the first to review this piece.
            </div>
          ) : (
            <div className="divide-y hairline">
              {reviews.map((r) => (
                <article key={r.review_id || r.created_at} data-testid={`review-${r.review_id}`} className="py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-black text-white flex items-center justify-center font-display font-bold text-sm">
                        {r.user_name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{r.user_name}</div>
                        <div className="text-xs text-[var(--text-mute)]">{new Date(r.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <Stars value={r.rating} />
                  </div>
                  {r.title && <div className="mt-3 font-display font-bold">{r.title}</div>}
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-mute)] whitespace-pre-wrap">{r.body}</p>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="bg-white border hairline-dark p-6 h-fit">
          {!user ? (
            <div className="text-center">
              <div className="eyebrow mb-3">Share your thoughts</div>
              <p className="text-sm text-[var(--text-mute)]">
                <Link to="/login" className="underline text-[var(--accent)]">Log in</Link> to write a review.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="eyebrow">{myReview ? "Update your review" : "Write a review"}</div>
              <div>
                <Label className="eyebrow text-[var(--text-mute)]">Rating</Label>
                <div className="mt-2"><Stars value={rating} onSelect={setRating} size={22} interactive testidPrefix="review-rating" /></div>
              </div>
              <div>
                <Label className="eyebrow text-[var(--text-mute)]">Title</Label>
                <Input data-testid="review-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Loved the fabric…" className="rounded-none mt-1" />
              </div>
              <div>
                <Label className="eyebrow text-[var(--text-mute)]">Your review</Label>
                <Textarea data-testid="review-body" required value={body} onChange={(e) => setBody(e.target.value)} placeholder="What did you like? Fit, fabric, color…" className="rounded-none mt-1" rows={5} />
              </div>
              <Button data-testid="review-submit" type="submit" disabled={busy} className="w-full rounded-none bg-black text-white hover:bg-[var(--accent)] py-5 eyebrow">
                {busy ? "Posting…" : myReview ? "Update review" : "Post review"}
              </Button>
            </form>
          )}
        </aside>
      </div>
    </section>
  );
}
