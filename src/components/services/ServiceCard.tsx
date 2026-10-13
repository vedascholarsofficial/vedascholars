'use client';

import { Plus, X } from 'lucide-react';

export default function ServiceCard({ title, description, group }: {
    title: string; description: string; group: string;
}) {
    return (
        <article className="h-full rounded-2xl border border-secondary/10 bg-white shadow-sm">
            <div className="hidden p-6 md:block">
                <h3 className="mb-3 text-lg leading-snug">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{description}</p>
            </div>
            <details name={group} className="group md:hidden">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary [&::-webkit-details-marker]:hidden">
                    <h3 className="text-base leading-snug">{title}</h3>
                    <Plus className="h-4 w-4 shrink-0 text-secondary group-open:hidden" aria-hidden="true" />
                    <X className="hidden h-4 w-4 shrink-0 text-secondary group-open:block" aria-hidden="true" />
                </summary>
                <div className="px-5 pb-4">
                    <p className="text-sm leading-relaxed text-slate-600">{description}</p>
                    <button
                        type="button"
                        aria-label={`Close ${title}`}
                        className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                        onClick={(event) => {
                            const details = event.currentTarget.closest('details');
                            if (details) {
                                details.open = false;
                                details.querySelector('summary')?.focus();
                            }
                        }}
                    >
                        <X size={14} aria-hidden="true" /> Close details
                    </button>
                </div>
            </details>
        </article>
    );
}
