
import { supabase } from './lib/supabaseClient';

export type UiSection = {
  key: string;
  visible: boolean;
  label: string;
  updated_at?: string;
};

export async function fetchUiSections(): Promise<UiSection[]> {
  const { data, error } = await supabase
    .from('ui_sections')
    .select('key, visible, label, updated_at')
    .order('label', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function updateUiSectionVisibility(key: string, visible: boolean) {
  const { error } = await supabase
    .from('ui_sections')
    .update({ visible, updated_at: new Date().toISOString() })
    .eq('key', key);
  if (error) throw new Error(error.message);
}
