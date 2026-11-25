import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Bookmark,
  CheckCircle2,
  Download,
  Search,
  SlidersHorizontal,
  Upload,
  X,
} from 'lucide-react';
import {EditorialSafetySection} from './components/EditorialSafetySection';
import {MediaNetAdSlot} from './components/MediaNetAdSlot';
import {RemedyDetailPanel} from './components/RemedyDetailPanel';
import {RemedyThumbnailSvg} from './components/RemedyIllustrationCard';
import {
  CANONICAL_ORIGIN,
  SUPPORTED_LANGUAGES,
  detectInitialLanguage,
  getCanonicalUrl,
  getLanguageMeta,
  syncHeadSeo,
} from './config/seo';
import {UI_DICTIONARY} from './data/i18n';
import {ALL_REMEDIES} from './data/remedies';
import {
  CategoryId,
  IngredientId,
  LangCode,
  RemedyModule,
  ScopeType,
  UserRemedyStateMap,
} from './types/remedy';

const STORAGE_KEY_STATE = 'homeremedysteps_user_state_v1';
const STORAGE_KEY_LANG = 'homeremedysteps_lang';

const CATEGORY_ORDER: CategoryId[] = [
  'throat_breathing',
  'skin_bites',
  'digestion_sleep',
  'stains_laundry',
  'kitchen_limescale',
  'pest_freshening',
];

const PANTRY_INGREDIENTS: IngredientId[] = [
  'honey',
  'lemon',
  'ginger',
  'salt',
  'chamomile',
  'aloe_vera',
  'oats',
  'baking_soda',
  'white_vinegar',
  'citric_acid',
  'ice_water',
];

function loadSavedUserState(): UserRemedyStateMap {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_STATE);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as UserRemedyStateMap) : {};
  } catch {
    return {};
  }
}

