import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://api.whatsapp.com/send?phone=919250915092&text=Hello%20Creative%20Ashoka%20Foundation"
      target="_blank"
      rel="noopener"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-elevated transition hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
