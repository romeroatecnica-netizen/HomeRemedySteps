import {CategoryId, IngredientId, RemedyModule} from '../types/remedy';

export const AMAZON_AFFILIATE_TAG = 'bastelar-21';
export const AMAZON_ES_ORIGIN = 'https://www.amazon.es';

export const AMAZON_AFFILIATE_LINK_PROPS = {
  target: '_blank' as const,
  rel: 'sponsored nofollow noopener' as const,
};

/**
 * Forces any Amazon URL (or search fallback) onto https://www.amazon.es
 * and guarantees the affiliate parameter tag=bastelar-21 is always present.
 */
export function enforceAmazonEsAffiliateUrl(rawUrl: string): string {
  try {
    const trimmed = rawUrl.trim();
    const parsed = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? new URL(trimmed)
      : new URL(trimmed.startsWith('/') ? trimmed : `/s?k=${encodeURIComponent(trimmed)}`, AMAZON_ES_ORIGIN);

    parsed.protocol = 'https:';
    parsed.hostname = 'www.amazon.es';
    parsed.port = '';
    parsed.searchParams.set('tag', AMAZON_AFFILIATE_TAG);

    return parsed.toString();
  } catch {
    const fallback = new URL('/s', AMAZON_ES_ORIGIN);
    fallback.searchParams.set('tag', AMAZON_AFFILIATE_TAG);
    return fallback.toString();
  }
}

/**
 * Builds a canonical Amazon España search URL using amazon.es-compatible
 * search keywords and enforces AMAZON_AFFILIATE_TAG.
 */
export function buildAmazonEsSearchUrl(searchQuery: string): string {
  const url = new URL('/s', AMAZON_ES_ORIGIN);
  url.searchParams.set('k', searchQuery.trim());
  url.searchParams.set('tag', AMAZON_AFFILIATE_TAG);
  return enforceAmazonEsAffiliateUrl(url.toString());
}

export type AffiliateProductId =
  | 'amberBottles'
  | 'teaInfuser'
  | 'aloeGel'
  | 'citricAcid'
  | 'microfiber';

export interface AffiliateProductSpec {
  id: AffiliateProductId;
  searchQuery: string;
  href: string;
  imageSrc: string;
  relatedIngredients: IngredientId[];
  relatedCategories: CategoryId[];
}

export const AFFILIATE_PRODUCT_CATALOG: Record<AffiliateProductId, AffiliateProductSpec> = {
  amberBottles: {
    id: 'amberBottles',
    searchQuery: 'botellas spray vidrio ambar 500 ml',
    href: buildAmazonEsSearchUrl('botellas spray vidrio ambar 500 ml'),
    imageSrc: '/src/assets/images/amber_spray_bottles_1795859041730.jpg',
    relatedIngredients: ['white_vinegar', 'lemon'],
    relatedCategories: ['pest_freshening', 'stains_laundry', 'kitchen_limescale'],
  },
  teaInfuser: {
    id: 'teaInfuser',
    searchQuery: 'infusor te acero inoxidable malla fina',
    href: buildAmazonEsSearchUrl('infusor te acero inoxidable malla fina'),
    imageSrc: '/src/assets/images/stainless_tea_infuser_1795859043446.jpg',
    relatedIngredients: ['ginger', 'chamomile', 'honey', 'lemon'],
    relatedCategories: ['throat_breathing', 'digestion_sleep'],
  },
  aloeGel: {
    id: 'aloeGel',
    searchQuery: 'gel aloe vera puro sin perfume',
    href: buildAmazonEsSearchUrl('gel aloe vera puro sin perfume'),
    imageSrc: '/src/assets/images/pure_aloe_gel_1795859043216.jpg',
    relatedIngredients: ['aloe_vera', 'oats', 'ice_water'],
    relatedCategories: ['skin_bites'],
  },
  citricAcid: {
    id: 'citricAcid',
    searchQuery: 'acido citrico bicarbonato limpieza hogar',
    href: buildAmazonEsSearchUrl('acido citrico bicarbonato limpieza hogar'),
    imageSrc: '/src/assets/images/citric_baking_soda_1795859044271.jpg',
    relatedIngredients: ['citric_acid', 'baking_soda', 'salt'],
    relatedCategories: ['kitchen_limescale', 'stains_laundry'],
  },
  microfiber: {
    id: 'microfiber',
    searchQuery: 'bayetas microfibra sin pelusa cristales',
    href: buildAmazonEsSearchUrl('bayetas microfibra sin pelusa cristales'),
    imageSrc: '/src/assets/images/microfiber_cloths_1795859043835.jpg',
    relatedIngredients: ['white_vinegar', 'baking_soda', 'ice_water'],
    relatedCategories: ['stains_laundry', 'kitchen_limescale', 'skin_bites'],
  },
};

const PRODUCT_PRIORITY_ORDER: AffiliateProductId[] = [
  'teaInfuser',
  'amberBottles',
  'citricAcid',
  'aloeGel',
  'microfiber',
];

/**
 * Selects the most relevant Amazon.es products for a given remedy module
 * based on ingredients and category, ensuring deterministic contextual matches.
 */
export function getContextualAffiliateProductIds(
  remedy: RemedyModule,
  limit = 2,
): AffiliateProductId[] {
  const scored = PRODUCT_PRIORITY_ORDER.map((id, idx) => {
    const spec = AFFILIATE_PRODUCT_CATALOG[id];
    let score = 0;

    for (const ing of remedy.ingredients) {
      if (spec.relatedIngredients.includes(ing)) {
        score += 3;
      }
    }
    if (spec.relatedCategories.includes(remedy.category)) {
      score += 2;
    }
    // Scope alignment bias
    if (remedy.scope === 'wellness' && (id === 'teaInfuser' || id === 'aloeGel')) {
      score += 1;
    }
    if (
      remedy.scope === 'household' &&
      (id === 'amberBottles' || id === 'citricAcid' || id === 'microfiber')
    ) {
      score += 1;
    }

    return {id, score, idx};
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.idx - b.idx;
  });

  return scored.slice(0, limit).map((item) => item.id);
}
