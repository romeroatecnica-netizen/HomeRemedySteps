import React from 'react';

interface MediaNetAdSlotProps {
  slotId: string;
  placement: 'mid-catalog' | 'bottom-editorial';
}

export const MediaNetAdSlot: React.FC<MediaNetAdSlotProps> = ({slotId, placement}) => {
  return (
    <aside
      aria-label="Advertisement"
      data-ad-network="media-net"
      data-ad-slot={slotId}
      data-placement={placement}
      className="no-print mx-auto my-8 w-full max-w-6xl px-4 sm:px-6"
    >
      {/*
        Media.net Dedicated Ad Container (CLS-Safe Reserved Height)
        Replace data-cid / window._mNHandle configuration inside your production script
        when activating live Media.net ad tags for homeremedysteps.bastelar.com.
      */}
      <div
        id={slotId}
        className="flex min-h-[104px] md:min-h-[120px] w-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/80 px-4 py-4 text-center"
      >
        <div className="space-y-1">
          <p className="text-[11px] font-medium tracking-wider uppercase text-slate-400">
            Sponsored Space · Media.net Slot ({slotId})
          </p>
          <p className="text-xs text-slate-400">
            Reserved min-height container (120px) · Zero layout shift · Hidden in print
          </p>
        </div>
      </div>
    </aside>
  );
};
