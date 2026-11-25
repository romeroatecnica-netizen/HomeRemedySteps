import React from 'react';
import {IllustrationTemplate, LangCode, RemedyModule} from '../types/remedy';

interface RemedyIllustrationCardProps {
  remedy: RemedyModule;
  lang: LangCode;
  visualGuideTitle: string;
}

function getDiagramLabel(pair: {en: string; es: string}, lang: LangCode): string {
  return lang === 'es' ? pair.es : pair.en;
}

function renderTemplateArtwork(
  template: IllustrationTemplate,
  primary: string,
  secondary: string,
  numberStr: string,
) {
  switch (template) {
    case 'gargle_cup':
      return (
        <g>
          {/* Soft botanical backdrop ring */}
          <circle cx="145" cy="112" r="76" fill="#ECFDF5" stroke="#D1FAE5" strokeWidth="1.5" />
          {/* Glass tumbler */}
          <path
            d="M112 58 L120 166 C120.5 171 124 174 129 174 L161 174 C166 174 169.5 171 170 166 L178 58 Z"
            fill="#FFFFFF"
            stroke="#334155"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Water level */}
          <path
            d="M116 96 C128 91 162 101 174 96 L169.5 165 C169 169 166 171 161 171 L129 171 C124 171 121 169 120.5 165 Z"
            fill="#CCFBF1"
            opacity="0.75"
          />
          <path
            d="M116 96 C128 91 162 101 174 96"
            fill="none"
            stroke={primary}
            strokeWidth="1.8"
          />
          {/* Spoon */}
          <line x1="162" y1="38" x2="142" y2="152" stroke="#64748B" strokeWidth="2.4" strokeLinecap="round" />
          <ellipse cx="141" cy="154" rx="7" ry="4" transform="rotate(10 141 154)" fill="#94A3B8" />
          {/* Dissolving salt crystals */}
          <rect x="132" y="128" width="4" height="4" rx="1" fill={secondary} opacity="0.85" />
          <rect x="148" y="138" width="4" height="4" rx="1" fill={secondary} opacity="0.7" />
          <rect x="139" y="146" width="3.5" height="3.5" rx="0.8" fill={primary} opacity="0.7" />
          <circle cx="155" cy="122" r="2.2" fill={primary} opacity="0.65" />
          {/* Measure ticks */}
          <line x1="184" y1="96" x2="194" y2="96" stroke="#64748B" strokeWidth="1.2" />
          <line x1="184" y1="132" x2="190" y2="132" stroke="#64748B" strokeWidth="1.2" />
          <line x1="184" y1="170" x2="194" y2="170" stroke="#64748B" strokeWidth="1.2" />
          <text x="198" y="100" fontSize="9.5" fill="#475569" fontFamily="Inter, sans-serif">
            240 ml
          </text>
        </g>
      );

    case 'infusion_mug':
      return (
        <g>
          <circle cx="145" cy="116" r="74" fill="#FEF3C7" opacity="0.45" />
          <circle cx="145" cy="116" r="74" fill="none" stroke="#FDE68A" strokeWidth="1.5" />
          {/* Calm static steam lines */}
          <path d="M126 74 C122 64 130 56 126 46" fill="none" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M144 70 C140 58 148 50 144 38" fill="none" stroke={primary} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M162 74 C158 64 166 56 162 46" fill="none" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
          {/* Ceramic mug */}
          <path
            d="M108 86 L180 86 L176 154 C175.5 162 169 168 161 168 L127 168 C119 168 112.5 162 112 154 Z"
            fill="#FFFFFF"
            stroke="#334155"
            strokeWidth="2"
          />
          {/* Mug handle */}
          <path
            d="M180 98 C198 98 198 136 178 136"
            fill="none"
            stroke="#334155"
            strokeWidth="2.2"
          />
          {/* Herbal tea tint */}
          <ellipse cx="144" cy="92" rx="31" ry="5.5" fill="#FDE68A" stroke={secondary} strokeWidth="1.2" />
          {/* Botanical leaf */}
          <path
            d="M132 134 C132 118 146 112 156 114 C154 128 144 138 132 134 Z"
            fill="#D1FAE5"
            stroke={primary}
            strokeWidth="1.6"
          />
          <line x1="132" y1="134" x2="152" y2="117" stroke={primary} strokeWidth="1.3" />
          {/* Saucer */}
          <path d="M96 170 Q144 178 192 170" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
        </g>
      );

    case 'steam_bowl':
      return (
        <g>
          <circle cx="148" cy="116" r="76" fill="#ECFEFF" stroke="#CFFAFE" strokeWidth="1.5" />
          {/* Bowl */}
          <path
            d="M84 124 L212 124 C208 156 184 172 148 172 C112 172 88 156 84 124 Z"
            fill="#FFFFFF"
            stroke="#334155"
            strokeWidth="2"
          />
          <ellipse cx="148" cy="124" rx="64" ry="10" fill="#E0F2FE" stroke={primary} strokeWidth="1.6" />
          {/* Gentle steam arcs */}
          <path d="M118 110 C112 94 124 82 118 66" fill="none" stroke={primary} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M148 106 C142 88 154 76 148 58" fill="none" stroke={primary} strokeWidth="2" strokeLinecap="round" />
          <path d="M178 110 C172 94 184 82 178 66" fill="none" stroke={primary} strokeWidth="1.8" strokeLinecap="round" />
          {/* Distance bracket */}
          <line x1="224" y1="58" x2="224" y2="124" stroke={secondary} strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="219" y1="58" x2="229" y2="58" stroke={secondary} strokeWidth="1.5" />
          <line x1="219" y1="124" x2="229" y2="124" stroke={secondary} strokeWidth="1.5" />
          <text x="232" y="94" fontSize="9.5" fontWeight="600" fill={secondary} fontFamily="Inter, sans-serif">
            30 cm
          </text>
        </g>
      );

    case 'cold_compress':
      return (
        <g>
          <circle cx="146" cy="114" r="75" fill="#F0FDFA" stroke="#CCFBF1" strokeWidth="1.5" />
          {/* Skin/surface curve */}
          <path
            d="M66 154 Q146 130 226 154"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Folded cloth compress */}
          <rect
            x="92"
            y="102"
            width="108"
            height="36"
            rx="8"
            fill="#FFFFFF"
            stroke={primary}
            strokeWidth="2"
          />
          <line x1="92" y1="120" x2="200" y2="120" stroke="#CBD5E1" strokeWidth="1.4" strokeDasharray="4 3" />
          {/* Cooling droplets */}
          <path
            d="M126 54 C126 54 116 68 116 74 C116 80 120.5 84 126 84 C131.5 84 136 80 136 74 C136 68 126 54 126 54 Z"
            fill="#CCFBF1"
            stroke={primary}
            strokeWidth="1.6"
          />
          <path
            d="M168 62 C168 62 160 73 160 78 C160 82.5 163.5 86 168 86 C172.5 86 176 82.5 176 78 C176 73 168 62 168 62 Z"
            fill="#E0F2FE"
            stroke="#0284C7"
            strokeWidth="1.5"
          />
          {/* Gentle contact arrows */}
          <line x1="146" y1="88" x2="146" y2="98" stroke={primary} strokeWidth="1.6" />
          <polygon points="142,95 150,95 146,101" fill={primary} />
        </g>
      );

    case 'topical_paste':
      return (
        <g>
          <circle cx="146" cy="114" r="75" fill="#ECFDF5" stroke="#D1FAE5" strokeWidth="1.5" />
          {/* Mortar / bowl */}
          <path
            d="M92 114 L196 114 C192 148 172 166 144 166 C116 166 96 148 92 114 Z"
            fill="#FFFFFF"
            stroke="#334155"
            strokeWidth="2"
          />
          <ellipse cx="144" cy="114" rx="52" ry="9" fill="#FEF3C7" stroke={secondary} strokeWidth="1.6" />
          {/* Wooden spoon / pestle */}
          <line x1="178" y1="54" x2="146" y2="116" stroke="#92400E" strokeWidth="6" strokeLinecap="round" />
          <line x1="178" y1="54" x2="146" y2="116" stroke="#B45309" strokeWidth="3" strokeLinecap="round" />
          {/* Botanical leaf */}
          <path
            d="M78 96 C78 72 98 62 114 68 C108 88 94 102 78 96 Z"
            fill="#D1FAE5"
            stroke={primary}
            strokeWidth="1.7"
          />
          {/* Patch test indicator */}
          <rect x="200" y="132" width="24" height="24" rx="4" fill="#FFFFFF" stroke={primary} strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="205" y="147" fontSize="8" fontWeight="600" fill={primary} fontFamily="Inter, sans-serif">
            2cm
          </text>
        </g>
      );

    case 'foot_soak':
      return (
        <g>
          <circle cx="148" cy="114" r="75" fill="#F0FDF4" stroke="#DCFCE7" strokeWidth="1.5" />
          {/* Wide soak basin */}
          <path
            d="M76 112 L220 112 L206 166 C204 171 199 174 194 174 L102 174 C97 174 92 171 90 166 Z"
            fill="#FFFFFF"
            stroke="#334155"
            strokeWidth="2"
          />
          {/* Water wave */}
          <path
            d="M84 128 Q116 121 148 128 T212 128"
            fill="none"
            stroke={primary}
            strokeWidth="2"
          />
          <path
            d="M86 132 L210 132 L203 164 C202 168 198 170 194 170 L102 170 C98 170 94 168 93 164 Z"
            fill="#CCFBF1"
            opacity="0.55"
          />
          {/* Salt / oat grains */}
          <circle cx="122" cy="150" r="3" fill={secondary} opacity="0.8" />
          <circle cx="148" cy="156" r="2.8" fill={secondary} opacity="0.7" />
          <circle cx="174" cy="148" r="3" fill={secondary} opacity="0.8" />
          {/* Folded towel beside */}
          <rect x="116" y="72" width="64" height="18" rx="4" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.6" />
          <line x1="116" y1="81" x2="180" y2="81" stroke="#CBD5E1" strokeWidth="1.4" />
        </g>
      );

    case 'fabric_blot':
      return (
        <g>
          <circle cx="146" cy="114" r="75" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="1.5" />
          {/* Woven textile square */}
          <rect x="86" y="88" width="120" height="78" rx="8" fill="#FFFFFF" stroke="#334155" strokeWidth="2" />
          {/* Subtle weave lines */}
          <line x1="106" y1="92" x2="106" y2="162" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="126" y1="92" x2="126" y2="162" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="146" y1="92" x2="146" y2="162" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="166" y1="92" x2="166" y2="162" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="186" y1="92" x2="186" y2="162" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="90" y1="112" x2="202" y2="112" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="90" y1="132" x2="202" y2="132" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="90" y1="152" x2="202" y2="152" stroke="#E2E8F0" strokeWidth="1" />
          {/* Target stain circle */}
          <circle cx="146" cy="128" r="20" fill={secondary} opacity="0.22" stroke={secondary} strokeWidth="1.5" strokeDasharray="3 2" />
          {/* Blotting pad */}
          <rect x="128" y="60" width="36" height="22" rx="4" fill="#ECFDF5" stroke={primary} strokeWidth="1.8" />
          {/* Downward blot arrow */}
          <line x1="146" y1="84" x2="146" y2="106" stroke={primary} strokeWidth="1.8" />
          <polygon points="141,102 151,102 146,110" fill={primary} />
        </g>
      );

    case 'pan_simmer':
      return (
        <g>
          <circle cx="146" cy="114" r="75" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          {/* Saucepan */}
          <path
            d="M84 106 L192 106 L186 154 C185 160 180 164 174 164 L102 164 C96 164 91 160 90 154 Z"
            fill="#FFFFFF"
            stroke="#334155"
            strokeWidth="2"
          />
          {/* Handle */}
          <line x1="192" y1="114" x2="226" y2="108" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
          {/* Simmer water */}
          <path d="M89 124 Q112 119 138 124 T187 124" fill="none" stroke={primary} strokeWidth="1.8" />
          <rect x="92" y="128" width="92" height="32" rx="4" fill="#ECFDF5" opacity="0.7" />
          {/* Wooden spatula */}
          <line x1="158" y1="54" x2="138" y2="152" stroke="#B45309" strokeWidth="4.5" strokeLinecap="round" />
          <rect x="129" y="142" width="16" height="14" rx="2" transform="rotate(11 137 149)" fill="#D97706" />
          {/* Low simmer flames */}
          <path d="M112 176 Q116 168 120 176" fill="none" stroke={secondary} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M134 176 Q138 168 142 176" fill="none" stroke={secondary} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M156 176 Q160 168 164 176" fill="none" stroke={secondary} strokeWidth="1.8" strokeLinecap="round" />
        </g>
      );

    case 'kettle_descale':
      return (
        <g>
          <circle cx="146" cy="114" r="75" fill="#F0FDFA" stroke="#CCFBF1" strokeWidth="1.5" />
          {/* Kettle body */}
          <path
            d="M108 72 L176 72 L188 158 C189 164 184 168 178 168 L106 168 C100 168 95 164 96 158 Z"
            fill="#FFFFFF"
            stroke="#334155"
            strokeWidth="2"
          />
          {/* Spout */}
          <path d="M106 94 L84 82 L94 114" fill="#FFFFFF" stroke="#334155" strokeWidth="2" strokeLinejoin="round" />
          {/* Handle */}
          <path d="M178 82 C202 82 204 144 186 144" fill="none" stroke="#334155" strokeWidth="2.4" />
          {/* Descaling solution fill */}
          <path d="M101 124 L183 124 L187 157 C187 162 183 165 178 165 L106 165 C101 165 97 162 97 157 Z" fill="#CCFBF1" opacity="0.7" />
          {/* Gentle lift bubbles */}
          <circle cx="126" cy="148" r="3" fill="none" stroke={primary} strokeWidth="1.4" />
          <circle cx="144" cy="138" r="4" fill="none" stroke={primary} strokeWidth="1.4" />
          <circle cx="160" cy="150" r="2.8" fill="none" stroke={secondary} strokeWidth="1.4" />
          {/* 2x Rinse badge */}
          <rect x="192" y="148" width="38" height="20" rx="4" fill="#ECFDF5" stroke={primary} strokeWidth="1.2" />
          <text x="198" y="161" fontSize="8.5" fontWeight="600" fill={primary} fontFamily="Inter, sans-serif">
            2x Rinse
          </text>
        </g>
      );

    case 'jar_trap_barrier':
    default:
      return (
        <g>
          <circle cx="146" cy="114" r="75" fill="#ECFDF5" stroke="#D1FAE5" strokeWidth="1.5" />
          {/* Glass jar */}
          <rect x="108" y="76" width="76" height="92" rx="10" fill="#FFFFFF" stroke="#334155" strokeWidth="2" />
          {/* Rim */}
          <rect x="104" y="66" width="84" height="12" rx="3" fill="#F8FAFC" stroke="#334155" strokeWidth="1.8" />
          {/* Breathable mesh / perforated cover */}
          <line x1="116" y1="62" x2="176" y2="62" stroke={primary} strokeWidth="2" strokeDasharray="3 3" />
          {/* Liquid or powder inside */}
          <rect x="112" y="122" width="68" height="42" rx="6" fill="#FEF3C7" opacity="0.85" />
          <line x1="112" y1="122" x2="180" y2="122" stroke={secondary} strokeWidth="1.5" />
          {/* Botanical / citrus sprig */}
          <circle cx="146" cy="142" r="10" fill="#FFFFFF" stroke={secondary} strokeWidth="1.5" />
          <line x1="146" y1="132" x2="146" y2="152" stroke={secondary} strokeWidth="1.2" />
          <line x1="136" y1="142" x2="156" y2="142" stroke={secondary} strokeWidth="1.2" />
        </g>
      );
  }
}

