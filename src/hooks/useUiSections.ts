import { useEffect, useState } from 'react';
import { fetchUiSections, UiSection } from '../uiSections';
import { supabase } from '../lib/supabaseClient';

export function useUiSections() {
  const [sections, setSections] = useState<UiSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const rows = await fetchUiSections();
        if (mounted) setSections(rows);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    // Realtime so admin changes reflect immediately.
    const ch = supabase
      .channel('ui_sections_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ui_sections' }, async () => {
        const rows = await fetchUiSections();
        if (mounted) setSections(rows);
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(ch);
    };
  }, []);

  const map = sections.reduce<Record<string, boolean>>((acc, cur) => {
    acc[cur.key] = cur.visible;
    return acc;
  }, {});

  return { sections, map, loading, setSections };
}
