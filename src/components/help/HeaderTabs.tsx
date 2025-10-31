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
  const a = 'um-tab-base um-tab-active';
  const i = 'um-tab-base um-tab-idle';

  const OverviewLink = LinkComponent;
  const WalkthroughLink = LinkComponent;

  return (
    <div className="mb-3 flex gap-4">
      {OverviewLink ? (
        <OverviewLink to="/user-manual" className={active === 'overview' ? a : i} aria-current={active === 'overview' ? 'page' : undefined}>
          Overview
        </OverviewLink>
      ) : (
        <a href="/user-manual" className={active === 'overview' ? a : i} aria-current={active === 'overview' ? 'page' : undefined}>
          Overview
        </a>
      )}
      {WalkthroughLink ? (
        <WalkthroughLink to="/user-manual/walkthroughs" className={active === 'walkthroughs' ? a : i} aria-current={active === 'walkthroughs' ? 'page' : undefined}>
          Walkthroughs
        </WalkthroughLink>
      ) : (
        <a href="/user-manual/walkthroughs" className={active === 'walkthroughs' ? a : i} aria-current={active === 'walkthroughs' ? 'page' : undefined}>
          Walkthroughs
        </a>
      )}
    </div>
  );
}
