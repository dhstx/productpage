// Supabase Database Client
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database helper functions
export const db = {
  // Users
  users: {
    async findById(id) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    
    async findByEmail(email) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
      return data;
    },
    
    async findByGoogleId(googleId) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('google_id', googleId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    
    async create(userData) {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    
    async update(id, updates) {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },
  
  // Subscriptions
  subscriptions: {
    async findByUserId(userId) {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    
    async findByStripeId(stripeSubscriptionId) {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('stripe_subscription_id', stripeSubscriptionId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    
    async upsert(subscriptionData) {
      const { data, error } = await supabase
        .from('subscriptions')
        .upsert([subscriptionData], { onConflict: 'stripe_subscription_id' })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    
    async updateByStripeId(stripeSubscriptionId, updates) {
      const { data, error } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('stripe_subscription_id', stripeSubscriptionId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },
  
  // Agent Usage
  agent_usage: {
    async create(usageData) {
      const { data, error } = await supabase
        .from('agent_usage')
        .insert([usageData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    
    async getMonthlyUsage(userId) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from('agent_usage')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString());
      
      if (error) throw error;
      
      return {
        api_calls: data.length,
        tokens_used: data.reduce((sum, record) => sum + (record.tokens_used || 0), 0),
        successful: data.filter(r => r.status === 'success').length,
        failed: data.filter(r => r.status === 'failed').length
      };
    },
    
    async getUserLogs(userId, limit = 100) {
      const { data, error } = await supabase
        .from('agent_usage')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data;
    }
  },
  
  // API Keys
  api_keys: {
    async create(keyData) {
      const { data, error } = await supabase
        .from('api_keys')
        .insert([keyData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    
    async findByHash(keyHash) {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('key_hash', keyHash)
        .is('revoked_at', null)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    
    async listByUserId(userId) {
      const { data, error } = await supabase
        .from('api_keys')
        .select('id, name, created_at, last_used_at')
        .eq('user_id', userId)
        .is('revoked_at', null)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    
    async revoke(id) {
      const { data, error } = await supabase
        .from('api_keys')
        .update({ revoked_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },
  
  // Invoices
  invoices: {
    async create(invoiceData) {
      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    
    async findById(id) {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    
    async findByUserId(userId) {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  }
};

export default db;