function getInitialRemedyId(): string {
  if (typeof window === 'undefined') {
    return ALL_REMEDIES[0].id;
  }
  const hash = window.location.hash.replace(/^#/, '');
  if (hash) {
    const matched = ALL_REMEDIES.find((r) => r.slug === hash || r.id === hash);
    if (matched) {
      return matched.id;
    }
  }
  return ALL_REMEDIES[0].id;
}

export default function App() {
  const [lang, setLang] = useState<LangCode>(() => detectInitialLanguage());
  const [searchQuery, setSearchQuery] = useState('');
  const [scopeFilter, setScopeFilter] = useState<'all' | ScopeType>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | CategoryId>('all');
  const [selectedIngredients, setSelectedIngredients] = useState<IngredientId[]>([]);
  const [exactMatchOnly, setExactMatchOnly] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [activeRemedyId, setActiveRemedyId] = useState<string>(() => getInitialRemedyId());
  const [userState, setUserState] = useState<UserRemedyStateMap>(() => loadSavedUserState());
  const [importFeedback, setImportFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);

  const ui = UI_DICTIONARY[lang];
  const langMeta = getLanguageMeta(lang);

  const activeRemedy = useMemo(
    () => ALL_REMEDIES.find((r) => r.id === activeRemedyId) ?? ALL_REMEDIES[0],
    [activeRemedyId],
  );

  // Persist user notes & favorites locally
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(userState));
    } catch {
      // Ignore storage quota errors
    }
  }, [userState]);

  // Persist language choice and sync SEO metadata (canonical + hreflang + JSON-LD)
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch {
      // Ignore storage access errors
    }

    syncHeadSeo({
      lang,
      pageTitle: ui.metaTitle,
      pageDescription: ui.metaDescription,
      activeRemedy,
      faqs: ui.faqs,
    });
  }, [lang, ui, activeRemedy]);

  const handleLanguageChange = (nextLang: LangCode) => {
    setLang(nextLang);
    if (typeof window !== 'undefined') {
      const nextSearch = nextLang === 'en' ? '' : `?lang=${nextLang}`;
      const nextHash = `#${activeRemedy.slug}`;
      window.history.replaceState(null, '', `${window.location.pathname}${nextSearch}${nextHash}`);
    }
  };

  const handleSelectRemedy = (remedy: RemedyModule) => {
    setActiveRemedyId(remedy.id);
    if (typeof window !== 'undefined') {
      const nextSearch = lang === 'en' ? '' : `?lang=${lang}`;
      window.history.replaceState(null, '', `${window.location.pathname}${nextSearch}#${remedy.slug}`);
      if (window.innerWidth < 1024 && detailRef.current) {
        detailRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    }
  };

  const toggleIngredient = (ing: IngredientId) => {
    setSelectedIngredients((prev) =>
      prev.includes(ing) ? prev.filter((item) => item !== ing) : [...prev, ing],
    );
  };

  const filteredRemedies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const list = ALL_REMEDIES.map((remedy) => {
      const missingCount =
        selectedIngredients.length === 0
          ? 0
          : remedy.ingredients.filter((ing) => !selectedIngredients.includes(ing)).length;
      const matchCount =
        selectedIngredients.length === 0
          ? 0
          : remedy.ingredients.filter((ing) => selectedIngredients.includes(ing)).length;

      return {remedy, missingCount, matchCount};
    }).filter(({remedy, missingCount, matchCount}) => {
      if (scopeFilter !== 'all' && remedy.scope !== scopeFilter) {
        return false;
      }
      if (categoryFilter !== 'all' && remedy.category !== categoryFilter) {
        return false;
      }
      if (favoritesOnly && !userState[remedy.id]?.favorite) {
        return false;
      }
      if (selectedIngredients.length > 0) {
        if (exactMatchOnly && missingCount > 0) {
          return false;
        }
        if (!exactMatchOnly && matchCount === 0) {
          return false;
        }
      }
      if (query) {
        const titleActive = (remedy.titles[lang] || '').toLowerCase();
        const titleEn = remedy.titles.en.toLowerCase();
        const titleEs = remedy.titles.es.toLowerCase();
        const summaryActive = (remedy.summaries[lang] || '').toLowerCase();
        const slugText = remedy.slug.replace(/-/g, ' ');
        const ingLabels = remedy.ingredients
          .map((ing) => ui.ingredients[ing].toLowerCase())
          .join(' ');
        const haystack = `${titleActive} ${titleEn} ${titleEs} ${summaryActive} ${slugText} ${ingLabels}`;
        if (!haystack.includes(query)) {
          return false;
        }
      }
      return true;
    });

    if (selectedIngredients.length > 0) {
      list.sort((a, b) => {
        if (a.missingCount !== b.missingCount) {
          return a.missingCount - b.missingCount;
        }
        if (b.matchCount !== a.matchCount) {
          return b.matchCount - a.matchCount;
        }
        return a.remedy.number - b.remedy.number;
      });
    }

    return list;
  }, [
    searchQuery,
    scopeFilter,
    categoryFilter,
    selectedIngredients,
    exactMatchOnly,
    favoritesOnly,
    userState,
    lang,
    ui.ingredients,
  ]);

  const toggleFavorite = (id: string) => {
    setUserState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        favorite: !prev[id]?.favorite,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  const toggleTried = (id: string) => {
    setUserState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        tried: !prev[id]?.tried,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  const toggleStep = (id: string, stepIndex: number) => {
    setUserState((prev) => {
      const current = prev[id]?.checkedSteps ?? [];
      const nextSteps = current.includes(stepIndex)
        ? current.filter((i) => i !== stepIndex)
        : [...current, stepIndex];
      return {
        ...prev,
        [id]: {
          ...prev[id],
          checkedSteps: nextSteps,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  };

  const resetSteps = (id: string) => {
    setUserState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        checkedSteps: [],
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  const updateNote = (id: string, note: string) => {
    setUserState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        note,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  const handleExportJson = () => {
    const payload = {
      app: 'HomeRemedySteps',
      canonicalOrigin: CANONICAL_ORIGIN,
      exportedAt: new Date().toISOString(),
      entries: userState,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `homeremedysteps-notes-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const entries =
          parsed && typeof parsed === 'object' && parsed.entries && typeof parsed.entries === 'object'
            ? (parsed.entries as UserRemedyStateMap)
            : (parsed as UserRemedyStateMap);

        if (!entries || typeof entries !== 'object' || Array.isArray(entries)) {
          throw new Error('Invalid structure');
        }

        const sanitized: UserRemedyStateMap = {};
        for (const [key, val] of Object.entries(entries)) {
          if (val && typeof val === 'object') {
            sanitized[key] = {
              favorite: Boolean(val.favorite),
              tried: Boolean(val.tried),
              checkedSteps: Array.isArray(val.checkedSteps)
                ? val.checkedSteps.filter((n) => typeof n === 'number')
                : [],
              note: typeof val.note === 'string' ? val.note : '',
              updatedAt: typeof val.updatedAt === 'string' ? val.updatedAt : undefined,
            };
          }
        }

        setUserState((prev) => ({...prev, ...sanitized}));
        setImportFeedback({type: 'success', message: ui.importSuccess});
      } catch {
        setImportFeedback({type: 'error', message: ui.importError});
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        window.setTimeout(() => setImportFeedback(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setScopeFilter('all');
    setCategoryFilter('all');
    setSelectedIngredients([]);
    setExactMatchOnly(false);
    setFavoritesOnly(false);
  };

  const savedCount = useMemo(
    () => Object.values(userState).filter((item) => item?.favorite).length,
    [userState],
  );

  return (
    <div dir={langMeta.dir} className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="no-print sticky top-0 z-30 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
          {/* Zone 1: Single-element brand wordmark */}
          <a
            href={getCanonicalUrl(lang)}
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({top: 0, behavior: 'smooth'});
            }}
            className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            HomeRemedySteps
          </a>

          {/* Zone 2: 4 concise single-line navigation links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <a
              href="#catalog"
              className="hover:text-emerald-700 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {ui.navCatalog}
            </a>
            <a
              href="#pantry-filter"
              className="hover:text-emerald-700 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {ui.navIngredients}
            </a>
            <a
              href="#safety-guide"
              className="hover:text-emerald-700 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {ui.navSafety}
            </a>
            <a
              href="#saved-notes"
              className="hover:text-emerald-700 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {ui.navSaved}
            </a>
          </nav>

          {/* Zone 3: Primary action — 10-language switcher */}
          <div className="flex items-center shrink-0">
            <label htmlFor="language-select" className="sr-only">
              Language
            </label>
            <select
              id="language-select"
              value={lang}
              onChange={(e) => handleLanguageChange(e.target.value as LangCode)}
              className="rounded-lg border border-slate-200 bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-slate-800 transition-colors hover:border-slate-300 focus:border-emerald-700 focus:outline-none whitespace-nowrap"
            >
              {SUPPORTED_LANGUAGES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.nativeName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main>
        {/* Editorial Hero & Instant Search */}
        <section className="no-print border-b border-[#E2E8F0] bg-white py-8 sm:py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-xs font-medium text-emerald-700">{ui.heroEyebrow}</p>
            <h1 className="mt-2 max-w-3xl font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl headline-balance">
              {ui.heroHeading}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              {ui.heroSubheading}
            </p>

            {/* Instant Search + Scope Filter Row */}
            <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative flex-1 max-w-xl">
                <Search
                  className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={ui.searchPlaceholder}
                  aria-label={ui.searchPlaceholder}
                  className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] py-2.5 ps-10 pe-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:bg-white focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute end-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* Scope Segmented Control */}
              <div className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-[#F8FAFC] p-1">
                {(
                  [
                    {id: 'all', label: ui.scopeAll},
                    {id: 'wellness', label: ui.scopeWellness},
                    {id: 'household', label: ui.scopeHousehold},
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setScopeFilter(tab.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                      scopeFilter === tab.id
                        ? 'bg-emerald-700 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 6-Category Filter Bar */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                  categoryFilter === 'all'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {ui.allCategories}
              </button>
              {CATEGORY_ORDER.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                    categoryFilter === cat
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {ui.categories[cat]}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Pantry / Home Ingredient Filter + Local JSON Backup Strip */}
        <section
          id="pantry-filter"
          aria-labelledby="pantry-heading"
          className="no-print mx-auto mt-6 max-w-6xl px-4 sm:px-6"
        >
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 id="pantry-heading" className="font-display text-base font-semibold text-slate-900">
                  {ui.pantryTitle}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">{ui.pantrySubtitle}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setExactMatchOnly((v) => !v)}
                  aria-pressed={exactMatchOnly}
                  disabled={selectedIngredients.length === 0}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 disabled:opacity-45 ${
                    exactMatchOnly
                      ? 'border-emerald-700 bg-emerald-700 text-white'
                      : 'border-slate-200 bg-[#F8FAFC] text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{ui.exactMatchOnly}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFavoritesOnly((v) => !v)}
                  aria-pressed={favoritesOnly}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    favoritesOnly
                      ? 'border-emerald-700 bg-emerald-700 text-white'
                      : 'border-slate-200 bg-[#F8FAFC] text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {ui.favoritesOnly} ({savedCount})
                  </span>
                </button>

                {selectedIngredients.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedIngredients([])}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap shrink-0"
                  >
                    {ui.clearIngredients}
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {PANTRY_INGREDIENTS.map((ing) => {
                const active = selectedIngredients.includes(ing);
                return (
                  <button
                    key={ing}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleIngredient(ing)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                      active
                        ? 'border-[#D97706] bg-amber-50 text-amber-900'
                        : 'border-slate-200 bg-[#F8FAFC] text-slate-700 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    {ui.ingredients[ing]}
                  </button>
                );
              })}
            </div>

            {/* Saved JSON Backup Bar */}
            <div
              id="saved-notes"
              className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3.5 text-xs text-slate-500"
            >
              <span className="tabular-nums">
                {ui.showingCount}: <strong className="text-slate-900">{filteredRemedies.length}</strong> /{' '}
                {ALL_REMEDIES.length}
              </span>

              <div className="flex flex-wrap items-center gap-2">
                {importFeedback && (
                  <span
                    role="status"
                    className={`text-xs font-medium ${
                      importFeedback.type === 'success' ? 'text-emerald-700' : 'text-[#B45309]'
                    }`}
                  >
                    {importFeedback.message}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-white whitespace-nowrap shrink-0"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{ui.exportJson}</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-white whitespace-nowrap shrink-0"
                >
                  <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{ui.importJson}</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json,.json"
                  onChange={handleImportJson}
                  className="sr-only"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main 2-Column Catalog + Active Guide Workspace */}
        <section
          id="catalog"
          aria-label={ui.navCatalog}
          className="mx-auto mt-6 max-w-6xl px-4 sm:px-6"
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
            {/* Left Rail: Catalog List (Hidden in Print) */}
            <div className="no-print lg:col-span-5">
              {filteredRemedies.length === 0 ? (
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center">
                  <h2 className="font-display text-base font-semibold text-slate-900">
                    {ui.noResultsTitle}
                  </h2>
                  <p className="mt-1.5 text-sm text-slate-600">{ui.noResultsBody}</p>
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-medium text-white hover:bg-[#0F766E] transition-colors"
                  >
                    {ui.resetFilters}
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 lg:max-h-[960px] lg:overflow-y-auto lg:pe-1">
                  {filteredRemedies.map(({remedy, missingCount}) => {
                    const isSelected = remedy.id === activeRemedy.id;
                    const noteState = userState[remedy.id];
                    const title = remedy.titles[lang] || remedy.titles.en;

                    return (
                      <button
                        key={remedy.id}
                        type="button"
                        onClick={() => handleSelectRemedy(remedy)}
                        aria-current={isSelected ? 'true' : undefined}
                        className={`flex w-full items-start gap-3.5 rounded-xl border p-3.5 text-start transition-colors duration-150 ${
                          isSelected
                            ? 'border-emerald-700 bg-emerald-50/45'
                            : 'border-[#E2E8F0] bg-white hover:border-slate-300'
                        }`}
                      >
                        <RemedyThumbnailSvg
                          template={remedy.diagram.template}
                          primaryColor={remedy.diagram.primaryColor}
                          secondaryColor={remedy.diagram.secondaryColor}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                            <span className="tabular-nums font-semibold text-emerald-700">
                              {String(remedy.number).padStart(2, '0')}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="truncate">{ui.scopes[remedy.scope]}</span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums text-[#D97706]">
                              {remedy.prepMinutes} {ui.prepTimeUnit}
                            </span>
                          </div>

                          <h3 className="mt-1 text-sm font-semibold leading-snug text-slate-900">
                            {title}
                          </h3>

                          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            {selectedIngredients.length > 0 && (
                              <span
                                className={
                                  missingCount === 0
                                    ? 'font-medium text-emerald-700'
                                    : 'text-amber-700 tabular-nums'
                                }
                              >
                                {missingCount === 0
                                  ? ui.readyNow
                                  : `${missingCount} ${ui.missingCount}`}
                              </span>
                            )}
                            {noteState?.favorite && (
                              <span className="inline-flex items-center gap-1 text-emerald-700">
                                <Bookmark className="h-3 w-3" aria-hidden="true" />
                                {ui.savedFavorite}
                              </span>
                            )}
                            {noteState?.tried && (
                              <span className="inline-flex items-center gap-1 text-[#0F766E]">
                                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                                {ui.markedTried}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Stage: Active Detailed Guide & Static SVG Diagram */}
            <div ref={detailRef} className="lg:col-span-7">
              <RemedyDetailPanel
                remedy={activeRemedy}
                lang={lang}
                ui={ui}
                userNote={userState[activeRemedy.id] ?? {}}
                onToggleFavorite={toggleFavorite}
                onToggleTried={toggleTried}
                onToggleStep={toggleStep}
                onResetSteps={resetSteps}
                onUpdateNote={updateNote}
              />
            </div>
          </div>
        </section>

        {/* Dedicated Media.net Slot 1 (between viewer/catalog and editorial SEO section) */}
        <MediaNetAdSlot slotId="hrs-mid-catalog-slot" placement="mid-catalog" />

        {/* Contextual Affiliate Essentials + Safety Guide + Interactive FAQ + Disclaimer */}
        <EditorialSafetySection ui={ui} />

        {/* Dedicated Media.net Slot 2 (bottom of page) */}
        <MediaNetAdSlot slotId="hrs-bottom-editorial-slot" placement="bottom-editorial" />
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="no-print border-t border-[#E2E8F0] bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-sm font-semibold text-slate-900">
              HomeRemedySteps
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {ui.footerLinksLabel}:{' '}
              <a
                href={`${CANONICAL_ORIGIN}/`}
                className="text-emerald-700 hover:underline"
              >
                {CANONICAL_ORIGIN}
              </a>
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-slate-600">
            {SUPPORTED_LANGUAGES.map((item) => (
              <a
                key={item.code}
                href={getCanonicalUrl(item.code)}
                onClick={(e) => {
                  e.preventDefault();
                  handleLanguageChange(item.code);
                }}
                className={`hover:text-emerald-700 ${
                  item.code === lang ? 'font-semibold text-emerald-700 underline underline-offset-4' : ''
                }`}
              >
                {item.nativeName}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
