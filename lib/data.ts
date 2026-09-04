import { getPool } from "@/lib/db";
import type {
  HeroSlide,
  HeroStat,
  LocationRow,
  ServiceRow,
  SpotlightRow,
  ShootImage,
  PackageRow,
} from "@/lib/db";
import {
  heroSlides as staticHeroSlides,
  heroStats as staticHeroStats,
  locations as staticLocations,
  services as staticServices,
  spotlight as staticSpotlight,
  packages as staticPackages,
} from "@/lib/content";

const defaultHeroSettings: Record<string, string> = {
  hero_kicker: "Fine Art · Weddings · Island-Wide",
  hero_heading_line1: "Sri Lanka's Finest",
  hero_heading_line2: "Wedding Photography,",
  hero_heading_prefix: "Beautifully Told in",
};

const defaultAboutSettings: Record<string, string> = {
  about_hero_image:
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=80",
  about_intro_image:
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1800&q=80",
  about_services_image:
    "https://images.unsplash.com/photo-1583939411023-14783179e581?w=1800&q=80",
};

export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, image, place, sort_order FROM hero_slides ORDER BY sort_order ASC, id ASC"
    );
    const list = rows as HeroSlide[];
    if (list.length > 0) return list;
  } catch {
    // fall through to static fallback
  }
  return staticHeroSlides.map((s, i) => ({ id: -1 - i, image: s.image, place: s.place, sort_order: i }));
}

export async function getHeroStats(): Promise<HeroStat[]> {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, value, suffix, label, sort_order FROM hero_stats ORDER BY sort_order ASC, id ASC"
    );
    const list = rows as HeroStat[];
    if (list.length > 0) return list;
  } catch {
    // fall through to static fallback
  }
  return staticHeroStats.map((s, i) => ({ id: -1 - i, value: s.value, suffix: s.suffix, label: s.label, sort_order: i }));
}

export async function getHeroSettings(): Promise<Record<string, string>> {
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT setting_key, setting_value FROM site_settings");
    const list = rows as { setting_key: string; setting_value: string }[];
    if (list.length > 0) {
      const map = { ...defaultHeroSettings };
      for (const row of list) map[row.setting_key] = row.setting_value;
      return map;
    }
  } catch {
    // fall through to static fallback
  }
  return defaultHeroSettings;
}

export async function getAboutSettings(): Promise<Record<string, string>> {
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT setting_key, setting_value FROM site_settings");
    const list = rows as { setting_key: string; setting_value: string }[];
    if (list.length > 0) {
      const map = { ...defaultAboutSettings };
      for (const row of list) {
        if (row.setting_key in defaultAboutSettings) map[row.setting_key] = row.setting_value;
      }
      return map;
    }
  } catch {
    // fall through to static fallback
  }
  return defaultAboutSettings;
}

export async function getLocationsData(): Promise<LocationRow[]> {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, slug, title, subtitle, badge, highlight, image, sort_order FROM locations ORDER BY sort_order ASC, id ASC"
    );
    const list = rows as LocationRow[];
    if (list.length > 0) return list;
  } catch {
    // fall through to static fallback
  }
  return staticLocations.map((l, i) => ({ id: -1 - i, ...l, sort_order: i }));
}

export async function getLocationBySlug(slug: string): Promise<LocationRow | null> {
  const list = await getLocationsData();
  return list.find((l) => l.slug === slug) ?? null;
}

export async function getServicesData(): Promise<ServiceRow[]> {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, title, copy, image, sort_order FROM services ORDER BY sort_order ASC, id ASC"
    );
    const list = rows as ServiceRow[];
    if (list.length > 0) return list;
  } catch {
    // fall through to static fallback
  }
  return staticServices.map((s, i) => ({ id: -1 - i, ...s, sort_order: i }));
}

export async function getSpotlightData(): Promise<SpotlightRow[]> {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, couple, type, location, image, sort_order FROM spotlight ORDER BY sort_order ASC, id ASC"
    );
    const list = rows as SpotlightRow[];
    if (list.length > 0) return list;
  } catch {
    // fall through to static fallback
  }
  return staticSpotlight.map((s, i) => ({ id: -1 - i, ...s, sort_order: i }));
}

export async function getSpotlightById(id: number): Promise<SpotlightRow | null> {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, couple, type, location, image, sort_order FROM spotlight WHERE id = :id",
      { id }
    );
    const list = rows as SpotlightRow[];
    if (list.length > 0) return list[0];
  } catch {
    // fall through
  }
  const all = await getSpotlightData();
  return all.find((s) => s.id === id) ?? null;
}

export async function getShootImages(spotlightId: number): Promise<ShootImage[]> {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, spotlight_id, image, sort_order FROM shoot_images WHERE spotlight_id = :spotlightId ORDER BY sort_order ASC, id ASC",
      { spotlightId }
    );
    return rows as ShootImage[];
  } catch {
    return [];
  }
}

export async function getPackagesData(): Promise<PackageRow[]> {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, category, name, subtitle, price, badge, features, is_featured, sort_order FROM packages ORDER BY sort_order ASC, id ASC"
    );
    const list = rows as PackageRow[];
    if (list.length > 0) {
      // DECIMAL columns come back as strings from mysql2
      return list.map((p) => ({ ...p, price: Number(p.price) }));
    }
  } catch {
    // fall through to static fallback
  }
  return staticPackages.map((p, i) => ({ id: -1 - i, ...p, sort_order: i }));
}
