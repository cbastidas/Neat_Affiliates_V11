// HomeHero.tsx
// A simple top-of-page hero section (no navbar link). All UI text is in English for consistency.
// Comments are in English.

//import React from "react";

type Props = {
  onLogin?: () => void;
  onSignup?: () => void;
  onScrollNext?: () => void; // scroll to the next section (e.g., WhyJoin)
};

export default function HomeHero({ onSignup, onScrollNext }: Props) {
  return (
    <section
      id="HomeHero"
      className="relative isolate overflow-hidden bg-transparent-to-b from-white to-gray-50"
      style={{ paddingTop: "5rem" }} // offset for fixed navbar
    >
      <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24 text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900">
          Grow your affiliate revenue with Neat Affiliates
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Tools, reporting and flexible deals to help you scale—fast.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={onSignup}
            className="font-bold text-base sm:text-lg lg:text-xl rounded-xl bg-green-600 px-9 py-3 text-white hover:bg-green-800 transition"
          >
            Register Now and Start Earning
          </button>

          <button
            onClick={onScrollNext}
            className="font-bold text-base sm:text-lg lg:text-xl rounded-xl border px-6 py-3 text-gray-700 hover:bg-gray-100 transition"
            aria-label="Scroll to next section"
          >
            Learn more
          </button>
        </div>

        {/* Decorative area – keep it subtle */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -z-10 top-0 h-[320px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100 via-transparent to-transparent"
        />
      </div>
    </section>
  );
}
