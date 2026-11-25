import {FaqItem, LangCode, RemedyModule} from '../types/remedy';

export const CANONICAL_ORIGIN = 'https://homeremedysteps.bastelar.com';

export interface LanguageMeta {
  code: LangCode;
  nativeName: string;
  englishName: string;
  dir: 'ltr' | 'rtl';
  hreflang: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  {code: 'en', nativeName: 'English', englishName: 'English', dir: 'ltr', hreflang: 'en'},
  {code: 'es', nativeName: 'Español', englishName: 'Spanish', dir: 'ltr', hreflang: 'es'},
  {code: 'fr', nativeName: 'Français', englishName: 'French', dir: 'ltr', hreflang: 'fr'},
  {code: 'de', nativeName: 'Deutsch', englishName: 'German', dir: 'ltr', hreflang: 'de'},
  {code: 'pt', nativeName: 'Português', englishName: 'Portuguese', dir: 'ltr', hreflang: 'pt'},
  {code: 'ar', nativeName: 'العربية', englishName: 'Arabic', dir: 'rtl', hreflang: 'ar'},
  {code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi', dir: 'ltr', hreflang: 'hi'},
  {code: 'ru', nativeName: 'Русский', englishName: 'Russian', dir: 'ltr', hreflang: 'ru'},
  {code: 'zh', nativeName: '中文', englishName: 'Chinese', dir: 'ltr', hreflang: 'zh'},
  {code: 'ja', nativeName: '日本語', englishName: 'Japanese', dir: 'ltr', hreflang: 'ja'},
];

export const VALID_LANG_CODES = new Set<LangCode>(
  SUPPORTED_LANGUAGES.map((l) => l.code),
);

export function isValidLang(value: string | null | undefined): value is LangCode {
  return Boolean(value && VALID_LANG_CODES.has(value as LangCode));
}

export function getLanguageMeta(lang: LangCode): LanguageMeta {
  return SUPPORTED_LANGUAGES.find((l) => l.code === lang) ?? SUPPORTED_LANGUAGES[0];
}

/**
 * Always returns canonical bastelar.com URLs.
 * Never uses window.location.origin or preview/pages.dev hosts.
 */
export function getCanonicalUrl(lang: LangCode, slug?: string): string {
  const base =
    lang === 'en'
      ? `${CANONICAL_ORIGIN}/`
      : `${CANONICAL_ORIGIN}/?lang=${lang}`;
  return slug ? `${base}#${slug}` : base;
}

export function detectInitialLanguage(): LangCode {
  if (typeof window === 'undefined') {
    return 'en';
  }
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get('lang')?.toLowerCase();
  if (isValidLang(urlLang)) {
    return urlLang;
  }

  try {
    const saved = window.localStorage.getItem('homeremedysteps_lang');
    if (isValidLang(saved)) {
      return saved;
    }
  } catch {
    // Ignore storage access errors
  }

  const navLang = (window.navigator.language || 'en').slice(0, 2).toLowerCase();
  if (isValidLang(navLang)) {
    return navLang;
  }

  return 'en';
}

export function syncHeadSeo(params: {
  lang: LangCode;
  pageTitle: string;
  pageDescription: string;
  activeRemedy: RemedyModule;
  faqs: FaqItem[];
}): void {
  if (typeof document === 'undefined') {
    return;
  }

  const {lang, pageTitle, pageDescription, activeRemedy, faqs} = params;
  const meta = getLanguageMeta(lang);

  document.documentElement.lang = lang;
  document.documentElement.dir = meta.dir;

  const remedyTitle = activeRemedy.titles[lang] || activeRemedy.titles.en;
  const composedTitle = `${remedyTitle} — HomeRemedySteps`;
  const composedDescription =
    activeRemedy.summaries[lang] || activeRemedy.summaries.en || pageDescription;

  document.title = composedTitle;

  const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
    let el = document.head.querySelector<HTMLMetaElement>(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('meta[name="description"]', 'name', 'description', composedDescription);
  setMeta('meta[property="og:title"]', 'property', 'og:title', composedTitle);
  setMeta('meta[property="og:description"]', 'property', 'og:description', composedDescription);
  setMeta('meta[property="og:url"]', 'property', 'og:url', getCanonicalUrl(lang));
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', composedTitle);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', composedDescription);

  const canonicalEl = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonicalEl) {
    canonicalEl.href = getCanonicalUrl(lang);
  }

  const existingAlternates = document.head.querySelectorAll('link[rel="alternate"][hreflang]');
  existingAlternates.forEach((node) => node.remove());

  const xDefaultLink = document.createElement('link');
  xDefaultLink.rel = 'alternate';
  xDefaultLink.hreflang = 'x-default';
  xDefaultLink.href = `${CANONICAL_ORIGIN}/`;
  document.head.appendChild(xDefaultLink);

  for (const item of SUPPORTED_LANGUAGES) {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = item.hreflang;
    link.href = getCanonicalUrl(item.code);
    document.head.appendChild(link);
  }

  const stepTexts = lang === 'es' ? activeRemedy.steps.es : activeRemedy.steps.en;
  const supplyTexts =
    lang === 'es'
      ? activeRemedy.ingredientAmounts.es
      : activeRemedy.ingredientAmounts.en;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'HomeRemedySteps',
        url: getCanonicalUrl(lang),
        inLanguage: lang,
        applicationCategory: 'HealthApplication',
        operatingSystem: 'All',
        description: pageTitle + ' — ' + pageDescription,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'HowTo',
        name: remedyTitle,
        description: composedDescription,
        url: getCanonicalUrl(lang, activeRemedy.slug),
        inLanguage: lang,
        totalTime: `PT${activeRemedy.prepMinutes}M`,
        supply: supplyTexts.map((name) => ({
          '@type': 'HowToSupply',
          name,
        })),
        step: stepTexts.map((text, idx) => ({
          '@type': 'HowToStep',
          position: idx + 1,
          name: `${idx + 1}. ${text.slice(0, 60)}`,
          text,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  let scriptEl = document.getElementById('hrs-jsonld') as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'hrs-jsonld';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }
  scriptEl.textContent = JSON.stringify(jsonLd);
}
