import { useState } from 'react';
import BackArrow from '../components/BackArrow';
import AIChatInterface from '../components/AIChatInterface';
import { getCurrentUser } from '../lib/auth';

export default function AgentManagement() {
  const user = getCurrentUser();

  return (
    <>
      <BackArrow />
      <div className="min-h-screen bg-[#0A0A0A] text-[#F2F2F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
              AI AGENTS DASHBOARD
            </h1>
            <p className="text-[#B3B3B3]">
              Chat with our specialized AI agents to get help with your tasks
            </p>
            {user && (
              <p className="text-sm text-[#808080] mt-2">
                Logged in as: {user.username} ({user.role})
              </p>
            )}
          </div>

          {/* Chat Interface */}
          <div className="bg-[#0F0F0F] rounded-lg border border-[#1A1A1A] p-6">
            <AIChatInterface />
          </div>
        </div>
      </div>
    </>
  );
}

