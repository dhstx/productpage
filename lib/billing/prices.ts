const priceIds = {
  entry: 'price_1SLRM4B0VqDMH290DQbkZXJg',
  pro: 'price_1SLRxPB0VqDMH290Zjds5gzV',
  proPlus: 'price_1SLS75B0VqDMH290QY1kEbek',
  business: 'price_1SLS8EB0VqDMH290UlIsfKac',
  enterprise: 'price_1SLS90B0VqDMH290OwoAYucE'
} as const;

export const PLAN_PRICE = {
  entry: priceIds.entry,
  starter: priceIds.entry,
  pro: priceIds.pro,
  professional: priceIds.pro,
  proPlus: priceIds.proPlus,
  business: priceIds.business,
  enterprise: priceIds.enterprise
} as const;

export type PlanPriceKey = keyof typeof PLAN_PRICE;
