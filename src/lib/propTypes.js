/**
 * Common PropTypes definitions for the application
 * Import and use these in components to ensure consistency
 */

import PropTypes from 'prop-types';

// User object
export const userPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  name: PropTypes.string,
  tier: PropTypes.string,
  pt_balance: PropTypes.number,
  created_at: PropTypes.string,
  updated_at: PropTypes.string
});

// Agent object
export const agentPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  tier_required: PropTypes.string,
  pt_cost: PropTypes.number,
  model: PropTypes.string,
  category: PropTypes.string
});

// PT Usage object
export const ptUsagePropType = PropTypes.shape({
  core_used: PropTypes.number.isRequired,
  core_total: PropTypes.number.isRequired,
  advanced_used: PropTypes.number,
  advanced_total: PropTypes.number,
  reset_date: PropTypes.string,
  percentage_used: PropTypes.number
});

// Subscription object
export const subscriptionPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  tier: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  current_period_start: PropTypes.string,
  current_period_end: PropTypes.string,
  cancel_at_period_end: PropTypes.bool,
  price: PropTypes.number
});

// Conversation object
export const conversationPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  agent_id: PropTypes.string,
  created_at: PropTypes.string,
  updated_at: PropTypes.string,
  message_count: PropTypes.number
});

// Message object
export const messagePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  role: PropTypes.oneOf(['user', 'assistant', 'system']).isRequired,
  content: PropTypes.string.isRequired,
  created_at: PropTypes.string,
  pt_cost: PropTypes.number
});

// Billing history item
export const invoicePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  created: PropTypes.number,
  invoice_pdf: PropTypes.string,
  description: PropTypes.string
});

// Alert object
export const alertPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['info', 'warning', 'error', 'success']).isRequired,
  message: PropTypes.string.isRequired,
  created_at: PropTypes.string,
  read: PropTypes.bool
});

// Referral object
export const referralPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  referrer_id: PropTypes.string.isRequired,
  referred_id: PropTypes.string,
  status: PropTypes.string,
  reward_amount: PropTypes.number,
  created_at: PropTypes.string
});

// Common callback PropTypes
export const onClickPropType = PropTypes.func;
export const onChangePropType = PropTypes.func;
export const onSubmitPropType = PropTypes.func;

// Common component PropTypes
export const childrenPropType = PropTypes.node;
export const classNamePropType = PropTypes.string;
export const stylePropType = PropTypes.object;

// Loading/Error state PropTypes
export const loadingPropType = PropTypes.bool;
export const errorPropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    message: PropTypes.string,
    status: PropTypes.number
  })
]);

// Size variants
export const sizePropType = PropTypes.oneOf(['small', 'medium', 'large']);

// Color variants
export const colorPropType = PropTypes.oneOf([
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'info'
]);

// Export all as a single object for convenience
export const commonPropTypes = {
  user: userPropType,
  agent: agentPropType,
  ptUsage: ptUsagePropType,
  subscription: subscriptionPropType,
  conversation: conversationPropType,
  message: messagePropType,
  invoice: invoicePropType,
  alert: alertPropType,
  referral: referralPropType,
  onClick: onClickPropType,
  onChange: onChangePropType,
  onSubmit: onSubmitPropType,
  children: childrenPropType,
  className: classNamePropType,
  style: stylePropType,
  loading: loadingPropType,
  error: errorPropType,
  size: sizePropType,
  color: colorPropType
};

export default commonPropTypes;

