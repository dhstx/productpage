import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { Product } from '../types';
import { formatPrice } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  onPurchase?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPurchase }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
          <span className="text-3xl font-bold text-blue-600">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="text-gray-600 mb-6">{product.description}</p>
        <div className="space-y-2 mb-6">
          {product.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
        {onPurchase && (
          <button
            onClick={() => onPurchase(product.id)}
            className="w-full btn-primary"
          >
            Purchase Now
          </button>
        )}
      </div>
    </motion.div>
  );
};
