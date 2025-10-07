import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { products } from '../utils/mockData';
import { useAuthStore } from '../store/authStore';
import { usePurchaseStore } from '../store/purchaseStore';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { Product } from '../types';

// Initialize Stripe (use your publishable key in production)
const stripePromise = loadStripe('pk_test_51234567890');

const CheckoutForm: React.FC<{ product: Product; onClose: () => void }> = ({ product, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { addPurchase } = usePurchaseStore();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate payment processing
    setTimeout(() => {
      // Add purchase to store
      addPurchase({
        id: Date.now().toString(),
        productId: product.id,
        userId: user?.id || '',
        purchaseDate: new Date(),
        status: 'active',
        accessUrl: `https://platform${product.id}.example.com`,
      });

      setLoading(false);
      onClose();
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="p-3 border border-gray-300 rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : `Pay $${product.price}`}
      </button>
    </form>
  );
};

export const ProductsPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handlePurchase = (productId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Products
          </h1>
          <p className="text-xl text-gray-600">
            Choose the perfect platform for your business needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPurchase={handlePurchase}
            />
          ))}
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog.Root open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-2xl font-bold">
                Complete Purchase
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </Dialog.Close>
            </div>
            {selectedProduct && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">{selectedProduct.name}</h3>
                <p className="text-2xl font-bold text-blue-600 mb-4">
                  ${selectedProduct.price}
                </p>
              </div>
            )}
            {selectedProduct && (
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  product={selectedProduct}
                  onClose={() => setSelectedProduct(null)}
                />
              </Elements>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};
