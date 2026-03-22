import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, X, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import {
  collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, setDoc
} from "firebase/firestore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Check, X as XIcon } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface ChatBoxProps {
  userId: string;
  userName: string;
}

const ChatBox = ({ userId, userName }: ChatBoxProps) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatId = userId; // one chat per user, keyed by their UID

  // Real-time listener for messages
  useEffect(() => {
    if (!chatId) return;
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [chatId]);

  const allMessages = messages;

  // Auto-scroll to bottom
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages, open]);

  // Mark unread admin messages as read when user opens chat
  useEffect(() => {
    if (open && chatId) {
      messages.forEach(async (msg) => {
        if (msg.sender === "admin" && !msg.readByUser) {
          try {
            await updateDoc(doc(db, "chats", chatId, "messages", msg.id), { readByUser: true });
          } catch (err) {
            console.error("Failed to mark message as read:", err);
          }
        }
      });
    }
  }, [open, messages, chatId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatId) return;
    setSending(true);
    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: newMessage.trim(),
        sender: "user",
        senderName: userName,
        createdAt: serverTimestamp(),
        readByAdmin: false,
        readByUser: true,
      });

      // Update the chat metadata document
      await setDoc(doc(db, "chats", chatId), {
        userId,
        userName,
        lastMessage: newMessage.trim(),
        lastMessageAt: serverTimestamp(),
        lastSender: "user",
      }, { merge: true });

      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  const handleEdit = async (msgId: string) => {
    if (!editingText.trim() || !chatId) return;
    try {
      await updateDoc(doc(db, "chats", chatId, "messages", msgId), {
        text: editingText.trim(),
        edited: true,
        editedAt: serverTimestamp(),
      });
      setEditingId(null);
      setEditingText("");
    } catch (err) {
      console.error("Failed to edit message:", err);
      toast("Failed to update message.");
    }
  };

  const handleDelete = async (msgId: string) => {
    if (!chatId) return;
    try {
      await updateDoc(doc(db, "chats", chatId, "messages", msgId), {
        text: "This message was deleted",
        deleted: true,
      });
      toast("Message deleted.");
    } catch (err) {
      console.error("Failed to delete message:", err);
      toast("Failed to delete message.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const unreadCount = allMessages.filter((m) => m.sender === "admin" && !m.readByUser).length;

  return (
    <>
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105"
        whileTap={{ scale: 0.95 }}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col"
            style={{ height: "480px" }}
          >
            <div className="bg-primary/5 border-b border-border px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-sage-light flex items-center justify-center">
                <Leaf size={16} className="text-primary" />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-foreground">Melodia Coach</h3>
                <p className="font-body text-[10px] text-muted-foreground">We typically reply within a few hours</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {allMessages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-sage-light flex items-center justify-center mx-auto mb-3">
                    <MessageCircle size={20} className="text-primary" />
                  </div>
                  <p className="font-body text-sm text-muted-foreground">
                    Start a conversation with your wellness coach!
                  </p>
                </div>
              )}

              {allMessages.map((msg) => {
                const isUser = msg.sender === "user";
                const isEditing = editingId === msg.id;
                const isDeleted = msg.deleted;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start group ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 relative ${
                        isUser
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      } ${isDeleted ? "opacity-60 italic" : ""}`}
                    >
                      {isEditing ? (
                        <div className="flex flex-col gap-2 min-w-[120px]">
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-sm font-body p-0 resize-none w-full text-primary-foreground"
                            autoFocus
                            rows={2}
                          />
                          <div className="flex justify-end gap-1">
                            <button 
                              onClick={() => handleEdit(msg.id)} 
                              className="p-1 hover:bg-white/10 rounded-md transition-colors"
                            >
                              <Check size={14} />
                            </button>
                            <button 
                              onClick={() => { setEditingId(null); setEditingText(""); }} 
                              className="p-1 hover:bg-white/10 rounded-md transition-colors"
                            >
                              <XIcon size={14} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="font-body text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                          <div className={`flex items-center gap-1.5 mt-1 ${isUser ? "justify-end text-primary-foreground/60" : "justify-start text-muted-foreground"}`}>
                            {msg.edited && !isDeleted && <span className="text-[9px] italic">(edited)</span>}
                            <p className="font-body text-[9px]">
                              {msg.createdAt?.toDate
                                ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                : "Sending…"}
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Action Menu (Only for current user's non-deleted messages) */}
                    {isUser && !isDeleted && !isEditing && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                              <MoreHorizontal size={14} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="p-1 min-w-[100px]">
                            <DropdownMenuItem 
                              className="gap-2 text-xs cursor-pointer"
                              onClick={() => { setEditingId(msg.id); setEditingText(msg.text); }}
                            >
                              <Pencil size={12} /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="gap-2 text-xs cursor-pointer text-destructive focus:text-destructive"
                              onClick={() => handleDelete(msg.id)}
                            >
                              <Trash2 size={12} /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </motion.div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-border px-4 py-3 flex items-end gap-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message…"
                rows={1}
                className="flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 max-h-24"
              />
              <Button
                size="icon"
                onClick={sendMessage}
                disabled={sending || !newMessage.trim()}
                className="rounded-xl shrink-0 w-10 h-10"
              >
                <Send size={16} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBox;
