import React from 'react';

export type HeaderTabsLinkProps = {
  to: string;
  className?: string;
  children: React.ReactNode;
  "aria-current"?: 'page' | undefined;
};

type HeaderTabsProps = {
  active: 'overview' | 'walkthroughs';
  LinkComponent?: React.ComponentType<HeaderTabsLinkProps>;
};

const tabBase = [
  'inline-flex items-center justify-center',
  'rounded-full border px-3 py-1 text-sm font-medium',
  'transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60',
].join(' ');

const tabActive = [
  tabBase,
  'bg-amber-100 text-amber-800 border-amber-200 shadow-sm hover:bg-amber-50 hover:text-amber-800',
  'dark:bg-neutral-900 dark:border-neutral-700 dark:text-[color:var(--um-title-color)] dark:hover:text-[color:var(--um-title-color)] dark:hover:bg-neutral-900/80',
].join(' ');

const tabIdle = [
  tabBase,
  'border-transparent text-neutral-700 hover:bg-amber-50 hover:text-amber-800',
  'dark:text-neutral-300 dark:hover:text-[color:var(--um-title-color)] dark:hover:bg-neutral-900/80',
].join(' ');

export function HeaderTabs({ active, LinkComponent }: HeaderTabsProps) {
  const OverviewLink = LinkComponent;
  const WalkthroughLink = LinkComponent;

  return (
    <div className="flex items-center gap-3" role="tablist" aria-label="User manual sections">
      {OverviewLink ? (
        <OverviewLink
          to="/user-manual"
          className={active === 'overview' ? tabActive : tabIdle}
          aria-current={active === 'overview' ? 'page' : undefined}
        >
          Overview
        </OverviewLink>
      ) : (
        <a
          href="/user-manual"
          className={active === 'overview' ? tabActive : tabIdle}
          aria-current={active === 'overview' ? 'page' : undefined}
        >
          Overview
        </a>
      )}
      {WalkthroughLink ? (
        <WalkthroughLink
          to="/user-manual/walkthroughs"
          className={active === 'walkthroughs' ? tabActive : tabIdle}
          aria-current={active === 'walkthroughs' ? 'page' : undefined}
        >
          Walkthroughs
        </WalkthroughLink>
      ) : (
        <a
          href="/user-manual/walkthroughs"
          className={active === 'walkthroughs' ? tabActive : tabIdle}
          aria-current={active === 'walkthroughs' ? 'page' : undefined}
        >
          Walkthroughs
        </a>
      )}
    </div>
  );
}
