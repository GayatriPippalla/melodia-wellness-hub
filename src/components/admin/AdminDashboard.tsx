import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  LogOut, Sparkles, MessageSquare, Mail, Users,
  Plus, Trash2, Eye, EyeOff, RefreshCw, CheckCircle2, XCircle, Clock, UserCheck,
  Send, PhoneCall, MessageCircle, FileUp, File, Video, X, Loader2,
  Pencil, MoreHorizontal, Check
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/sonner";
import { DiscoveryInbox } from "../discovery/DiscoveryInbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth, db, storage } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import emailjs from "@emailjs/browser";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc,
  query, orderBy, serverTimestamp, onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

type Category = "quotes" | "affirmations" | "stories" | "tips" | "appreciations";
const categories: Category[] = ["quotes", "affirmations", "stories", "tips", "appreciations"];

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  // --- Motivation Posts ---
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState({ category: "quotes" as Category, title: "", content: "", author: "" });
  const [postsLoading, setPostsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ url: string, type: string, name: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast("File is too large (max 10MB).");
      return;
    }

    setIsUploading(true);
    try {
      const fileRef = ref(storage, `motivation_posts/${crypto.randomUUID()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      
      let type = "other";
      if (file.type.startsWith("image/")) type = "image";
      else if (file.type.startsWith("video/")) type = "video";
      else if (file.type === "application/pdf") type = "pdf";
      else if (file.type.startsWith("audio/")) type = "audio";

      setAttachedFile({
        url,
        type,
        name: file.name
      });
      toast("File uploaded successfully.");
    } catch (error) {
      console.error(error);
      toast("Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
  };

  const fetchPosts = async () => {
    setPostsLoading(true);
    const q = query(collection(db, "motivation_posts"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setPostsLoading(false);
  };

  const addPost = async () => {
    if (!newPost.title || (!newPost.content && !attachedFile)) { toast("Please provide either content or a file."); return; }
    try {
      await addDoc(collection(db, "motivation_posts"), {
        category: newPost.category,
        title: newPost.title,
        content: newPost.content,
        author: newPost.author || null,
        file_url: attachedFile?.url || null,
        file_type: attachedFile?.type || null,
        file_name: attachedFile?.name || null,
        createdAt: serverTimestamp(),
      });
      toast("Post added!");
      setNewPost({ category: "quotes", title: "", content: "", author: "" });
      setAttachedFile(null);
      fetchPosts();
    } catch (error) {
      toast("Failed to add post.");
      console.error(error);
    }
  };

  const deletePost = async (id: string) => {
    await deleteDoc(doc(db, "motivation_posts", id));
    toast("Post deleted.");
    fetchPosts();
  };

  // --- Assessments ---
  const [assessments, setAssessments] = useState<any[]>([]);
  const [assessLoading, setAssessLoading] = useState(true);

  const fetchAssessments = async () => {
    setAssessLoading(true);
    const q = query(collection(db, "wellness_assessments"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setAssessments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setAssessLoading(false);
  };

  // --- Newsletter ---

  // --- Newsletter ---
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [subsLoading, setSubsLoading] = useState(true);

  // --- User Profiles ---
  const [profiles, setProfiles] = useState<any[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(true);

  const fetchProfiles = async () => {
    setProfilesLoading(true);
    const q = query(collection(db, "users"));
    const snap = await getDocs(q);
    setProfiles(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setProfilesLoading(false);
  };

  const updateUserStatus = async (id: string, status: "approved" | "rejected") => {
    await updateDoc(doc(db, "users", id), { status });
    toast(`User ${status}.`);
    fetchProfiles();
  };

  // --- Discovery Requests (Real-time) ---
  const [discoveryRequests, setDiscoveryRequests] = useState<any[]>([]);
  const [discoveryLoading, setDiscoveryLoading] = useState(true);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [replyingId, setReplyingId] = useState<string | null>(null);

  const sendReply = async (id: string) => {
    const reply = replyTexts[id];
    if (!reply?.trim()) { toast("Please write a reply."); return; }
    
    // Find the request to get userId/email
    const request = discoveryRequests.find(r => r.id === id);
    if (!request) { toast("Request not found."); return; }

    try {
      await updateDoc(doc(db, "discovery_requests", id), {
        adminReply: reply.trim(),
        status: "responded",
        respondedAt: serverTimestamp(),
        isRead: false, // Ensure it's marked as unread for the notification system
      });

      toast("Reply sent! User will see it on their dashboard.");
      setReplyTexts((prev) => ({ ...prev, [id]: "" }));
      setReplyingId(null);
    } catch (err) {
      toast("Failed to send reply.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchAssessments();
    fetchProfiles();

    // Subscribers listener
    const unsubSubs = onSnapshot(query(collection(db, "newsletter_subscribers"), orderBy("subscribedAt", "desc")), (snapshot) => {
      setSubscribers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setSubsLoading(false);
    }, (error) => {
      console.error("Subscribers listener error:", error);
      setSubsLoading(false);
    });

    // Discovery requests listener
    const qDiscovery = query(collection(db, "discovery_requests"), orderBy("createdAt", "desc"));
    const unsubDiscovery = onSnapshot(qDiscovery, (snapshot) => {
      setDiscoveryRequests(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setDiscoveryLoading(false);
    }, (error) => {
      console.error("Discovery requests listener error:", error);
      setDiscoveryLoading(false);
    });

    return () => {
      unsubSubs();
      unsubDiscovery();
    };
  }, []);

  // Auto-sync userId for discovery requests that are missing it (fix for historical records)
  useEffect(() => {
    if (discoveryRequests.length > 0 && profiles.length > 0) {
      const missingUserId = discoveryRequests.filter(r => !r.userId && r.email);
      if (missingUserId.length > 0) {
        missingUserId.forEach(async (r) => {
          const profile = profiles.find(p => p.email?.toLowerCase().trim() === r.email.toLowerCase().trim());
          if (profile) {
            console.log(`Syncing userId ${profile.id} to discovery request ${r.id}`);
            try {
              await updateDoc(doc(db, "discovery_requests", r.id), { userId: profile.id });
            } catch (err) {
              console.error("Failed to sync userId:", err);
            }
          }
        });
      }
    }
  }, [discoveryRequests.length, profiles.length]);

  // --- Live Chat (Admin) ---
  const [activeChats, setActiveChats] = useState<any[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [adminReplyText, setAdminReplyText] = useState("");
  const [chatsLoading, setChatsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [newsletterSubject, setNewsletterSubject] = useState("");
  const [newsletterContent, setNewsletterContent] = useState("");
  const [isSendingNewsletter, setIsSendingNewsletter] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen for all active chats
    const q = query(collection(db, "chats"), orderBy("lastMessageAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setActiveChats(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setChatsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!selectedChatId) {
      setChatMessages([]);
      return;
    }
    // Listen for messages in the selected chat
    const q = query(collection(db, "chats", selectedChatId, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChatMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [selectedChatId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendAdminReply = async () => {
    if (!selectedChatId || !adminReplyText.trim()) return;
    try {
      await addDoc(collection(db, "chats", selectedChatId, "messages"), {
        text: adminReplyText.trim(),
        sender: "admin",
        senderName: "Melodia Coach",
        createdAt: serverTimestamp(),
        readByAdmin: true,
        readByUser: false,
      });

      await updateDoc(doc(db, "chats", selectedChatId), {
        lastMessage: adminReplyText.trim(),
        lastMessageAt: serverTimestamp(),
        lastSender: "admin",
      });

      setAdminReplyText("");
    } catch (err) {
      toast("Failed to send reply.");
      console.error(err);
    }
  };

  const handleAdminEdit = async (msgId: string) => {
    if (!selectedChatId || !editingText.trim()) return;
    try {
      await updateDoc(doc(db, "chats", selectedChatId, "messages", msgId), {
        text: editingText.trim(),
        edited: true,
        editedAt: serverTimestamp(),
      });
      setEditingId(null);
      setEditingText("");
    } catch (err) {
      toast("Failed to update message.");
      console.error(err);
    }
  };

  const handleAdminDelete = async (msgId: string) => {
    if (!selectedChatId) return;
    try {
      await updateDoc(doc(db, "chats", selectedChatId, "messages", msgId), {
        text: "This message was deleted",
        deleted: true,
      });
      toast("Message deleted.");
    } catch (err) {
      toast("Failed to delete message.");
      console.error(err);
    }
  };

  const handleSendNewsletter = async () => {
    const activeSubs = subscribers.filter(s => s.status === "active" || s.subscribed === true);
    if (activeSubs.length === 0) {
      toast("No active subscribers to send to.");
      return;
    }
    if (!newsletterSubject.trim() || !newsletterContent.trim()) {
      toast("Please provide both subject and content.");
      return;
    }

    // EmailJS Credentials - user should replace these
    const SERVICE_ID = "service_newsletter"; 
    const TEMPLATE_ID = "template_newsletter"; 
    const PUBLIC_KEY = "YOUR_PUBLIC_KEY";

    setIsSendingNewsletter(true);
    let successCount = 0;
    let failCount = 0;

    for (const sub of activeSubs) {
      try {
        const unsubscribeLink = `${window.location.origin}/unsubscribe?email=${encodeURIComponent(sub.email)}`;
        await emailjs.send(
          SERVICE_ID,
          TEMPLATE_ID,
          {
            to_email: sub.email,
            subject: newsletterSubject,
            message: newsletterContent,
            unsubscribe_link: unsubscribeLink,
          },
          PUBLIC_KEY
        );
        successCount++;
      } catch (err) {
        console.error(`Failed to send to ${sub.email}:`, err);
        failCount++;
      }
    }

    setIsSendingNewsletter(false);
    toast(`Newsletter sent successfully to ${successCount} subscribers. ${failCount > 0 ? `${failCount} failed.` : ""}`);
    setNewsletterSubject("");
    setNewsletterContent("");
  };

  // Mark messages as read by admin when chat is selected
  useEffect(() => {
    if (selectedChatId && chatMessages.length > 0) {
      chatMessages.forEach(async (msg) => {
        if (msg.sender === "user" && !msg.readByAdmin) {
          await updateDoc(doc(db, "chats", selectedChatId, "messages", msg.id), { readByAdmin: true });
        }
      });
    }
  }, [selectedChatId, chatMessages]);

  const handleLogout = async () => {
    await signOut(auth);
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <h1 className="font-display text-xl md:text-2xl font-semibold text-foreground">Melodia Admin</h1>
          <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full gap-2 text-xs">
            <LogOut size={14} /> Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-8 py-8">
        <Tabs defaultValue="users">
          <TabsList className="mb-8 flex flex-wrap">
            <TabsTrigger value="users" className="gap-1.5"><UserCheck size={14} /> Users</TabsTrigger>
            <TabsTrigger value="chats" className="gap-1.5">
              <MessageCircle size={14} /> 
              Chats 
              {activeChats.some(c => c.lastSender === "user" && activeChats.find(ac => ac.id === c.id)?.unreadCount > 0) && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </TabsTrigger>
            <TabsTrigger value="discovery" className="gap-1.5"><PhoneCall size={14} /> Discovery</TabsTrigger>
            <TabsTrigger value="posts" className="gap-1.5"><Sparkles size={14} /> Posts</TabsTrigger>
            <TabsTrigger value="assessments" className="gap-1.5"><Users size={14} /> Assessments</TabsTrigger>
            <TabsTrigger value="subscribers" className="gap-1.5"><Mail size={14} /> Subscribers</TabsTrigger>
          </TabsList>

          {/* ===== USERS TAB ===== */}
          <TabsContent value="users">
            <div className="flex items-center justify-between mb-4">
              <p className="font-body text-sm text-muted-foreground">
                {profiles.length} users ({profiles.filter(p => p.status === "pending").length} pending)
              </p>
              <Button variant="ghost" size="sm" onClick={fetchProfiles}><RefreshCw size={14} /></Button>
            </div>
            {profilesLoading ? (
              <p className="font-body text-muted-foreground text-center py-8">Loading…</p>
            ) : profiles.length === 0 ? (
              <p className="font-body text-muted-foreground text-center py-8">No users yet.</p>
            ) : (
              <div className="space-y-3">
                {profiles.map((p) => (
                  <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className={`rounded-xl border bg-card p-5 ${p.status === "pending" ? "border-amber-300/50" : "border-border"}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-display text-sm font-semibold text-foreground">{p.fullName}</h4>
                          <Badge
                            variant={p.status === "approved" ? "default" : p.status === "pending" ? "secondary" : "destructive"}
                            className="text-[10px] uppercase"
                          >
                            {p.status === "pending" && <Clock size={10} className="mr-1" />}
                            {p.status === "approved" && <CheckCircle2 size={10} className="mr-1" />}
                            {p.status === "rejected" && <XCircle size={10} className="mr-1" />}
                            {p.status}
                          </Badge>
                        </div>
                        <p className="font-body text-xs text-muted-foreground">{p.email}</p>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs font-body">
                          <div className="bg-muted rounded-lg p-2">
                            <span className="text-muted-foreground">Stress:</span>{" "}
                            <span className="font-medium text-foreground">{p.stressLevel}/10</span>
                          </div>
                          <div className="bg-muted rounded-lg p-2">
                            <span className="text-muted-foreground">Joined:</span>{" "}
                            <span className="font-medium text-foreground">{p.createdAt?.toDate ? new Date(p.createdAt.toDate()).toLocaleDateString() : "N/A"}</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="font-body text-[10px] text-muted-foreground">Goal:</span>
                          <p className="font-body text-xs text-foreground line-clamp-2">{p.wellnessGoal}</p>
                        </div>
                      </div>
                      {p.status === "pending" && (
                        <div className="flex flex-col gap-2 shrink-0">
                          <Button size="sm" className="rounded-full gap-1 text-xs" onClick={() => updateUserStatus(p.id, "approved")}>
                            <CheckCircle2 size={12} /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-full gap-1 text-xs text-destructive" onClick={() => updateUserStatus(p.id, "rejected")}>
                            <XCircle size={12} /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ===== POSTS TAB ===== */}
          <TabsContent value="posts">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Add form */}
              <div className="lg:col-span-1 rounded-2xl border border-border bg-card p-6 h-fit space-y-4">
                <h3 className="font-display text-lg font-semibold text-foreground">Add Post</h3>
                <div>
                  <label className="font-body text-xs text-muted-foreground mb-1 block">Category</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value as Category })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body"
                  >
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs text-muted-foreground mb-1 block">Title</label>
                  <Input value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} className="font-body" />
                </div>
                <div>
                  <label className="font-body text-xs text-muted-foreground mb-1 block">Content</label>
                  <div className="space-y-4">
                    <div className="relative group">
                      <Textarea 
                        value={newPost.content} 
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} 
                        className="font-body min-h-[120px] pb-10 resize-none focus-visible:ring-primary/20 transition-all border-border/60" 
                        placeholder="Share something inspiring..."
                      />
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                        <div className="flex gap-1.5 pointer-events-auto">
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                          >
                            <FileUp size={14} />
                          </Button>
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                          >
                            <Sparkles size={14} />
                          </Button>
                        </div>
                        <span className="text-[10px] text-muted-foreground/60 font-body pr-1 uppercase tracking-wider">Content Editor</span>
                      </div>
                    </div>

                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      className="hidden" 
                      accept="image/*,video/*,application/pdf,audio/*"
                    />
                    
                    {attachedFile && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative rounded-2xl border border-primary/20 bg-primary/5 p-3 flex items-center gap-4 group/preview overflow-hidden"
                      >
                        <div className="w-14 h-14 rounded-xl bg-background flex items-center justify-center border border-border/50 overflow-hidden shadow-sm shrink-0">
                          {attachedFile.type === 'image' && (
                            <img src={attachedFile.url} alt="Preview" className="w-full h-full object-cover" />
                          )}
                          {attachedFile.type === 'video' && (
                            <div className="relative w-full h-full flex items-center justify-center">
                              <video src={attachedFile.url} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <Video size={16} className="text-white" />
                              </div>
                            </div>
                          )}
                          {attachedFile.type === 'pdf' && <File size={24} className="text-red-500" />}
                          {attachedFile.type === 'audio' && <MessageSquare size={24} className="text-primary" />}
                          {(!['image', 'video', 'pdf', 'audio'].includes(attachedFile.type)) && <File size={24} className="text-primary" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{attachedFile.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{attachedFile.type} File Attached</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shadow-none"
                          onClick={() => setAttachedFile(null)}
                        >
                          <X size={16} />
                        </Button>
                      </motion.div>
                    )}

                    {isUploading && (
                      <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-6 flex flex-col items-center justify-center gap-3 animate-pulse">
                        <Loader2 size={24} className="animate-spin text-primary" />
                        <p className="text-xs font-medium text-primary uppercase tracking-widest">Uploading to secure storage...</p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="font-body text-xs text-muted-foreground mb-1 block">Author (optional)</label>
                  <Input value={newPost.author} onChange={(e) => setNewPost({ ...newPost, author: e.target.value })} className="font-body" />
                </div>
                <Button 
                  onClick={addPost} 
                  disabled={isUploading}
                  className="w-full rounded-full gap-2"
                >
                  <Plus size={14} /> 
                  Publish Post
                </Button>
              </div>

              {/* Posts list */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-body text-sm text-muted-foreground">{posts.length} posts</p>
                  <Button variant="ghost" size="sm" onClick={fetchPosts}><RefreshCw size={14} /></Button>
                </div>
                {postsLoading ? (
                  <p className="font-body text-muted-foreground text-center py-8">Loading…</p>
                ) : posts.length === 0 ? (
                  <p className="font-body text-muted-foreground text-center py-8">No posts yet.</p>
                ) : (
                  posts.map((post) => (
                    <motion.div key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border bg-card p-4 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-[10px] uppercase">{post.category}</Badge>
                          <span className="font-body text-[10px] text-muted-foreground">{post.createdAt?.toDate ? new Date(post.createdAt.toDate()).toLocaleDateString() : ""}</span>
                        </div>
                        <h4 className="font-display text-sm font-semibold text-foreground truncate">{post.title}</h4>
                        <p className="font-body text-xs text-muted-foreground line-clamp-2">{post.content}</p>
                        {post.file_url && (
                          <div className="mt-2">
                            {post.file_type === 'image' ? (
                              <img src={post.file_url} alt="Post media" className="w-20 h-20 rounded-lg object-cover border border-border shadow-sm" />
                            ) : (
                              <div className="flex items-center gap-2 text-[10px] text-primary bg-primary/5 px-3 py-1.5 rounded-full w-fit border border-primary/10">
                                {post.file_type === 'video' ? <Video size={12} /> : post.file_type === 'pdf' ? <File size={12} className="text-red-500" /> : <File size={12} />}
                                <span className="font-medium truncate max-w-[150px]">{post.file_name || 'Attached File'}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deletePost(post.id)} className="shrink-0 text-destructive hover:text-destructive">
                        <Trash2 size={14} />
                      </Button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* ===== ASSESSMENTS TAB ===== */}
          <TabsContent value="assessments">
            <div className="flex items-center justify-between mb-4">
              <p className="font-body text-sm text-muted-foreground">{assessments.length} submissions</p>
              <Button variant="ghost" size="sm" onClick={fetchAssessments}><RefreshCw size={14} /></Button>
            </div>
            {assessLoading ? (
              <p className="font-body text-muted-foreground text-center py-8">Loading…</p>
            ) : assessments.length === 0 ? (
              <p className="font-body text-muted-foreground text-center py-8">No assessments yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {assessments.map((a) => (
                  <div key={a.id} className="rounded-xl border border-border bg-card p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-sm font-semibold text-foreground">{a.name}</h4>
                      <span className="font-body text-[10px] text-muted-foreground">{a.createdAt?.toDate ? new Date(a.createdAt.toDate()).toLocaleDateString() : ""}</span>
                    </div>
                    <p className="font-body text-xs text-muted-foreground">{a.email}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs font-body">
                      <div className="bg-muted rounded-lg p-2">
                        <span className="text-muted-foreground">Stress:</span> <span className="font-medium text-foreground">{a.stressLevel}/10</span>
                      </div>
                      <div className="bg-muted rounded-lg p-2">
                        <span className="text-muted-foreground">Sleep:</span> <span className="font-medium text-foreground">{a.sleepQuality}</span>
                      </div>
                      <div className="bg-muted rounded-lg p-2 col-span-2">
                        <span className="text-muted-foreground">Balance:</span> <span className="font-medium text-foreground">{a.workLifeBalance}</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-body text-[10px] text-muted-foreground">Goal:</span>
                      <p className="font-body text-xs text-foreground">{a.mainGoal}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>


          {/* ===== SUBSCRIBERS TAB ===== */}
          <TabsContent value="subscribers">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Subscriber List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold text-lg">Newsletter List</h3>
                  <div className="flex items-center gap-2">
                    <p className="font-body text-xs text-muted-foreground mr-2">{subscribers.length} total subscribers</p>
                  </div>
                </div>
                {subsLoading ? (
                  <p className="font-body text-muted-foreground text-center py-8">Loading…</p>
                ) : subscribers.length === 0 ? (
                  <p className="font-body text-muted-foreground text-center py-8">No subscribers yet.</p>
                ) : (
                  <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <table className="w-full text-sm font-body">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Email</th>
                          <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Status</th>
                          <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Subscribed On</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribers.map((s) => (
                          <tr key={s.id} className="border-t border-border">
                            <td className="px-4 py-3 text-foreground font-medium">{s.email}</td>
                            <td className="px-4 py-3">
                              <Badge variant={s.status === "active" ? "default" : "secondary"} className="text-[10px] uppercase font-semibold">
                                {s.status || (s.subscribed ? "active" : "inactive")}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground text-xs">
                              {(s.subscribedAt || s.createdAt)?.toDate ? new Date((s.subscribedAt || s.createdAt).toDate()).toLocaleDateString() : ""}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Send Newsletter Form */}
              <div className="lg:col-span-1 border rounded-2xl p-6 bg-card h-fit sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="text-primary" size={20} />
                  <h3 className="font-display font-semibold text-lg text-foreground">Send Campaign</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Subject</label>
                    <Input 
                      placeholder="Newsletter Subject" 
                      value={newsletterSubject}
                      onChange={(e) => setNewsletterSubject(e.target.value)}
                      className="font-body text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Content</label>
                    <Textarea 
                      placeholder="Write your wellness tips here..." 
                      className="min-h-[200px] font-body text-sm leading-relaxed"
                      value={newsletterContent}
                      onChange={(e) => setNewsletterContent(e.target.value)}
                    />
                    <p className="text-[10px] text-muted-foreground italic">
                      Note: An unsubscribe link will be automatically appended to the bottom.
                    </p>
                  </div>
                  <Button 
                    className="w-full gap-2 font-semibold" 
                    onClick={handleSendNewsletter}
                    disabled={isSendingNewsletter}
                  >
                    {isSendingNewsletter ? (
                      <>
                        <Loader2 className="animate-spin" size={16} /> 
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} /> 
                        Blast to {subscribers.filter(s => s.status === "active").length} active subs
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ===== DISCOVERY REQUESTS TAB ===== */}
          <TabsContent value="discovery">
            <div className="mb-6">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-1">Discovery Call Communication</h2>
              <p className="font-body text-sm text-muted-foreground">Manage and reply to discovery call threads Gmail-style.</p>
            </div>
            <DiscoveryInbox isAdmin={true} />
          </TabsContent>

          {/* ===== CHATS TAB ===== */}
          <TabsContent value="chats">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
              {/* Chat List */}
              <div className="md:col-span-1 border rounded-2xl overflow-hidden bg-card flex flex-col">
                <div className="bg-muted px-4 py-3 border-b">
                  <h3 className="font-display font-semibold text-sm">Conversations</h3>
                </div>
                <div className="flex-1 overflow-y-auto divide-y">
                  {chatsLoading ? (
                    <p className="text-center py-8 text-xs text-muted-foreground font-body">Loading...</p>
                  ) : activeChats.length === 0 ? (
                    <p className="text-center py-8 text-xs text-muted-foreground font-body">No active chats.</p>
                  ) : (
                    activeChats.map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => setSelectedChatId(chat.id)}
                        className={`w-full px-4 py-4 text-left transition-colors hover:bg-muted/50 flex flex-col gap-1 ${
                          selectedChatId === chat.id ? "bg-muted" : ""
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-display font-semibold text-sm">{chat.userName}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {chat.lastMessageAt?.toDate ? new Date(chat.lastMessageAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                          </span>
                        </div>
                        <p className={`text-xs truncate font-body ${chat.lastSender === "user" ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                          {chat.lastSender === "admin" ? "You: " : ""}{chat.lastMessage}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Chat Window */}
              <div className="md:col-span-2 border rounded-2xl overflow-hidden bg-card flex flex-col">
                {selectedChatId ? (
                  <>
                    <div className="bg-muted px-4 py-3 border-b flex justify-between items-center">
                      <h3 className="font-display font-semibold text-sm">
                        Chatting with {activeChats.find(c => c.id === selectedChatId)?.userName}
                      </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {chatMessages.map((msg) => {
                        const isAdmin = msg.sender === "admin";
                        const isEditing = editingId === msg.id;
                        const isDeleted = msg.deleted;

                        return (
                          <div key={msg.id} className={`flex items-start group gap-2 ${isAdmin ? "flex-row-reverse" : "flex-row"}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 relative ${
                              isAdmin ? "bg-primary text-primary-foreground" : "bg-muted"
                            } ${isDeleted ? "opacity-60 italic" : ""}`}>
                              {isEditing ? (
                                <div className="flex flex-col gap-2 min-w-[150px]">
                                  <textarea
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    className="bg-transparent border-none focus:ring-0 text-sm font-body p-0 resize-none w-full text-primary-foreground"
                                    autoFocus
                                    rows={2}
                                  />
                                  <div className="flex justify-end gap-1">
                                    <button 
                                      onClick={() => handleAdminEdit(msg.id)} 
                                      className="p-1 hover:bg-white/10 rounded-md transition-colors"
                                    >
                                      <Check size={14} />
                                    </button>
                                    <button 
                                      onClick={() => { setEditingId(null); setEditingText(""); }} 
                                      className="p-1 hover:bg-white/10 rounded-md transition-colors"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="font-body leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                  <div className={`flex items-center gap-1.5 mt-1 ${isAdmin ? "justify-end text-primary-foreground/70" : "justify-start text-muted-foreground"}`}>
                                    {msg.edited && !isDeleted && <span className="text-[9px] italic">(edited)</span>}
                                    <span className="text-[10px]">
                                      {msg.createdAt?.toDate ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Action Menu (Only for current user's non-deleted messages) */}
                            {isAdmin && !isDeleted && !isEditing && (
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors mt-2">
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
                                      onClick={() => handleAdminDelete(msg.id)}
                                    >
                                      <Trash2 size={12} /> Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      <div ref={chatEndRef} />
                    </div>
                    <div className="p-4 border-t flex gap-2">
                      <Input
                        placeholder="Type your reply..."
                        value={adminReplyText}
                        onChange={(e) => setAdminReplyText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendAdminReply()}
                        className="font-body text-sm"
                      />
                      <Button size="sm" onClick={sendAdminReply}>Send</Button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                    <MessageCircle size={48} className="mb-4 opacity-20" />
                    <p className="font-display text-lg">Select a conversation to start chatting</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
