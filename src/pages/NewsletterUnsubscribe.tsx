import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MailCheck, MailX, Loader2, Home } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";

const NewsletterUnsubscribe = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "no-email">("loading");
  const email = searchParams.get("email");

  useEffect(() => {
    const performUnsubscribe = async () => {
      if (!email) {
        setStatus("no-email");
        return;
      }

      try {
        const q = query(collection(db, "newsletter_subscribers"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setStatus("error");
          return;
        }

        const subDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, "newsletter_subscribers", subDoc.id), {
          status: "inactive",
          unsubscribedAt: new Date()
        });

        setStatus("success");
      } catch (error) {
        console.error("Unsubscribe error:", error);
        setStatus("error");
      }
    };

    performUnsubscribe();
  }, [email]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-background rounded-3xl shadow-xl p-8 text-center border border-border"
      >
        <div className="w-16 h-16 rounded-2xl bg-sage-light flex items-center justify-center mx-auto mb-6">
          {status === "loading" && <Loader2 className="animate-spin text-primary" size={32} />}
          {status === "success" && <MailX className="text-primary" size={32} />}
          {(status === "error" || status === "no-email") && <MailCheck className="text-muted-foreground" size={32} />}
        </div>

        {status === "loading" && (
          <>
            <h1 className="font-display text-2xl font-semibold mb-2 text-foreground">Processing Request</h1>
            <p className="font-body text-muted-foreground">Please wait while we update your preferences...</p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="font-display text-2xl font-semibold mb-2 text-foreground">Unsubscribed</h1>
            <p className="font-body text-muted-foreground mb-8">
              We're sorry to see you go. You've been successfully removed from our newsletter list.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="font-display text-2xl font-semibold mb-2 text-foreground">Something went wrong</h1>
            <p className="font-body text-muted-foreground mb-8">
              We couldn't find your subscription or an error occurred. Please try again or contact us directly.
            </p>
          </>
        )}

        {status === "no-email" && (
          <>
            <h1 className="font-display text-2xl font-semibold mb-2 text-foreground">Invalid Link</h1>
            <p className="font-body text-muted-foreground mb-8">
              No email was provided in the link. Please check your unsubscribe link and try again.
            </p>
          </>
        )}

        <div className="flex flex-col gap-3">
          <Link to="/">
            <Button variant="default" className="w-full rounded-full gap-2">
              <Home size={16} /> Return to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NewsletterUnsubscribe;
