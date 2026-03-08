import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LogOut, Sparkles, MessageSquare, Mail, Users,
  Plus, Trash2, Eye, EyeOff, RefreshCw, CheckCircle2, XCircle, Clock, UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

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

  const fetchPosts = async () => {
    setPostsLoading(true);
    const { data } = await supabase.from("motivation_posts").select("*").order("created_at", { ascending: false });
    setPosts(data || []);
    setPostsLoading(false);
  };

  const addPost = async () => {
    if (!newPost.title || !newPost.content) { toast("Title and content required."); return; }
    const { error } = await supabase.from("motivation_posts").insert({
      category: newPost.category,
      title: newPost.title,
      content: newPost.content,
      author: newPost.author || null,
    });
    if (error) { toast("Failed to add post."); console.error(error); return; }
    toast("Post added!");
    setNewPost({ category: "quotes", title: "", content: "", author: "" });
    fetchPosts();
  };

  const deletePost = async (id: string) => {
    await supabase.from("motivation_posts").delete().eq("id", id);
    toast("Post deleted.");
    fetchPosts();
  };

  // --- Assessments ---
  const [assessments, setAssessments] = useState<any[]>([]);
  const [assessLoading, setAssessLoading] = useState(true);

  const fetchAssessments = async () => {
    setAssessLoading(true);
    const { data } = await supabase.from("wellness_assessments").select("*").order("created_at", { ascending: false });
    setAssessments(data || []);
    setAssessLoading(false);
  };

  // --- Contact Messages ---
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  const fetchMessages = async () => {
    setMessagesLoading(true);
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setMessages(data || []);
    setMessagesLoading(false);
  };

  const toggleRead = async (id: string, current: boolean) => {
    await supabase.from("contact_messages").update({ read: !current }).eq("id", id);
    fetchMessages();
  };

  // --- Newsletter ---
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [subsLoading, setSubsLoading] = useState(true);

  const fetchSubscribers = async () => {
    setSubsLoading(true);
    const { data } = await supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false });
    setSubscribers(data || []);
    setSubsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
    fetchAssessments();
    fetchMessages();
    fetchSubscribers();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
        <Tabs defaultValue="posts">
          <TabsList className="mb-8 flex flex-wrap">
            <TabsTrigger value="posts" className="gap-1.5"><Sparkles size={14} /> Posts</TabsTrigger>
            <TabsTrigger value="assessments" className="gap-1.5"><Users size={14} /> Assessments</TabsTrigger>
            <TabsTrigger value="messages" className="gap-1.5"><MessageSquare size={14} /> Messages</TabsTrigger>
            <TabsTrigger value="subscribers" className="gap-1.5"><Mail size={14} /> Subscribers</TabsTrigger>
          </TabsList>

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
                  <Textarea value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} className="font-body min-h-[100px]" />
                </div>
                <div>
                  <label className="font-body text-xs text-muted-foreground mb-1 block">Author (optional)</label>
                  <Input value={newPost.author} onChange={(e) => setNewPost({ ...newPost, author: e.target.value })} className="font-body" />
                </div>
                <Button onClick={addPost} className="w-full rounded-full gap-2"><Plus size={14} /> Publish</Button>
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
                          <span className="font-body text-[10px] text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-display text-sm font-semibold text-foreground truncate">{post.title}</h4>
                        <p className="font-body text-xs text-muted-foreground line-clamp-2">{post.content}</p>
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
                      <span className="font-body text-[10px] text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="font-body text-xs text-muted-foreground">{a.email}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs font-body">
                      <div className="bg-muted rounded-lg p-2">
                        <span className="text-muted-foreground">Stress:</span> <span className="font-medium text-foreground">{a.stress_level}/10</span>
                      </div>
                      <div className="bg-muted rounded-lg p-2">
                        <span className="text-muted-foreground">Sleep:</span> <span className="font-medium text-foreground">{a.sleep_quality}</span>
                      </div>
                      <div className="bg-muted rounded-lg p-2 col-span-2">
                        <span className="text-muted-foreground">Balance:</span> <span className="font-medium text-foreground">{a.work_life_balance}</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-body text-[10px] text-muted-foreground">Goal:</span>
                      <p className="font-body text-xs text-foreground">{a.main_goal}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ===== MESSAGES TAB ===== */}
          <TabsContent value="messages">
            <div className="flex items-center justify-between mb-4">
              <p className="font-body text-sm text-muted-foreground">{messages.length} messages</p>
              <Button variant="ghost" size="sm" onClick={fetchMessages}><RefreshCw size={14} /></Button>
            </div>
            {messagesLoading ? (
              <p className="font-body text-muted-foreground text-center py-8">Loading…</p>
            ) : messages.length === 0 ? (
              <p className="font-body text-muted-foreground text-center py-8">No messages yet.</p>
            ) : (
              <div className="space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={`rounded-xl border bg-card p-5 ${m.read ? "border-border opacity-60" : "border-primary/30"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display text-sm font-semibold text-foreground">{m.name}</h4>
                        {!m.read && <Badge className="text-[10px]">New</Badge>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-body text-[10px] text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</span>
                        <Button variant="ghost" size="icon" onClick={() => toggleRead(m.id, m.read)} title={m.read ? "Mark unread" : "Mark read"}>
                          {m.read ? <EyeOff size={14} /> : <Eye size={14} />}
                        </Button>
                      </div>
                    </div>
                    <p className="font-body text-xs text-muted-foreground mb-1">{m.email}</p>
                    <p className="font-body text-sm text-foreground">{m.message}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ===== SUBSCRIBERS TAB ===== */}
          <TabsContent value="subscribers">
            <div className="flex items-center justify-between mb-4">
              <p className="font-body text-sm text-muted-foreground">{subscribers.length} subscribers</p>
              <Button variant="ghost" size="sm" onClick={fetchSubscribers}><RefreshCw size={14} /></Button>
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
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((s) => (
                      <tr key={s.id} className="border-t border-border">
                        <td className="px-4 py-3 text-foreground">{s.email}</td>
                        <td className="px-4 py-3">
                          <Badge variant={s.subscribed ? "default" : "secondary"} className="text-[10px]">
                            {s.subscribed ? "Active" : "Unsubscribed"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(s.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
