export type LangCode =
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'pt'
  | 'ar'
  | 'hi'
  | 'ru'
  | 'zh'
  | 'ja';

export type CategoryId =
  | 'throat_breathing'
  | 'skin_bites'
  | 'digestion_sleep'
  | 'stains_laundry'
  | 'kitchen_limescale'
  | 'pest_freshening';

export type ScopeType = 'wellness' | 'household';

export type IngredientId =
  | 'honey'
  | 'lemon'
  | 'ginger'
  | 'salt'
  | 'chamomile'
  | 'aloe_vera'
  | 'oats'
  | 'baking_soda'
  | 'white_vinegar'
  | 'citric_acid'
  | 'ice_water';

export type IllustrationTemplate =
  | 'gargle_cup'
  | 'infusion_mug'
  | 'steam_bowl'
  | 'cold_compress'
  | 'topical_paste'
  | 'foot_soak'
  | 'fabric_blot'
  | 'pan_simmer'
  | 'kettle_descale'
  | 'jar_trap_barrier';

export interface LocalizedTextPair {
  en: string;
  es: string;
}

export interface RemedyDiagramSpec {
  template: IllustrationTemplate;
  primaryColor: string;
  secondaryColor: string;
  ratioLabel: LocalizedTextPair;
  tempLabel: LocalizedTextPair;
  durationLabel: LocalizedTextPair;
  actionLabel: LocalizedTextPair;
}

export interface RemedyModule {
  id: string;
  number: number;
  slug: string;
  category: CategoryId;
  scope: ScopeType;
  prepMinutes: number;
  ingredients: IngredientId[];
  titles: Record<LangCode, string>;
  summaries: Record<LangCode, string>;
  ingredientAmounts: {
    en: string[];
    es: string[];
  };
  steps: {
    en: string[];
    es: string[];
  };
  caution: LocalizedTextPair;
  diagram: RemedyDiagramSpec;
}

export interface UserRemedyNote {
  favorite?: boolean;
  tried?: boolean;
  checkedSteps?: number[];
  note?: string;
  updatedAt?: string;
}

export type UserRemedyStateMap = Record<string, UserRemedyNote>;

export interface FaqItem {
  question: string;
  answer: string;
}
