import type { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Analytics Platform',
    description: 'Advanced analytics and reporting dashboard with real-time data visualization',
    price: 99.99,
    features: [
      'Real-time analytics',
      'Custom dashboards',
      'Advanced reporting',
      'Data export',
      'API access',
    ],
  },
  {
    id: '2',
    name: 'E-Commerce Suite',
    description: 'Complete e-commerce solution with inventory management and payment processing',
    price: 149.99,
    features: [
      'Product management',
      'Order processing',
      'Payment integration',
      'Inventory tracking',
      'Customer management',
    ],
  },
  {
    id: '3',
    name: 'CRM Platform',
    description: 'Customer relationship management system with automation and reporting',
    price: 199.99,
    features: [
      'Contact management',
      'Lead tracking',
      'Email automation',
      'Sales pipeline',
      'Activity tracking',
    ],
  },
  {
    id: '4',
    name: 'Marketing Hub',
    description: 'All-in-one marketing platform with campaign management and analytics',
    price: 129.99,
    features: [
      'Campaign management',
      'Email marketing',
      'Social media tools',
      'SEO optimization',
      'Performance analytics',
    ],
  },
];
