'use client';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { feedback } from "@/lib/actions/user.actions";
import { useToast } from "@/components/ui/use-toast";

export default function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); // Fixed the typo here
  const router = useRouter();
  const { toast } = useToast();

  async function submitFeedback(e) {
    e.preventDefault();
    const res = await feedback(name, email, message);
    toast({
      title: "Feedback submitted",
    });
    setName("");
    setEmail("");
    setMessage(""); // Fixed the typo here
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-md md:max-w-[60%] space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Give us your feedback</h1>
        <p className="text-gray-500 dark:text-gray-400">Help us improve our product by sharing your thoughts.</p>
      </div>
      <form className="space-y-4" onSubmit={submitFeedback}>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            onChange={(e) => setName(e.target.value)}
            id="name"
            name="name"
            placeholder="Enter your name"
            required
            className="border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            className="border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            onChange={(e) => setMessage(e.target.value)} // Fixed the typo here
            id="message"
            name="message"
            placeholder="Share your feedback"
            required
            className="border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600 transition">
          Submit Feedback
        </Button>
      </form>
    </div>
  );
}