import { Bot, User, AlertCircle } from 'lucide-react';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const isError = message.role === 'error';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && !isError && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFC96C]/20">
          <Bot className="h-4 w-4 text-[#FFC96C]" />
        </div>
      )}

      <div
        className={`max-w-[70%] rounded-lg p-4 ${
          isUser
            ? 'bg-[#FFC96C] text-[#1A1A1A]'
            : isError
            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
            : 'bg-[#202020] text-[#F2F2F2]'
        }`}
      >
        {!isUser && !isError && message.agent && (
          <div className="mb-2 text-xs font-semibold text-[#FFC96C] uppercase">
            {message.agent}
          </div>
        )}
        
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>

        {message.metadata && (
          <div className="mt-2 flex gap-3 text-xs text-[#666]">
            {message.metadata.model && <span>Model: {message.metadata.model}</span>}
            {message.metadata.tokens && (
              <>
                <span>•</span>
                <span>{message.metadata.tokens} tokens</span>
              </>
            )}
            {message.metadata.executionTime && (
              <>
                <span>•</span>
                <span>{message.metadata.executionTime}ms</span>
              </>
            )}
          </div>
        )}

        <div className="mt-1 text-xs text-[#666]">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>

      {isUser && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F2F2F2]/20">
          <User className="h-4 w-4 text-[#F2F2F2]" />
        </div>
      )}

      {isError && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
          <AlertCircle className="h-4 w-4 text-red-500" />
        </div>
      )}
    </div>
  );
}
