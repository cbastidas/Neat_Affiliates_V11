// ContactQuickModal.tsx
// Dynamic popup that reuses icons from the contact_info table in Supabase.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "./lib/supabaseClient";

type ContactItem = {
  id: string;
  icon: string;
  label: string;
  value: string;
  type: string;
  emoji_url?: string;
};

type Props = {
  isOpen: boolean;
  instance?: string | null;
  onClose: () => void;
};

export default function ContactQuickModal({ isOpen, instance, onClose }: Props) {
  const [contacts, setContacts] = useState<ContactItem[]>([]);

  // Fetch contact_info from Supabase
  useEffect(() => {
    if (isOpen) fetchContacts();
  }, [isOpen]);

  const fetchContacts = async () => {
    const { data, error } = await supabase.from("contact_info").select("*");
    if (error) {
      console.error("Error fetching contact_info:", error.message);
      return;
    }
    setContacts(data || []);
  };

  if (!isOpen) return null;

  // Determine which email to use
  const key = (instance || "").trim();
  const emailToShow =
    key === "Realm"
      ? "hello@neataffiliates.com"
      : "support@neataffiliates.com";

  // Filter relevant contact items
  const filtered = contacts.filter((c) => {
    // Always include Teams and Telegram
    if (c.type === "teams" || c.type === "telegram") return true;
    // Include email matching the correct one
    if (c.type === "email" && c.value.includes(emailToShow)) return true;
    return false;
  });

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl relative">
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <div className="p-6">
          <h3 className="text-2xl font-bold text-center mb-2">Contact</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filtered.map((c) => (
              <a
                key={c.id}
                href={
                  c.type === "email"
                    ? `mailto:${c.value}`
                    : c.type === "telegram"
                    ? `https://t.me/${c.value.replace("@", "")}`
                    : c.type === "teams"
                    ? `https://teams.microsoft.com/l/chat/0/0?users=${c.value}`
                    : "#"
                }
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition p-5 text-center"
              >
                <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center shadow-sm">
                {c.emoji_url && (
                  <img
                    src={c.emoji_url}
                    alt={c.label}
                    className="h-6 w-6 object-contain"
                  />
                )}
                </div>
                <div className="text-lg font-semibold">{c.label}</div>
                <div className="mt-1 text-purple-700 underline break-all">
                  {c.value}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
