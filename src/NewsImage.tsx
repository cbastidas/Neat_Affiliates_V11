import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

// Home section that shows a title, subtitle, and the latest news image from DB
export default function NewsImage() {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the latest row from `news` table
    const load = async () => {
      setLoading(true);

      const { data } = await supabase
        .from("news")
        .select("image_url, created_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      // Set image source or null if not found
      setSrc(data?.image_url ?? null);
      setLoading(false);
    };

    load();
  }, []);

  return (
    <section id="News">
      <div className="mx-auto max-w-5xl px-4 md:px-6 text-center py-16 bg-white rounded-2xl border">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-800 mb-2 underline decoration-purple-300 underline-offset-4">
          Latest News
        </h2>

        {/* Subtitle */}
        <p className="text-gray-500 mb-8 text-base">
          Stay up to date with our latest updates and announcements
        </p>

        {/* Image or placeholder */}
        {loading ? (
          <div className="text-gray-500">Loading image…</div>
        ) : src ? (
          <img
            src={src}
            alt="News and updates"
            className="w-full h-auto rounded-2xl shadow border"
            loading="lazy"
          />
        ) : (
          <div className="text-gray-500 border rounded-xl p-8 text-center bg-white shadow">
            No image has been set in <b>news.image_url</b>.
          </div>
        )}
      </div>
    </section>
  );
}
