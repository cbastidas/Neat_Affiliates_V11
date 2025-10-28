import { useEffect, useRef, useState } from "react";
import BrandCard from "./BrandCard";

/** Adjust this shape to match your Supabase 'brands' select */
export type Brand = {
  id: string;
  logo_url: string;
  name: string;
  commission_tiers: { range: string; rate: string }[];
  commission_type: string;
  commission_tiers_label?: string;
  is_visible: boolean;
  group?: string;
  signup_url?: string; // if you store it
};

export default function CommissionRateMobile({
  brands,
}: {
  brands: Brand[];
  signupByInstance?: Record<string, string>;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // keep active in range
  useEffect(() => {
    setActive((i) => Math.min(i, Math.max(0, (brands?.length || 1) - 1)));
  }, [brands]);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setActive(i);
  };

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(i, (brands?.length || 1) - 1));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div>
      {/* Horizontal track */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="
          relative flex overflow-x-auto
          snap-x snap-mandatory
          scroll-smooth
          [-webkit-overflow-scrolling:touch]
          no-scrollbar
        "
      >
        {brands.map((b) => (
            <div
              key={b.id}
              className="
                snap-start shrink-0
                px-[clamp(8px,3.5vw,18px)]
            "
            style={{ width: "min(94vw, 420px)" }}
            >
              <div className="w-full bg-white rounded-2xl border shadow-md p-4 sm:p-6">
                <BrandCard
                  id={b.id}
                  logoUrl={b.logo_url}
                  name={b.name}
                  commissionTiers={b.commission_tiers}
                  commissionType={b.commission_type}
                  commission_tiers_label={b.commission_tiers_label}
                  isVisible={b.is_visible}
                  onSave={() => {}}
                  isPublicView={true}
                  group={b.group}
                  signupUrl={b.signup_url}
                />
              </div>
            </div>
        ))}
      </div>

      {/* Dots */}
      {brands.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {brands.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to brand ${i + 1}`}
              className={`h-2.5 rounded-full transition
                ${i === active ? "bg-purple-700 w-6" : "bg-gray-300 w-2.5 hover:bg-gray-400"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
