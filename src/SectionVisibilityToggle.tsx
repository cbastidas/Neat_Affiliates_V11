import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

// Reusable visibility toggle for a ui_sections key
export default function SectionVisibilityToggle({
  sectionKey,
  label,               // optional UI label near the switch
  size = "md",         // "sm" | "md"
}: {
  sectionKey: string;
  label?: string;
  size?: "sm" | "md";
}) {
  const [visible, setVisible] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      // read current visibility (fallback true if not found)
      const { data } = await supabase
        .from("ui_sections")
        .select("visible")
        .eq("key", sectionKey)
        .single();
      if (mounted) {
        setVisible(data?.visible ?? true);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [sectionKey]);

  const toggle = async () => {
    if (saving) return;
    const next = !visible;
    setVisible(next); // optimistic
    setSaving(true);
    // upsert ensures the row exists
    const { error } = await supabase
      .from("ui_sections")
      .upsert({ key: sectionKey, visible: next, label: sectionKey, updated_at: new Date().toISOString() })
      .eq("key", sectionKey);
    if (error) {
      // rollback on failure
      setVisible(!next);
      console.error(error.message);
      alert("Failed to update visibility");
    }
    setSaving(false);
  };

  const sizes = {
    sm: { outer: "h-6 w-10", knob: "h-4 w-4", on: "translate-x-5", off: "translate-x-1" },
    md: { outer: "h-7 w-12", knob: "h-5 w-5", on: "translate-x-6", off: "translate-x-1" },
  }[size];

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-gray-600">{label}</span>}
      <button
        type="button"
        onClick={toggle}
        disabled={loading || saving}
        className={`relative inline-flex items-center rounded-full transition
          ${sizes.outer} ${visible ? "bg-green-600" : "bg-gray-300"} disabled:opacity-60`}
        aria-pressed={visible}
        title={visible ? "Visible" : "Hidden"}
      >
        <span
          className={`inline-block ${sizes.knob} transform rounded-full bg-white transition
            ${visible ? sizes.on : sizes.off}`}
        />
      </button>
      <span className="text-xs text-gray-500">{loading ? "Loading…" : (visible ? "Visible" : "Hidden")}</span>
    </div>
  );
}