export const RemedyIllustrationCard: React.FC<RemedyIllustrationCardProps> = ({
  remedy,
  lang,
  visualGuideTitle,
}) => {
  const {diagram} = remedy;
  const num = String(remedy.number).padStart(2, '0');
  const ratio = getDiagramLabel(diagram.ratioLabel, lang);
  const temp = getDiagramLabel(diagram.tempLabel, lang);
  const duration = getDiagramLabel(diagram.durationLabel, lang);
  const action = getDiagramLabel(diagram.actionLabel, lang);

  return (
    <figure className="print-svg-preserve rounded-xl border border-slate-200 bg-[#F8FAFC] p-3">
      <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium text-slate-700">{visualGuideTitle}</span>
        <span className="tabular-nums font-medium text-emerald-700">#{num}</span>
      </div>
      <svg
        viewBox="0 0 440 220"
        className="w-full h-auto rounded-lg bg-white border border-slate-100"
        role="img"
        aria-label={`${visualGuideTitle}: ${remedy.titles[lang] || remedy.titles.en}`}
      >
        {/* Subtle editorial grid background */}
        <rect x="0" y="0" width="440" height="220" fill="#FFFFFF" />
        <line x1="256" y1="22" x2="256" y2="198" stroke="#E2E8F0" strokeWidth="1" />

        {/* Left Zone: Clean Static Illustration */}
        {renderTemplateArtwork(
          diagram.template,
          diagram.primaryColor,
          diagram.secondaryColor,
          num,
        )}

        {/* Right Zone: Measured Specification Panel */}
        <g transform="translate(274, 28)">
          <text
            x="0"
            y="14"
            fontSize="10"
            fontWeight="600"
            fill="#64748B"
            fontFamily="Inter, sans-serif"
          >
            GUIDE #{num}
          </text>

          {/* Ratio Box */}
          <rect x="0" y="26" width="144" height="34" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          <circle cx="14" cy="43" r="4" fill={diagram.primaryColor} />
          <text x="26" y="47" fontSize="11" fontWeight="600" fill="#0F172A" fontFamily="Plus Jakarta Sans, Inter, sans-serif">
            {ratio}
          </text>

          {/* Temp / Condition Box */}
          <rect x="0" y="68" width="144" height="34" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          <circle cx="14" cy="85" r="4" fill={diagram.secondaryColor} />
          <text x="26" y="89" fontSize="11" fontWeight="600" fill="#0F172A" fontFamily="Plus Jakarta Sans, Inter, sans-serif">
            {temp}
          </text>

          {/* Duration Box */}
          <rect x="0" y="110" width="144" height="34" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          <rect x="10" y="123" width="8" height="8" rx="2" fill="#0F766E" />
          <text x="26" y="131" fontSize="11" fontWeight="600" fill="#0F172A" fontFamily="Plus Jakarta Sans, Inter, sans-serif">
            {duration}
          </text>

          {/* Key Safety Cue */}
          <rect x="0" y="152" width="144" height="26" rx="6" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="1" />
          <text x="10" y="169" fontSize="10" fontWeight="600" fill="#B45309" fontFamily="Inter, sans-serif">
            {action}
          </text>
        </g>
      </svg>
    </figure>
  );
};

