"use client";

import { VIDEOS, VIDEO_SCRUB_PPS } from "@/lib/constants";
import { ScrollScrubSection } from "@/components/shared/ScrollScrubSection";

/** Blueprint cinematic accent — 4s scroll-scrub, unpins at final frame. */
export function Blueprint() {
  return (
    <ScrollScrubSection
      id="blueprint"
      src={VIDEOS.blueprint.src}
      poster={VIDEOS.blueprint.poster}
      ariaLabel={VIDEOS.blueprint.label}
      pixelsPerSecond={VIDEO_SCRUB_PPS}
      kicker="From Drawing to Form"
      title="The blueprint becomes the building."
      body="Scroll to reveal the transformation — four seconds of intent, locked to your hand."
      overlayClassName="bg-gradient-to-r from-[#070708]/80 via-[#070708]/45 to-[#070708]/20"
    />
  );
}
