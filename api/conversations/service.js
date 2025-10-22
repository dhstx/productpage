/**
 * Conversation History Service
 * Handles all conversation and message operations
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * Create a new conversation
 */
export async function createConversation(userId, agentId, agentName) {
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      user_id: userId,
      agent_id: agentId,
      agent_name: agentName
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get conversation by ID
 */
export async function getConversation(conversationId, userId) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all conversations for a user
 */
export async function getUserConversations(userId, options = {}) {
  const {
    limit = 50,
    offset = 0,
    bookmarkedOnly = false,
    archived = false,
    agentId = null
  } = options;

  let query = supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .eq('is_archived', archived)
    .order('last_message_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (bookmarkedOnly) {
    query = query.eq('is_bookmarked', true);
  }

  if (agentId) {
    query = query.eq('agent_id', agentId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

/**
 * Search conversations
 */
export async function searchConversations(userId, searchQuery, options = {}) {
  const {
    agentId = null,
    bookmarkedOnly = false,
    limit = 50,
    offset = 0
  } = options;

  const { data, error } = await supabase
    .rpc('search_conversations', {
      p_user_id: userId,
      p_query: searchQuery,
      p_agent_id: agentId,
      p_bookmarked_only: bookmarkedOnly,
      p_limit: limit,
      p_offset: offset
    });

  if (error) throw error;
  return data;
}

/**
 * Update conversation
 */
export async function updateConversation(conversationId, userId, updates) {
  const { data, error } = await supabase
    .from('conversations')
    .update(updates)
    .eq('id', conversationId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Toggle bookmark
 */
export async function toggleBookmark(conversationId, userId) {
  const conversation = await getConversation(conversationId, userId);
  
  return updateConversation(conversationId, userId, {
    is_bookmarked: !conversation.is_bookmarked
  });
}

/**
 * Archive conversation
 */
export async function archiveConversation(conversationId, userId) {
  return updateConversation(conversationId, userId, {
    is_archived: true
  });
}

/**
 * Unarchive conversation
 */
export async function unarchiveConversation(conversationId, userId) {
  return updateConversation(conversationId, userId, {
    is_archived: false
  });
}

/**
 * Delete conversation
 */
export async function deleteConversation(conversationId, userId) {
  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId)
    .eq('user_id', userId);

  if (error) throw error;
  return { success: true };
}

/**
 * Add message to conversation
 */
export async function addMessage(conversationId, role, content, ptCost = 0, modelUsed = null, tokensUsed = null) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      role,
      content,
      pt_cost: ptCost,
      model_used: modelUsed,
      tokens_used: tokensUsed
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get messages for a conversation
 */
export async function getMessages(conversationId, userId) {
  // Verify user owns conversation
  await getConversation(conversationId, userId);

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Add tags to conversation
 */
export async function addTags(conversationId, userId, tags) {
  // Verify user owns conversation
  await getConversation(conversationId, userId);

  const tagInserts = tags.map(tag => ({
    conversation_id: conversationId,
    tag: tag.toLowerCase().trim()
  }));

  const { data, error } = await supabase
    .from('conversation_tags')
    .insert(tagInserts)
    .select();

  if (error) throw error;
  return data;
}

/**
 * Remove tag from conversation
 */
export async function removeTag(conversationId, userId, tag) {
  // Verify user owns conversation
  await getConversation(conversationId, userId);

  const { error } = await supabase
    .from('conversation_tags')
    .delete()
    .eq('conversation_id', conversationId)
    .eq('tag', tag.toLowerCase().trim());

  if (error) throw error;
  return { success: true };
}

/**
 * Get tags for conversation
 */
export async function getTags(conversationId, userId) {
  // Verify user owns conversation
  await getConversation(conversationId, userId);

  const { data, error } = await supabase
    .from('conversation_tags')
    .select('tag')
    .eq('conversation_id', conversationId);

  if (error) throw error;
  return data.map(t => t.tag);
}

/**
 * Create shareable link
 */
export async function createShareLink(conversationId, userId, expiresInDays = null) {
  // Verify user owns conversation
  await getConversation(conversationId, userId);

  const shareCode = generateShareCode();
  const expiresAt = expiresInDays 
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
    : null;

  const { data, error } = await supabase
    .from('conversation_shares')
    .insert({
      conversation_id: conversationId,
      share_code: shareCode,
      created_by: userId,
      expires_at: expiresAt
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get shared conversation by code
 */
export async function getSharedConversation(shareCode) {
  const { data: share, error: shareError } = await supabase
    .from('conversation_shares')
    .select('*, conversations(*)')
    .eq('share_code', shareCode)
    .eq('is_active', true)
    .single();

  if (shareError) throw shareError;

  // Check if expired
  if (share.expires_at && new Date(share.expires_at) < new Date()) {
    throw new Error('Share link has expired');
  }

  // Increment view count
  await supabase
    .from('conversation_shares')
    .update({ view_count: share.view_count + 1 })
    .eq('id', share.id);

  // Get messages
  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('role, content, created_at')
    .eq('conversation_id', share.conversation_id)
    .order('created_at', { ascending: true });

  if (messagesError) throw messagesError;

  return {
    conversation: share.conversations,
    messages,
    share_info: {
      view_count: share.view_count + 1,
      created_at: share.created_at,
      expires_at: share.expires_at
    }
  };
}

/**
 * Deactivate share link
 */
export async function deactivateShareLink(shareId, userId) {
  const { error } = await supabase
    .from('conversation_shares')
    .update({ is_active: false })
    .eq('id', shareId)
    .eq('created_by', userId);

  if (error) throw error;
  return { success: true };
}

/**
 * Get conversation statistics
 */
export async function getConversationStats(userId) {
  const { data, error } = await supabase
    .rpc('get_conversation_stats', { p_user_id: userId });

  if (error) throw error;
  return data;
}

/**
 * Export conversation to JSON
 */
export async function exportConversation(conversationId, userId) {
  const conversation = await getConversation(conversationId, userId);
  const messages = await getMessages(conversationId, userId);
  const tags = await getTags(conversationId, userId);

  return {
    conversation: {
      id: conversation.id,
      title: conversation.title,
      agent_name: conversation.agent_name,
      created_at: conversation.created_at,
      total_pt_cost: conversation.total_pt_cost,
      message_count: conversation.message_count
    },
    messages: messages.map(m => ({
      role: m.role,
      content: m.content,
      created_at: m.created_at,
      pt_cost: m.pt_cost
    })),
    tags,
    exported_at: new Date().toISOString()
  };
}

/**
 * Generate random share code
 */
function generateShareCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default {
  createConversation,
  getConversation,
  getUserConversations,
  searchConversations,
  updateConversation,
  toggleBookmark,
  archiveConversation,
  unarchiveConversation,
  deleteConversation,
  addMessage,
  getMessages,
  addTags,
  removeTag,
  getTags,
  createShareLink,
  getSharedConversation,
  deactivateShareLink,
  getConversationStats,
  exportConversation
};