export const RemedyThumbnailSvg: React.FC<{
  template: IllustrationTemplate;
  primaryColor: string;
  secondaryColor: string;
}> = ({template, primaryColor, secondaryColor}) => {
  return (
    <svg
      viewBox="0 0 64 48"
      className="w-14 h-11 shrink-0 rounded-md border border-slate-200 bg-[#F8FAFC]"
      aria-hidden="true"
    >
      <rect x="0" y="0" width="64" height="48" fill="#F8FAFC" />
      <circle cx="32" cy="24" r="17" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
      {template === 'gargle_cup' && (
        <g>
          <path d="M24 13 L26 34 L38 34 L40 13 Z" fill="#CCFBF1" stroke={primaryColor} strokeWidth="1.5" />
          <line x1="35" y1="9" x2="31" y2="30" stroke={secondaryColor} strokeWidth="1.4" strokeLinecap="round" />
        </g>
      )}
      {template === 'infusion_mug' && (
        <g>
          <rect x="22" y="18" width="18" height="16" rx="3" fill="#FEF3C7" stroke={primaryColor} strokeWidth="1.5" />
          <path d="M40 21 C45 21 45 30 40 30" fill="none" stroke={primaryColor} strokeWidth="1.5" />
          <path d="M28 14 Q30 11 28 8" fill="none" stroke={secondaryColor} strokeWidth="1.3" strokeLinecap="round" />
          <path d="M34 14 Q36 11 34 8" fill="none" stroke={secondaryColor} strokeWidth="1.3" strokeLinecap="round" />
        </g>
      )}
      {template === 'steam_bowl' && (
        <g>
          <path d="M18 25 L46 25 C44 33 39 36 32 36 C25 36 20 33 18 25 Z" fill="#E0F2FE" stroke={primaryColor} strokeWidth="1.5" />
          <path d="M26 20 Q28 15 26 11" fill="none" stroke={secondaryColor} strokeWidth="1.3" strokeLinecap="round" />
          <path d="M32 19 Q34 14 32 10" fill="none" stroke={primaryColor} strokeWidth="1.3" strokeLinecap="round" />
          <path d="M38 20 Q40 15 38 11" fill="none" stroke={secondaryColor} strokeWidth="1.3" strokeLinecap="round" />
        </g>
      )}
      {template === 'cold_compress' && (
        <g>
          <rect x="19" y="21" width="26" height="10" rx="3" fill="#CCFBF1" stroke={primaryColor} strokeWidth="1.5" />
          <path d="M32 10 C32 10 28 15 28 17 C28 19 30 20 32 20 C34 20 36 19 36 17 C36 15 32 10 32 10 Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.2" />
        </g>
      )}
      {template === 'topical_paste' && (
        <g>
          <path d="M20 22 L44 22 C42 32 37 35 32 35 C27 35 22 32 20 22 Z" fill="#FEF3C7" stroke={secondaryColor} strokeWidth="1.5" />
          <line x1="38" y1="11" x2="31" y2="23" stroke={primaryColor} strokeWidth="2.2" strokeLinecap="round" />
        </g>
      )}
      {template === 'foot_soak' && (
        <g>
          <path d="M18 21 L46 21 L43 34 L21 34 Z" fill="#CCFBF1" stroke={primaryColor} strokeWidth="1.5" />
          <path d="M20 26 Q26 23 32 26 T44 26" fill="none" stroke={secondaryColor} strokeWidth="1.3" />
        </g>
      )}
      {template === 'fabric_blot' && (
        <g>
          <rect x="20" y="16" width="24" height="18" rx="3" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.4" />
          <circle cx="32" cy="25" r="5" fill={secondaryColor} opacity="0.3" stroke={secondaryColor} strokeWidth="1.2" />
          <rect x="27" y="11" width="10" height="5" rx="1.5" fill={primaryColor} />
        </g>
      )}
      {template === 'pan_simmer' && (
        <g>
          <rect x="20" y="19" width="21" height="14" rx="2" fill="#ECFDF5" stroke={primaryColor} strokeWidth="1.5" />
          <line x1="41" y1="22" x2="49" y2="20" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
          <line x1="33" y1="10" x2="29" y2="27" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
      {template === 'kettle_descale' && (
        <g>
          <path d="M24 14 L39 14 L42 34 L22 34 Z" fill="#CCFBF1" stroke={primaryColor} strokeWidth="1.5" />
          <path d="M23 19 L17 16 L21 24" fill="none" stroke={primaryColor} strokeWidth="1.4" />
          <circle cx="31" cy="26" r="2.2" fill="none" stroke={secondaryColor} strokeWidth="1.2" />
        </g>
      )}
      {template === 'jar_trap_barrier' && (
        <g>
          <rect x="23" y="15" width="18" height="20" rx="3" fill="#FEF3C7" stroke={primaryColor} strokeWidth="1.5" />
          <line x1="25" y1="12" x2="39" y2="12" stroke={secondaryColor} strokeWidth="1.8" strokeDasharray="2 2" />
        </g>
      )}
    </svg>
  );
};
