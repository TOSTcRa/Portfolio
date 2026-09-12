"use client";
import { Blackjack } from "./Blackjack";
import { ShopCatalog } from "./ShopCatalog";
import { SecurityScan } from "./SecurityScan";
import { AgencyBlocks } from "./AgencyBlocks";
import { OmniInbox } from "./OmniInbox";
import { DatingMatch } from "./DatingMatch";
import { AdminPanel } from "./AdminPanel";

const registry: Record<string, () => React.JSX.Element> = {
  "blackjack-nextjs": Blackjack,
  "shop-storefront-catalog": ShopCatalog,
  "site-security-cleanup": SecurityScan,
  "agency-site-improvements": AgencyBlocks,
  "1c-omnichannel-spec": OmniInbox,
  "dating-platforms-frontend": DatingMatch,
  "client-portfolio-admin": AdminPanel,
};

export function CaseVisual({ slug, index }: { slug: string; index: number }) {
  const Visual = registry[slug];
  if (!Visual) {
    return (
      <div className="flex h-full items-end bg-bg p-6">
        <span aria-hidden className="font-mono text-5xl font-medium leading-none tracking-tight text-fg-muted/60 sm:text-7xl">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    );
  }
  return <Visual />;
}
