import { ChatPanel } from "@/components/portal/ChatPanel";

export const dynamic = "force-dynamic";

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow text-electric-deep">Team</p>
        <h1 className="mt-2 text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold tracking-tight">Team-Chat</h1>
        <p className="text-[14px] text-steel">Kurze Abstimmung im Team – aktualisiert sich automatisch.</p>
      </header>
      <ChatPanel />
    </div>
  );
}
