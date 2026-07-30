import type { LucideIcon } from 'lucide-react';
import {
  Briefcase,
  Building2,
  Car,
  CloudFog,
  Droplets,
  Flame,
  Home,
  Lock,
  Tag,
} from 'lucide-react';

/** Map taxonomy Topic names → Lucide icons for LOB / Peril chips. */
const ICON_BY_KEY: Record<string, LucideIcon> = {
  // Peril Types
  'business interuption': Briefcase,
  'business interruption': Briefcase,
  fire: Flame,
  'smoke damage': CloudFog,
  theft: Lock,
  'water damage': Droplets,
  // Knowledge Domain / LOB
  'commercial claims': Building2,
  'personal home': Home,
  'personal auto': Car,
};

function normalizeKey(label: string): string {
  return label.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function iconForTopic(label: string): LucideIcon {
  return ICON_BY_KEY[normalizeKey(label)] || Tag;
}
