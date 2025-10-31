import type { ComponentType, ReactNode } from 'react';

export type HeaderTabsLinkProps = {
  to: string;
  className?: string;
  children: ReactNode;
  "aria-current"?: 'page' | undefined;
};

type HeaderTabsProps = {
  active: 'overview' | 'walkthroughs';
  LinkComponent?: ComponentType<HeaderTabsLinkProps>;
};

const tabBase = 'inline-flex items-center rounded-full border border-transparent px-3 py-1 text-sm font-medium transition-colors';
const activeLight = 'bg-amber-100 text-amber-800 border border-amber-200 shadow-sm';
const idleLight = 'text-neutral-700 hover:bg-amber-50';
const activeDark = 'bg-neutral-800 text-[color:var(--um-title-color)] border border-neutral-700';
const idleDark = 'text-neutral-300 hover:text-[color:var(--um-title-color)] hover:bg-neutral-900';

function getClass(isActive: boolean) {
  if (isActive) {
    return `${tabBase} ${activeLight} dark:${activeDark}`;
  }
  return `${tabBase} ${idleLight} dark:${idleDark}`;
}

export function HeaderTabs({ active, LinkComponent }: HeaderTabsProps) {
  const OverviewLink = LinkComponent;
  const WalkthroughLink = LinkComponent;

  return (
    <div className="flex h-11 items-center gap-3">
      {OverviewLink ? (
        <OverviewLink
          to="/user-manual"
          className={getClass(active === 'overview')}
          aria-current={active === 'overview' ? 'page' : undefined}
        >
          Overview
        </OverviewLink>
      ) : (
        <a
          href="/user-manual"
          className={getClass(active === 'overview')}
          aria-current={active === 'overview' ? 'page' : undefined}
        >
          Overview
        </a>
      )}
      {WalkthroughLink ? (
        <WalkthroughLink
          to="/user-manual/walkthroughs"
          className={getClass(active === 'walkthroughs')}
          aria-current={active === 'walkthroughs' ? 'page' : undefined}
        >
          Walkthroughs
        </WalkthroughLink>
      ) : (
        <a
          href="/user-manual/walkthroughs"
          className={getClass(active === 'walkthroughs')}
          aria-current={active === 'walkthroughs' ? 'page' : undefined}
        >
          Walkthroughs
        </a>
      )}
    </div>
  );
}
