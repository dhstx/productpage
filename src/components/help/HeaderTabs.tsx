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

export function HeaderTabs({ active, LinkComponent }: HeaderTabsProps) {
  const tabBase = 'rounded-full px-3 py-1 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60 transition-colors duration-150 border';
  const tabActive = `${tabBase} bg-amber-100 text-amber-800 border-amber-200 shadow-sm dark:bg-neutral-800 dark:text-amber-300 dark:border-neutral-700`;
  const tabIdle = `${tabBase} border-transparent text-neutral-700 hover:bg-amber-50 hover:text-amber-800 dark:text-neutral-300 dark:hover:text-amber-300 dark:hover:bg-neutral-900`;

  const OverviewLink = LinkComponent;
  const WalkthroughLink = LinkComponent;

  return (
    <div className="flex items-center gap-3">
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
