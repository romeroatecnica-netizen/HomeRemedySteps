import React, {useState} from 'react';
import {AlertTriangle, ChevronDown, ExternalLink, ShieldCheck} from 'lucide-react';
import {UiDictionary} from '../data/i18n';

interface EditorialSafetySectionProps {
  ui: UiDictionary;
}

export const EditorialSafetySection: React.FC<EditorialSafetySectionProps> = ({ui}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="no-print mx-auto w-full max-w-6xl space-y-10 px-4 pb-12 sm:px-6">
      {/* Contextual Affiliate Essentials Block */}
      <section
        aria-labelledby="gear-heading"
        className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8"
      >
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="gear-heading"
              className="font-display text-xl font-semibold text-slate-900 headline-balance"
            >
              {ui.gearHeading}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">{ui.gearSubheading}</p>
          </div>
          <p className="text-xs text-slate-500">{ui.gearDisclosure}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ui.gearItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="group flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 transition-colors duration-150 hover:border-emerald-700/40 hover:bg-emerald-50/30"
            >
              <div>
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-800">
                  {item.name}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  {item.useCase}
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 whitespace-nowrap">
                {item.cta}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Editorial SEO Safety & Compatibility Guide */}
      <section
        id="safety-guide"
        aria-labelledby="editorial-safety-heading"
        className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8"
      >
        <div className="border-b border-slate-200 pb-5">
          <h2
            id="editorial-safety-heading"
            className="font-display text-2xl font-semibold text-slate-900 headline-balance"
          >
            {ui.editorialTitle}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
            {ui.editorialSubtitle}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Column 1: Everyday Wellness Criteria */}
          <article className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-5">
            <div className="mb-3 flex items-center gap-2 text-emerald-800">
              <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-slate-900">{ui.safetyCriteriaTitle}</h3>
            </div>
            <ul className="space-y-2.5 text-sm leading-relaxed text-slate-700">
              {ui.safetyCriteria.map((rule, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="tabular-nums text-xs font-semibold text-emerald-700 mt-1">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* Column 2: Household Compatibility Golden Rules */}
          <article className="rounded-xl border border-amber-200 bg-amber-50/40 p-5">
            <div className="mb-3 flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-slate-900">{ui.compatibilityTitle}</h3>
            </div>
            <ul className="space-y-2.5 text-sm leading-relaxed text-slate-700">
              {ui.compatibilityRules.map((rule, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="tabular-nums text-xs font-semibold text-amber-700 mt-1">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* Column 3: Red-Flag Signs */}
          <article className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-5">
            <div className="mb-3 flex items-center gap-2 text-[#B45309]">
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-slate-900">{ui.redFlagsTitle}</h3>
            </div>
            <ul className="space-y-2.5 text-sm leading-relaxed text-slate-700">
              {ui.redFlags.map((flag, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="tabular-nums text-xs font-semibold text-[#B45309] mt-1">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        {/* Interactive Expandable FAQ */}
        <div className="mt-8 border-t border-slate-200 pt-6">
          <h3 className="font-display text-lg font-semibold text-slate-900">{ui.faqTitle}</h3>
          <div className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-[#F8FAFC]">
            {ui.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="px-5 py-4">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 text-start text-sm font-semibold text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-150 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-slate-600">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Transparent Informational Disclaimer */}
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/60 px-5 py-4 text-xs leading-relaxed text-amber-900">
          {ui.disclaimer}
        </div>
      </section>
    </div>
  );
};
