// utils/instances.ts
// Public-facing display names that hide internal instance names.

export const INSTANCE_DISPLAY_MAP: Record<string, string> = {
  // Internal -> Public
  Realm: 'Instance 1',
  Throne: 'Instance 2',
  'Vidavegas BR': 'Vidavegas BR',
  Bluffbet: 'Bluffbet',
  'Vidavegas Latam': 'Vidavegas Latam',

  // If you still have these internally and want to mask them:
  Neatplay: 'Instance 3',
  'Neatplay-Latam': 'Instance 3',
};

export function getInstanceDisplayName(instance: string): string {
  return INSTANCE_DISPLAY_MAP[instance] ?? instance;
}
