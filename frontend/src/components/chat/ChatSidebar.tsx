import type { Conversation } from '../../types/chat.ts';

type ChatSidebarProps = {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (id: string) => void;
};

export function ChatSidebar({
  conversations,
  selectedId,
  onSelect,
}: ChatSidebarProps) {
  return (
    <aside className="flex h-full w-80 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-4">
        <h1 className="text-lg font-semibold text-slate-900">Conversaciones</h1>
        <p className="text-xs text-slate-500">WhatsApp · Clínica Hera</p>
      </div>
      <ul className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => {
          const selected = conversation.id === selectedId;
          return (
            <li key={conversation.id}>
              <button
                type="button"
                onClick={() => onSelect(conversation.id)}
                className={`w-full border-b border-slate-100 px-4 py-3 text-left ${
                  selected ? 'bg-teal-50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-slate-900">
                    {conversation.patientName}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                      conversation.isAiActive
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {conversation.isAiActive ? 'IA' : 'Humano'}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {conversation.lastMessage}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
