import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, Loader2, LockKeyhole } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { inquirySchema } from '@/lib/inquiry-schema';

const audiences = ['Enterprise', 'Startup Founder', 'Investor'] as const;
const settings = {
  Enterprise: {
    scopes: ['AI system development', 'Computer vision & edge AI', 'Enterprise RAG & integration', 'Architecture advisory'],
    budgets: ['Under $10k', '$10k–$25k', '$25k–$50k', '$50k+', 'To be discussed'],
    label: 'Project budget',
  },
  'Startup Founder': {
    scopes: ['MVP to production', 'AI product architecture', 'Technical co-building', 'Founder advisory'],
    budgets: ['Under $5k', '$5k–$15k', '$15k–$30k', '$30k+', 'To be discussed'],
    label: 'Build budget',
  },
  Investor: {
    scopes: ['Venture conversation', 'Strategic partnership', 'Technical due diligence', 'Accelerator opportunity'],
    budgets: ['Pre-seed', 'Seed', 'Series A+', 'Strategic partnership', 'Exploratory'],
    label: 'Investment stage',
  },
};

// Form submission endpoint — Formspree (mohamediqsan23@gmail.com)
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xbgdywzb';

export function InquirySection() {
  const [audience, setAudience] = useState<(typeof audiences)[number]>('Enterprise');
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const config = settings[audience];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = event.currentTarget;
    const formData = new FormData(form);
    const rawData = { ...Object.fromEntries(formData), audience };
    const result = inquirySchema.safeParse(rawData);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Please check your details.');
      return;
    }

    // Honeypot check
    if (result.data.website) return;

    setPending(true);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...result.data,
          _subject: `[IQSAN Portfolio] ${result.data.audience} inquiry from ${result.data.name}`,
          _replyto: result.data.email,
        }),
      });

      if (response.ok) {
        toast.success("Inquiry received! I'll be in touch within 48 hours.");
        setSuccess(true);
        form.reset();
      } else {
        const body = await response.json().catch(() => ({}));
        if (body.errors && Array.isArray(body.errors) && body.errors.length > 0) {
          const errMsg =
            body.errors
              .map((e: { field?: string; message?: string }) => `${e.field ? e.field + ': ' : ''}${e.message}`)
              .join(', ') || 'Submission could not be completed.';
          setError(errMsg);
          toast.error(errMsg);
        } else {
          const errMsg = 'Submission failed. Please try again or email mohamediqsan23@gmail.com directly.';
          setError(errMsg);
          toast.error(errMsg);
        }
      }
    } catch {
      // If network fails (e.g. offline), offer mailto fallback
      try {
        openMailtoFallback(result.data);
        toast.info('Opening email client to send your inquiry...');
        setSuccess(true);
        form.reset();
      } catch {
        const errMsg = 'Network error. Please email mohamediqsan23@gmail.com directly.';
        setError(errMsg);
        toast.error(errMsg);
      }
    } finally {
      setPending(false);
    }
  }

  function openMailtoFallback(data: {
    name: string;
    email: string;
    organization: string;
    audience: string;
    scope: string;
    budget: string;
    message: string;
  }) {
    const subject = encodeURIComponent(`[IQSAN Portfolio] ${data.audience} inquiry from ${data.name}`);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nOrganization: ${data.organization}\nAudience: ${data.audience}\nScope: ${data.scope}\nBudget/Stage: ${data.budget}\n\nMessage:\n${data.message}`,
    );
    window.location.href = `mailto:mohamediqsan23@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <section id="inquiry" className="section-band inquiry-band">
      <div className="page-width grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="eyebrow">
            <span className="status-dot" /> OPEN A CONVERSATION
          </p>
          <h2 className="section-title mt-5">
            Complex challenge?
            <br />
            <span className="text-muted-foreground">Let's build what's next.</span>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">
            Whether you're putting AI into production, building a venture, or exploring a strategic investment — let's find the right starting point.
          </p>
          <div className="mt-9 space-y-4 text-sm">
            <p className="flex items-center gap-3">
              <Check className="size-4 text-primary" /> Engineering-first conversations
            </p>
            <p className="flex items-center gap-3">
              <Check className="size-4 text-primary" /> Enterprise, founder & investor inquiries
            </p>
            <p className="flex items-center gap-3">
              <LockKeyhole className="size-4 text-primary" /> Direct contact:{' '}
              <a
                href="mailto:mohamediqsan23@gmail.com"
                className="text-primary hover:underline"
              >
                mohamediqsan23@gmail.com
              </a>
            </p>
          </div>
        </div>

        <div>
          <div className="mb-7 grid grid-cols-3 border-b border-border" role="tablist" aria-label="Inquiry role">
            {audiences.map((item) => (
              <Button
                role="tab"
                aria-selected={audience === item}
                variant="ghost"
                className={`audience-tab ${audience === item ? 'active' : ''}`}
                key={item}
                onClick={() => {
                  setAudience(item);
                  setError('');
                  setSuccess(false);
                }}
              >
                {item}
              </Button>
            ))}
          </div>

          {success ? (
            <div className="flex min-h-96 flex-col items-start justify-center" role="status">
              <Check className="mb-5 size-10 text-primary" />
              <h3 className="text-2xl">Inquiry received.</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Thank you. I'll be in touch within 48 hours.
              </p>
              <Button variant="outline" className="mt-7" onClick={() => setSuccess(false)}>
                Send another inquiry <ArrowUpRight />
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" aria-label={`${audience} inquiry`}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="field-label">
                  Your name
                  <Input name="name" placeholder="Full name" required minLength={2} maxLength={100} autoComplete="name" />
                </label>
                <label className="field-label">
                  {audience === 'Investor' ? 'Fund / organization' : 'Organization'}
                  <Input name="organization" placeholder="Organization name" required minLength={2} maxLength={150} autoComplete="organization" />
                </label>
              </div>

              <label className="field-label">
                Work email
                <Input type="email" name="email" placeholder="you@company.com" required maxLength={255} autoComplete="email" />
              </label>

              <div className="grid gap-5 sm:grid-cols-2" key={audience}>
                <label className="field-label">
                  Conversation scope
                  <select name="scope" required defaultValue="">
                    <option disabled value="">Select a focus</option>
                    {config.scopes.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <label className="field-label">
                  {config.label}
                  <select name="budget" required defaultValue="">
                    <option disabled value="">Select a range</option>
                    {config.budgets.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="field-label">
                What are you working on?
                <Textarea
                  name="message"
                  placeholder="Tell me about the opportunity, your constraints, and what success looks like."
                  required
                  minLength={20}
                  maxLength={5000}
                  className="min-h-32 resize-y"
                />
              </label>

              {/* Honeypot */}
              <label className="hidden" aria-hidden="true">
                Website
                <Input name="website" tabIndex={-1} autoComplete="off" />
              </label>

              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-muted-foreground">A meaningful conversation starts here.</span>
                <Button disabled={pending} type="submit" className="h-11 px-6">
                  {pending ? (
                    <>
                      <Loader2 className="animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      Send inquiry <ArrowUpRight />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}