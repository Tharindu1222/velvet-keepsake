import mysql from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var mysqlPool: mysql.Pool | undefined;
}

export function getPool() {
  if (!global.mysqlPool) {
    global.mysqlPool = mysql.createPool({
      host: process.env.MYSQL_HOST || "127.0.0.1",
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "velvet_keepsake",
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: true,
    });
  }
  return global.mysqlPool;
}

export type PhotoCategory =
  | "Candid"
  | "Destination"
  | "Portraits"
  | "Ceremony"
  | "Reception"
  | "Details";

export type Photo = {
  id: number;
  url: string;
  public_id: string | null;
  category: PhotoCategory;
  title: string | null;
  alt_text: string | null;
  created_at: Date;
};

export type Inquiry = {
  id: number;
  name: string;
  email: string;
  wedding_date: string | null;
  message: string;
  created_at: Date;
};

export type HeroSlide = {
  id: number;
  image: string;
  place: string;
  sort_order: number;
};

export type HeroStat = {
  id: number;
  value: number;
  suffix: string;
  label: string;
  sort_order: number;
};

export type SiteSetting = {
  setting_key: string;
  setting_value: string;
};

export type LocationRow = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  highlight: string;
  image: string;
  sort_order: number;
};

export type ServiceRow = {
  id: number;
  title: string;
  copy: string;
  image: string;
  sort_order: number;
};

export type SpotlightRow = {
  id: number;
  couple: string;
  type: string;
  location: string;
  image: string;
  sort_order: number;
};

export type ShootImage = {
  id: number;
  spotlight_id: number;
  image: string;
  sort_order: number;
};

export type PackageCategory =
  | "Pre-Shoot"
  | "Engagement"
  | "Wedding"
  | "Special Offer";

export type PackageRow = {
  id: number;
  category: string;
  name: string;
  subtitle: string;
  price: number;
  badge: string;
  features: string;
  is_featured: number;
  sort_order: number;
};
