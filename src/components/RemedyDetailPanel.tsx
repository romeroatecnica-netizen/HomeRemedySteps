import React, {useState} from 'react';
import {
  AlertTriangle,
  Bookmark,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Printer,
  RotateCcw,
} from 'lucide-react';
import {
  AMAZON_AFFILIATE_LINK_PROPS,
  enforceAmazonEsAffiliateUrl,
  getContextualAffiliateProductIds,
} from '../config/affiliate';
import {getCanonicalUrl} from '../config/seo';
import {UiDictionary} from '../data/i18n';
import {LangCode, RemedyModule, UserRemedyNote} from '../types/remedy';
import {ProductThumbnail} from './ProductThumbnail';
import {RemedyIllustrationCard} from './RemedyIllustrationCard';

interface RemedyDetailPanelProps {
  remedy: RemedyModule;
  lang: LangCode;
  ui: UiDictionary;
  userNote: UserRemedyNote;
  onToggleFavorite: (id: string) => void;
  onToggleTried: (id: string) => void;
  onToggleStep: (id: string, stepIndex: number) => void;
  onResetSteps: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
}

export const RemedyDetailPanel: React.FC<RemedyDetailPanelProps> = ({
  remedy,
  lang,
  ui,
  userNote,
  onToggleFavorite,
  onToggleTried,
  onToggleStep,
  onResetSteps,
  onUpdateNote,
}) => {
  const [copied, setCopied] = useState(false);

  const title = remedy.titles[lang] || remedy.titles.en;
  const summary = remedy.summaries[lang] || remedy.summaries.en;
  const ingredientLines =
    lang === 'es' ? remedy.ingredientAmounts.es : remedy.ingredientAmounts.en;
  const stepLines = lang === 'es' ? remedy.steps.es : remedy.steps.en;
  const cautionText = lang === 'es' ? remedy.caution.es : remedy.caution.en;
  const checkedSteps = userNote.checkedSteps ?? [];
  const contextualIds = getContextualAffiliateProductIds(remedy, 2);
  const contextualGear = contextualIds
    .map((id) => ui.gearItems.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const handleCopyCanonicalLink = async () => {
    const url = getCanonicalUrl(lang, remedy.slug);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article
      id={remedy.slug}
      aria-labelledby={`remedy-title-${remedy.id}`}
      className="print-only-card rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-7"
    >
      {/* Clean Zero-Pill Metadata Kicker */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="tabular-nums font-semibold text-emerald-700">
            {String(remedy.number).padStart(2, '0')}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-medium text-slate-700">
            {ui.categories[remedy.category]}
          </span>
          <span aria-hidden="true">·</span>
          <span>{ui.scopes[remedy.scope]}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums font-medium text-[#D97706]">
            {remedy.prepMinutes} {ui.prepTimeUnit}
          </span>
        </div>

        {/* Action Toolbar */}
        <div className="no-print flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleFavorite(remedy.id)}
            aria-pressed={Boolean(userNote.favorite)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
              userNote.favorite
                ? 'border-emerald-700 bg-emerald-700 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{userNote.favorite ? ui.savedFavorite : ui.saveFavorite}</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleTried(remedy.id)}
            aria-pressed={Boolean(userNote.tried)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
              userNote.tried
                ? 'border-[#0F766E] bg-[#0F766E] text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{userNote.tried ? ui.markedTried : ui.markTried}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyCanonicalLink}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 whitespace-nowrap shrink-0"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
            ) : (
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span>{copied ? ui.copied : ui.copyLink}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 whitespace-nowrap shrink-0"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{ui.printGuide}</span>
          </button>
        </div>
      </div>

      {/* Exact SEO Direct-Intent Title & Editorial Deck */}
      <div className="mt-5">
        <h2
          id={`remedy-title-${remedy.id}`}
          className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl headline-balance"
        >
          {title}
        </h2>
        <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {summary}
        </p>
      </div>

      {/* Static Botanical Diagram + Ingredients Split */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-7">
          <RemedyIllustrationCard
            remedy={remedy}
            lang={lang}
            visualGuideTitle={ui.visualGuideTitle}
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 sm:p-5 lg:col-span-5">
          <h3 className="font-display text-sm font-semibold text-slate-900">
            {ui.ingredientsNeeded}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {remedy.ingredients.map((ing) => ui.ingredients[ing]).join(' · ')}
          </p>
          <ul className="mt-3.5 space-y-2.5 text-sm text-slate-800">
            {ingredientLines.map((line, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D97706]"
                />
                <span className="tabular-nums leading-relaxed">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Ordered Interactive Steps */}
      <div className="mt-7">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-display text-base font-semibold text-slate-900">
            {ui.stepsTitle}
          </h3>
          {checkedSteps.length > 0 && (
            <button
              type="button"
              onClick={() => onResetSteps(remedy.id)}
              className="no-print inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              <span>{ui.resetChecks}</span>
            </button>
          )}
        </div>

        {ui.stepReferenceNote && (
          <p className="mt-1 text-xs text-slate-500">{ui.stepReferenceNote}</p>
        )}

        <ol className="mt-3.5 space-y-2.5">
          {stepLines.map((stepText, idx) => {
            const isChecked = checkedSteps.includes(idx);
            return (
              <li key={idx}>
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors duration-150 ${
                    isChecked
                      ? 'border-emerald-200 bg-emerald-50/40 text-slate-500'
                      : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleStep(remedy.id, idx)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700"
                  />
                  <span className="tabular-nums text-xs font-semibold text-emerald-700 mt-0.5">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <span
                    className={`text-sm leading-relaxed ${
                      isChecked ? 'line-through decoration-slate-400' : ''
                    }`}
                  >
                    {stepText}
                  </span>
                </label>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Contraindications & Safety Box (full hairline border, no thick border-l-4) */}
      <div className="mt-6 rounded-xl border border-amber-300 bg-[#FFFBEB] p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle
            className="mt-0.5 h-5 w-5 shrink-0 text-[#B45309]"
            aria-hidden="true"
          />
          <div>
            <h3 className="text-sm font-semibold text-[#B45309]">{ui.cautionTitle}</h3>
            <p className="mt-1 text-sm leading-relaxed text-amber-950">{cautionText}</p>
          </div>
        </div>
      </div>

      {/* Personal Notes (localStorage backed + printable) */}
      <div className="mt-6 border-t border-slate-200 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label
            htmlFor={`personal-note-${remedy.id}`}
            className="text-xs font-semibold text-slate-700"
          >
            {ui.personalNotesLabel}
          </label>
          <span className="no-print text-xs text-slate-400">{ui.notesSavedLocally}</span>
        </div>
        <textarea
          id={`personal-note-${remedy.id}`}
          rows={2}
          value={userNote.note ?? ''}
          onChange={(e) => onUpdateNote(remedy.id, e.target.value)}
          placeholder={ui.personalNotesPlaceholder}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-700 focus:bg-white focus:outline-none"
        />
      </div>

      {/* Contextual Amazon.es Product Thumbnails (hidden on print) */}
      {contextualGear.length > 0 && (
        <aside
          aria-label={ui.contextualGearTitle}
          className="no-print mt-6 border-t border-slate-200 pt-5"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-display text-sm font-semibold text-slate-900">
              {ui.contextualGearTitle}
            </h3>
            <span className="text-[11px] font-medium text-[#B45309]">Amazon.es</span>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {contextualGear.map((item) => {
              const safeHref = enforceAmazonEsAffiliateUrl(item.href);
              return (
                <a
                  key={item.id}
                  href={safeHref}
                  {...AMAZON_AFFILIATE_LINK_PROPS}
                  className="group flex items-center gap-3.5 rounded-xl border border-slate-200 bg-[#F8FAFC] p-2.5 transition-colors duration-150 hover:border-emerald-700/40 hover:bg-emerald-50/25"
                >
                  <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200/80 bg-white">
                    <ProductThumbnail
                      src={item.imageSrc}
                      alt={item.name}
                      className="h-full w-full transition-transform duration-200 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-xs font-semibold text-slate-900 group-hover:text-emerald-800">
                      {item.name}
                    </h4>
                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate-600">
                      {item.useCase}
                    </p>
                    <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <span>{item.cta}</span>
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

          <p className="mt-2.5 text-[11px] leading-relaxed text-slate-500">
            {ui.gearDisclosure}
          </p>
        </aside>
      )}
    </article>
  );
};
