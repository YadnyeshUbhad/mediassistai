import { useState, useRef, useEffect } from "react";
import { Send, Bot, Loader2, Paperclip, FileText, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { aiApi, getUser } from "@/lib/api";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

function TypingIndicator() {
  return (
    <div className="chat-bubble-ai flex items-center gap-1.5 w-fit">
      <span className="w-2 h-2 rounded-full bg-muted-foreground animate-typing-1" />
      <span className="w-2 h-2 rounded-full bg-muted-foreground animate-typing-2" />
      <span className="w-2 h-2 rounded-full bg-muted-foreground animate-typing-3" />
    </div>
  );
}

export function AIChat({ placeholder = "Ask a medical question..." }: { placeholder?: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "ai", content: "Hello! I'm your AI medical assistant. How can I help you today? You can ask me about medications, side effects, drug interactions, or general health questions." },
  ]);
  const [input, setInput]     = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentUser = getUser();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const question = input.trim();
    let displayMessage = question;
    if (attachment) {
      displayMessage = `[Attached File: ${attachment.name}]\n${question}`;
    }
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: displayMessage || "Please analyze this file." };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAttachment(null);
    setIsTyping(true);

    let finalQuestion = question;
    if (attachment && !question) {
      finalQuestion = "Analyze this report and suggest diseases or an appropriate doctor.";
    }

    try {
      const res = await aiApi.chat(question, currentUser?.role) as any;
      const answer = res.data?.answer || "I couldn't process that. Please try again.";
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "ai", content: answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "ai", content: "I'm having trouble connecting right now. Please ensure the backend server is running." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "ai" && (
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mr-2 shrink-0 mt-1">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}>
                {msg.role === "ai" ? (
                  <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mr-2 shrink-0">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <TypingIndicator />
          </div>
        )}
      </div>

      <div className="border-t border-border p-4">
        {attachment && (
          <div className="flex items-center gap-2 mb-3 bg-muted w-fit px-3 py-1.5 rounded-lg border border-border">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium max-w-[200px] truncate">{attachment.name}</span>
            <button onClick={() => setAttachment(null)} className="p-1 hover:bg-muted-foreground/20 rounded-full transition-colors ml-1">
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
        )}
        <div className="flex gap-2 items-center">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => setAttachment(e.target.files?.[0] || null)} 
            className="hidden" 
            accept=".pdf,image/*" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="p-2.5 rounded-xl bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            title="Attach a report or prescription (PDF, Image)"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={placeholder}
            rows={1}
            className="flex-1 px-4 py-2.5 rounded-xl bg-muted border-0 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          AI responses are for informational purposes only. Always consult your doctor.
        </p>
      </div>
    </div>
  );
}
