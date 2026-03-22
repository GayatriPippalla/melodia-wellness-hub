import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, MessageSquare, Clock, CheckCircle2, 
  Send, Phone, User, ExternalLink, ChevronLeft, 
  Mail, MessageCircle, AlertCircle, Pencil, Trash2, Check, X as XIcon,
  MoreHorizontal, Eye, Star, Archive, Inbox
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { 
  collection, query, where, orderBy, onSnapshot, 
  updateDoc, doc, arrayUnion, serverTimestamp, 
  limit, addDoc, getDoc, deleteField
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

// --- Types ---

interface Message {
  id: string;
  sender: "user" | "admin";
  text: string;
  timestamp: any;
  senderName?: string;
  read?: boolean;
}

interface Conversation {
  id: string;
  userId: string;
  user_id: string; // New mandatory field
  admin_id: string; // New mandatory field
  conversation_id: string; // New mandatory field
  name?: string;
  userName?: string;
  userEmail: string;
  topic: string;
  status: "pending" | "responded" | "unread" | "read" | "replied" | "archived";
  createdAt: any;
  lastMessageAt: any;
  lastMessagePreview: string;
  messages: Message[];
  preferredTime?: string;
  message?: string; // Original first message from legacy
  adminReply?: string; // Legacy field for back-compat
  isRead?: boolean; // Legacy notification field
}

interface DiscoveryInboxProps {
  isAdmin?: boolean;
  currentUserId?: string;
  userName?: string;
}

// --- Component ---

export const DiscoveryInbox = ({ isAdmin, currentUserId, userName }: DiscoveryInboxProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "replied">("all");
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageText, setEditingMessageText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- Sync / Migrate legacy records if needed ---
  const migrateLegacyRecord = async (conv: any) => {
    // Aggressive cleanup: ensure ONLY user_id exists, remove userId/email from root
    const uidSource = conv.user_id || conv.userId;
    const needsMessages = !conv.messages || conv.messages.length === 0;
    const hasInconsistentFields = !!conv.userId || !!conv.email;
    const needsIDSync = !conv.conversation_id || !conv.admin_id;

    if (uidSource && (needsMessages || hasInconsistentFields || needsIDSync)) {
       console.log(`DiscoveryInbox [Audit]: Repairing record ${conv.id}`);
       const updateData: any = {
         user_id: uidSource,
         admin_id: "coach_melodia",
         conversation_id: conv.id
       };
       
       if (needsMessages) {
         const msgs: any[] = [];
         if (conv.message) {
           msgs.push({ id: crypto.randomUUID(), sender: "user", text: conv.message, timestamp: conv.createdAt || new Date(), read: true });
         }
         if (conv.adminReply) {
           msgs.push({ id: crypto.randomUUID(), sender: "admin", text: conv.adminReply, timestamp: conv.respondedAt || conv.createdAt || new Date(), read: true });
         }
         if (msgs.length > 0) {
           updateData.messages = msgs;
           updateData.lastMessagePreview = msgs[msgs.length - 1].text;
           updateData.lastMessageAt = msgs[msgs.length - 1].timestamp;
         }
       }

       // MANDATORY: Remove inconsistent legacy fields
       if (hasInconsistentFields) {
         updateData.userId = deleteField();
         updateData.email = deleteField();
       }

       try {
         await updateDoc(doc(db, "discovery_requests", conv.id), updateData);
       } catch (e) {
         console.error("DiscoveryInbox [AuditError]:", e);
       }
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const safetyTimer = setTimeout(() => setLoading(false), 5000);

    const initializeInbox = async () => {
      // 4. Ensure auth is loaded before query
      const authUser = auth.currentUser;
      if (!isAdmin && (!authUser?.uid || !currentUserId)) {
        console.log("DiscoveryInbox [Query]: Authentication UID not yet fully resolved.");
        return;
      }

      setLoading(true);
      const targetUid = isAdmin ? "ALL" : (currentUserId || authUser?.uid);
      console.log(`DiscoveryInbox [Query]: Executing for user_id == "${targetUid}"`);

      try {
        const colRef = collection(db, "discovery_requests");
        // 3. Fix query logic: user_id (snake_case) only, orderBy createdAt
        const q = isAdmin 
          ? query(colRef, orderBy("createdAt", "desc")) 
          : query(colRef, where("user_id", "==", targetUid), orderBy("createdAt", "desc"));

        unsubscribe = onSnapshot(q, (snapshot) => {
          if (snapshot.empty) {
            console.log("DiscoveryInbox [Query]: Result is EMPTY [0]");
          } else {
            console.log(`DiscoveryInbox [Query]: Result is DATA [${snapshot.docs.length}]`);
          }

          const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any));
          setConversations(docs);
          setLoading(false);
          setError(null);
          clearTimeout(safetyTimer);
          
          // Clean/Migrate data on each load (esp. for Admin to fix all)
          docs.forEach(d => migrateLegacyRecord(d));
        }, (err) => {
          console.error("DiscoveryInbox [SnapshotError]:", err.message);
          setError(`System Failed: ${err.message}`);
          setLoading(false);
          clearTimeout(safetyTimer);
        });
      } catch (err: any) {
        console.error("DiscoveryInbox [SetupError]:", err);
        setError("Failed to initialize system.");
        setLoading(false);
        clearTimeout(safetyTimer);
      }
    };

    initializeInbox();
    return () => { if (unsubscribe) unsubscribe(); clearTimeout(safetyTimer); };
  }, [isAdmin, currentUserId]);

  const selectedConv = conversations.find(c => c.id === selectedId);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedConv?.messages, selectedId]);

  // Mark as Read Logic (User Side - Global Clear on View)
  useEffect(() => {
    if (!isAdmin && conversations.length > 0) {
      // Logic: If user is viewing the inbox, clear all their unread notifications
      conversations.forEach(async (conv) => {
        const hasUnread = conv.messages?.some(m => m.sender === "admin" && !m.read);
        if (hasUnread) {
          // Identify unreferenced admin messages and mark as read
          const updatedMessages = conv.messages.map(m => {
            if (m.sender === "admin" && !m.read) return { ...m, read: true };
            return m;
          });

          try {
            console.log(`DiscoveryInbox [Audit]: Auto-marking unread in ${conv.id} to reset badge.`);
            await updateDoc(doc(db, "discovery_requests", conv.id), {
              messages: updatedMessages,
              isRead: true // Legacy support
            });
          } catch (err) {
            console.error("DiscoveryInbox [MarkReadError]:", err);
          }
        }
      });
    }
  }, [conversations, isAdmin]);

  const handleSendReply = async () => {
    const directUid = auth.currentUser?.uid;
    if (!directUid || !replyText.trim() || !selectedId || !selectedConv) return;
    setSending(true);
    try {
      const newMessage = {
        id: crypto.randomUUID(),
        sender: isAdmin ? "admin" : "user",
        text: replyText.trim(),
        timestamp: new Date(),
        senderName: isAdmin ? "Melodia Coach" : (userName || "User"),
        read: false
      };
      
      console.log(`DiscoveryInbox DEBUG [Audit]: Replying to ${selectedId}. Source: ${isAdmin ? "Admin" : "User"}. UID: ${directUid}`);

      await updateDoc(doc(db, "discovery_requests", selectedId), {
        messages: arrayUnion(newMessage),
        lastMessagePreview: newMessage.text,
        lastMessageAt: serverTimestamp(),
        status: isAdmin ? "responded" : "pending",
        isRead: isAdmin ? true : false, 
        user_id: selectedConv.user_id // Ensure ONLY user_id (not userId) is used at write time
      });

      setReplyText("");
    } catch (err: any) {
      console.error("DiscoveryInbox DEBUG [AuditError]:", err);
      toast.error("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await updateDoc(doc(db, "discovery_requests", id), {
        status: "archived"
      });
      setSelectedId(null);
      toast.success("Conversation archived");
    } catch (err) {
      console.error("DiscoveryInbox [ArchiveError]:", err);
      toast.error("Failed to archive conversation");
    }
  };

  const handleDeletePermanent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this conversation? This action cannot be undone.")) return;
    try {
      await updateDoc(doc(db, "discovery_requests", id), {
        deleted: true
      });
      setSelectedId(null);
      toast.success("Conversation deleted");
    } catch (err) {
      console.error("DiscoveryInbox [DeleteError]:", err);
      toast.error("Failed to delete conversation");
    }
  };

  const handleMarkUnread = async (id: string) => {
    try {
      await updateDoc(doc(db, "discovery_requests", id), {
        status: "pending",
        isRead: false // Mark for user/general unread state
      });
      toast.success("Marked as unread");
    } catch (err) {
      console.error("DiscoveryInbox [UnreadError]:", err);
      toast.error("Failed to update status");
    }
  };

  const handleEditMessage = async (messageId: string) => {
    if (!selectedId || !selectedConv || !editingMessageText.trim()) return;
    
    const updatedMessages = selectedConv.messages.map(m => {
      if (m.id === messageId) {
        return { 
          ...m, 
          text: editingMessageText.trim(), 
          edited: true, 
          editedAt: new Date() 
        };
      }
      return m;
    });

    try {
      await updateDoc(doc(db, "discovery_requests", selectedId), {
        messages: updatedMessages,
        lastMessagePreview: updatedMessages[updatedMessages.length - 1].text
      });
      setEditingMessageId(null);
      setEditingMessageText("");
      toast.success("Message updated");
    } catch (err) {
      console.error("DiscoveryInbox [EditError]:", err);
      toast.error("Failed to update message.");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!selectedId || !selectedConv) return;

    const updatedMessages = selectedConv.messages.map(m => {
      if (m.id === messageId) {
        return { 
          ...m, 
          text: "This message was deleted", 
          deleted: true 
        };
      }
      return m;
    });

    try {
      await updateDoc(doc(db, "discovery_requests", selectedId), {
        messages: updatedMessages,
        lastMessagePreview: updatedMessages[updatedMessages.length - 1].text
      });
      toast.success("Message marked as deleted");
    } catch (err) {
      console.error("DiscoveryInbox [DeleteError]:", err);
      toast.error("Failed to delete message.");
    }
  };

  const filteredConversations = conversations.filter(c => {
    // Exclude archived and deleted records from active view
    if (c.status === "archived" || (c as any).deleted === true) return false;

    const matchesSearch = 
      c.userName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessagePreview?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "unread") {
      // Unread logic: if user side, check if last msg is admin and not read. If admin side, check if last is user and not responded.
      if (isAdmin) return matchesSearch && c.status === "pending";
      // Simplification for unread: if legacy isRead is false and status is responded (on user side)
      return matchesSearch && (c.isRead === false && c.status === "responded");
    }
    if (filter === "replied") {
      return matchesSearch && c.status === "responded";
    }
    return matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "responded": return <CheckCircle2 size={12} className="text-green-500" />;
      case "pending": return <Clock size={12} className="text-amber-500" />;
      default: return <AlertCircle size={12} className="text-muted-foreground" />;
    }
  };

  const renderLinkedText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:text-primary/80 break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const formatTimestamp = (ts: any) => {
    if (!ts) return "";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const now = new Date();
    if (format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')) {
      return format(date, 'h:mm a');
    }
    return format(date, 'MMM d');
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-red-50/50 border border-red-100 rounded-3xl h-[400px] text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertCircle size={32} className="text-red-500" />
        </div>
        <h3 className="font-display text-xl font-semibold text-red-900 mb-2">Failed to load inbox</h3>
        <p className="font-body text-sm text-red-700 max-w-sm mx-auto mb-6">
          {error}. Please check your connection or try refreshing the sanctuary.
        </p>
        <Button 
          variant="outline" 
          className="rounded-full border-red-200 text-red-700 hover:bg-red-50"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <Phone size={32} className="text-primary mx-auto mb-3 animate-pulse" />
          <p className="font-body text-muted-foreground">Loading your inbox...</p>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card border border-border rounded-3xl h-[400px] text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
          <MessageCircle size={32} className="text-primary opacity-20" />
        </div>
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">No messages yet</h3>
        <p className="font-body text-sm text-muted-foreground max-w-sm mx-auto">
          {isAdmin 
            ? "There are currently no discovery call requests in the system. They will appear here as soon as users book them." 
            : "Your discovery call conversations will appear here once you book a call or receive a response from your coach."}
        </p>
        {!isAdmin && (
          <Button 
            variant="outline" 
            className="mt-6 rounded-full"
            onClick={() => window.location.href = "/discovery-call"}
          >
            Book a Discovery Call
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col md:flex-row h-[700px] bg-card border border-border rounded-3xl overflow-hidden shadow-sm",
      "transition-all duration-500 ease-in-out"
    )}>
      {/* --- Sidebar (Inbox List) --- */}
      <div className={cn(
        "w-full md:w-[320px] lg:w-[380px] border-r border-border flex flex-col bg-background/50 backdrop-blur-sm",
        selectedId && "hidden md:flex" // Hide on mobile when thread is open
      )}>
        <div className="p-4 border-b border-border bg-background/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold flex items-center gap-2">
              <Inbox size={20} className="text-primary" /> Inbox
            </h2>
            <div className="flex gap-1">
               <Button 
                variant={filter === "all" ? "secondary" : "ghost"} 
                size="sm" 
                className="h-7 text-[10px] rounded-full" 
                onClick={() => setFilter("all")}
               >
                 All
               </Button>
               <Button 
                variant={filter === "unread" ? "secondary" : "ghost"} 
                size="sm" 
                className="h-7 text-[10px] rounded-full"
                onClick={() => setFilter("unread")}
               >
                 Unread
               </Button>
            </div>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search conversations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs rounded-full bg-background/50 border-border/50 focus:ring-primary/20"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <MessageSquare size={32} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm font-body">No conversations found.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {filteredConversations.map((conv) => {
                const isUnread = isAdmin ? (conv.status === "pending") : (conv.isRead === false && conv.status === "responded");
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedId(conv.id)}
                    className={cn(
                      "w-full p-4 text-left transition-all hover:bg-primary/5 flex gap-3 relative overflow-hidden group",
                      selectedId === conv.id ? "bg-primary/[0.08] shadow-inner" : "transparent"
                    )}
                  >
                    {selectedId === conv.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0 border border-border/50">
                      <User size={18} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className={cn(
                          "font-display text-sm truncate max-w-[140px]",
                          isUnread ? "font-bold text-foreground" : "font-medium text-foreground/80"
                        )}>
                          {isAdmin ? (conv.name || conv.userName || "User") : conv.topic}
                        </span>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {formatTimestamp(conv.lastMessageAt || conv.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-1 text-[10px]">
                        <span className="font-body text-muted-foreground italic tracking-wider">
                          {isAdmin ? (conv.topic || "Discussion") : "Wellness Coach"}
                        </span>
                        {conv.status && (
                          <span className="flex items-center gap-1">
                             {getStatusIcon(conv.status)}
                          </span>
                        )}
                      </div>
                      <p className={cn(
                        "text-xs truncate font-body",
                        isUnread ? "font-semibold text-foreground/90" : "text-muted-foreground"
                      )}>
                        {conv.lastMessagePreview || "No messages yet"}
                      </p>
                    </div>
                    {isUnread && (
                      <div className="w-2 h-2 rounded-full bg-primary self-center ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* --- Main Content (Conversation View) --- */}
      <div className={cn(
        "flex-1 flex flex-col bg-background/50 relative z-10 isolate",
        !selectedId && "hidden md:flex" // Hide on mobile if no thread selected
      )}>
        {selectedConv ? (
          <>
            {/* Thread Header */}
            <div className="p-4 border-b border-border bg-background/30 flex items-center justify-between relative z-50">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden rounded-full" 
                  onClick={() => setSelectedId(null)}
                >
                  <ChevronLeft size={20} />
                </Button>
                <div>
                  <h3 className="font-display font-semibold text-base text-foreground leading-tight">
                    {selectedConv.topic}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="font-body text-xs text-muted-foreground">
                      {isAdmin ? selectedConv.userEmail : "Melodia Wellness Coach"}
                    </p>
                    <Badge variant="outline" className="h-4 text-[9px] px-1.5 uppercase font-medium bg-background border-border/50">
                      {selectedConv.status}
                    </Badge>
                  </div>
                </div>
              </div>
              {isAdmin && (
                <div className="flex gap-2 relative z-[1000] pointer-events-auto">
                   <Button 
                     variant="outline" 
                     size="icon" 
                     className="h-8 w-8 rounded-full border-border/50 hover:bg-red-50 hover:text-red-500 transition-colors"
                     onClick={() => handleArchive(selectedId!)}
                     title="Archive"
                   >
                     <Archive size={14} />
                   </Button>
                   
                   <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                       <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-full border-border/50"
                        >
                         <MoreHorizontal size={14} className="text-muted-foreground" />
                       </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="w-40 p-1">
                       <DropdownMenuItem 
                         className="text-xs gap-2 py-2 cursor-pointer"
                         onClick={() => handleMarkUnread(selectedId!)}
                       >
                          <Clock size={12} /> Mark unread
                       </DropdownMenuItem>
                       <DropdownMenuItem 
                         className="text-xs gap-2 py-2 cursor-pointer"
                         onClick={() => handleArchive(selectedId!)}
                       >
                          <Archive size={12} /> Archive
                       </DropdownMenuItem>
                       <div className="h-px bg-border my-1" />
                       <DropdownMenuItem 
                         className="text-xs gap-2 py-2 cursor-pointer text-destructive focus:text-destructive"
                         onClick={() => handleDeletePermanent(selectedId!)}
                       >
                          <Trash2 size={12} /> Delete thread
                       </DropdownMenuItem>
                     </DropdownMenuContent>
                   </DropdownMenu>
                </div>
               )}
            </div>

            {/* Message List */}
            <ScrollArea className="flex-1 p-6 bg-background/[0.02] relative z-0" ref={scrollRef}>
              <div className="space-y-8">
              {/* Legacy context if any */}
              {selectedConv.preferredTime && (
                <div className="flex justify-center">
                  <div className="px-4 py-2 rounded-full bg-accent/10 border border-accent/20 flex items-center gap-2">
                    <Clock size={12} className="text-primary" />
                    <span className="font-body text-[10px] text-primary/80 uppercase font-semibold">
                      Preferred Time: {selectedConv.preferredTime}
                    </span>
                  </div>
                </div>
              )}

              {selectedConv.messages?.map((msg, i) => {
                const isMe = isAdmin ? (msg.sender === "admin") : (msg.sender === "user");
                const showAvatar = i === 0 || selectedConv.messages[i-1].sender !== msg.sender;
                
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-4 group/msg",
                      isMe ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-border/50 transition-transform group-hover/msg:scale-110",
                      isMe ? "bg-primary text-primary-foreground" : "bg-accent/20 text-primary",
                      !showAvatar && "invisible"
                    )}>
                      {isMe ? <Star size={14} /> : <User size={14} />}
                    </div>
                    
                    <div className={cn(
                      "max-w-[85%] md:max-w-[70%] relative flex items-start gap-2",
                      isMe ? "flex-row-reverse text-right" : "flex-row text-left"
                    )}>
                      <div className="flex-1">
                        {!isMe && showAvatar && (
                          <p className="font-display text-[11px] font-bold text-muted-foreground mb-1 ml-1 uppercase tracking-tight">
                            {msg.senderName || (isAdmin ? "The User" : "Coach")}
                          </p>
                        )}
                        {isMe && showAvatar && (
                          <p className="font-display text-[11px] font-bold text-primary mb-1 mr-1 uppercase tracking-tight text-right">
                            You
                          </p>
                        )}
                        
                        <div className={cn(
                          "rounded-3xl px-5 py-3 shadow-sm border transition-all duration-300 relative",
                          isMe 
                            ? "bg-primary text-primary-foreground border-primary rounded-tr-sm" 
                            : "bg-background text-foreground border-border/50 rounded-tl-sm hover:shadow-md",
                          msg.deleted && "opacity-60 italic"
                        )}>
                          {editingMessageId === msg.id ? (
                            <div className="flex flex-col gap-2 min-w-[200px]">
                              <textarea
                                value={editingMessageText}
                                onChange={(e) => setEditingMessageText(e.target.value)}
                                className="bg-transparent border-none focus:ring-0 text-sm font-body p-0 resize-none w-full text-primary-foreground"
                                autoFocus
                                rows={3}
                              />
                              <div className="flex justify-end gap-1">
                                <button 
                                  onClick={() => handleEditMessage(msg.id)} 
                                  className="p-1 hover:bg-white/10 rounded-md transition-colors"
                                >
                                  <Check size={14} />
                                </button>
                                <button 
                                  onClick={() => { setEditingMessageId(null); setEditingMessageText(""); }} 
                                  className="p-1 hover:bg-white/10 rounded-md transition-colors"
                                >
                                  <XIcon size={14} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="font-body text-sm leading-relaxed whitespace-pre-wrap">
                              {renderLinkedText(msg.text)}
                            </div>
                          )}
                        </div>
                        
                        <div className={cn(
                          "flex items-center gap-2 mt-1.5 opacity-60 px-1",
                          isMe ? "justify-end text-right" : "justify-start text-left"
                        )}>
                          {(msg as any).edited && !msg.deleted && <span className="text-[9px] italic font-body">(edited)</span>}
                          <p className="font-body text-[9px] text-muted-foreground">
                            {formatTimestamp(msg.timestamp)}
                          </p>
                        </div>
                      </div>

                      {/* Action Menu - Only for own messages that aren't deleted */}
                      {isMe && !msg.deleted && editingMessageId !== msg.id && (
                        <div className="opacity-0 group-hover/msg:opacity-100 transition-opacity mt-6 shrink-0">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                                <MoreHorizontal size={14} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align={isAdmin ? "start" : "end"} className="p-1 min-w-[100px]">
                              <DropdownMenuItem 
                                className="gap-2 text-xs cursor-pointer"
                                onClick={() => { setEditingMessageId(msg.id); setEditingMessageText(msg.text); }}
                              >
                                <Pencil size={12} /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="gap-2 text-xs cursor-pointer text-destructive focus:text-destructive"
                                onClick={() => handleDeleteMessage(msg.id)}
                              >
                                <Trash2 size={12} /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
              </div>
            </ScrollArea>

            {/* Reply Input */}
            <div className="p-4 border-t border-border bg-background/30">
              <div className="max-w-4xl mx-auto flex flex-col gap-3">
                <div className="relative group">
                  <Textarea
                    placeholder="Type your reply here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-[100px] rounded-2xl bg-background border-border/50 focus:ring-primary/20 resize-none pr-12 transition-all group-hover:border-primary/30"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        handleSendReply();
                      }
                    }}
                  />
                  <div className="absolute right-3 bottom-3 flex items-center gap-2">
                    <span className="hidden md:inline-block text-[10px] text-muted-foreground opacity-0 group-focus-within:opacity-100 transition-opacity">
                      Ctrl + Enter to send
                    </span>
                    <Button 
                      size="icon" 
                      onClick={handleSendReply}
                      disabled={sending || !replyText.trim()}
                      className="rounded-full shadow-lg"
                    >
                      <Send size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-background/20 backdrop-blur-[2px]">
            <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
              <Mail size={32} className="opacity-20 text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground/80 mb-2">Select a Conversation</h3>
            <p className="font-body text-sm max-w-xs mx-auto">
              Choose a discovery call request from the list to view all messages and reply.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
