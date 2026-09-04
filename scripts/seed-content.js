#!/usr/bin/env node
/**
 * Seeds hero_slides, hero_stats, site_settings, locations, services, spotlight
 * from the values that used to live in lib/content.ts — but only if each
 * table is currently empty, so it's safe to re-run.
 * Usage: npm run db:seed
 */
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

const heroSlides = [
  { image: "https://images.unsplash.com/photo-1751247026229-518bfec9b5e6?w=2400&q=90", place: "Sigiriya" },
  { image: "https://images.unsplash.com/photo-1748491829292-859b8ba52481?w=2400&q=90", place: "Galle" },
  { image: "https://images.unsplash.com/photo-1763030597070-6ec70fdea04b?w=2400&q=90", place: "Ella" },
  { image: "https://images.unsplash.com/photo-1580910531902-1112518b26ea?w=2400&q=90", place: "Mirissa" },
];

const heroStats = [
  { value: 480, suffix: "+", label: "Weddings Captured" },
  { value: 25, suffix: "+", label: "Locations Island-Wide" },
  { value: 12, suffix: "", label: "Years of Craft" },
  { value: 98, suffix: "%", label: "Couples Who Refer Us" },
];

const heroSettings = {
  hero_kicker: "Fine Art · Weddings · Island-Wide",
  hero_heading_line1: "Sri Lanka's Finest",
  hero_heading_line2: "Wedding Photography,",
  hero_heading_prefix: "Beautifully Told in",
};

const locations = [
  { slug: "galle-fort", title: "Galle Fort", subtitle: "Colonial ramparts, lighthouse views, and golden hour by the sea", badge: "Coastal Heritage", highlight: "UNESCO World Heritage · Southern Coast", image: "https://images.unsplash.com/photo-1748491829292-859b8ba52481?w=1400&q=80" },
  { slug: "ella", title: "Ella", subtitle: "Misty hills, the Nine Arch Bridge, and endless tea-green horizons", badge: "Hill Country", highlight: "Best light at sunrise", image: "https://images.unsplash.com/photo-1763030597070-6ec70fdea04b?w=1400&q=80" },
  { slug: "sigiriya", title: "Sigiriya", subtitle: "An ancient rock fortress rising above the central plains", badge: "Cultural Triangle", highlight: "UNESCO World Heritage Site", image: "https://images.unsplash.com/photo-1751247026229-518bfec9b5e6?w=1400&q=80" },
  { slug: "mirissa", title: "Mirissa", subtitle: "Palm-fringed shores and turquoise water on the southern coast", badge: "Southern Coast", highlight: "Whale season Nov – Apr", image: "https://images.unsplash.com/photo-1580910531902-1112518b26ea?w=1400&q=80" },
  { slug: "nuwara-eliya", title: "Nuwara Eliya", subtitle: "Rolling tea estates and cool climes — Sri Lanka's Little England", badge: "Hill Country", highlight: "Cool climate, year-round", image: "https://images.unsplash.com/photo-1760533852055-724d3a50dcbd?w=1400&q=80" },
  { slug: "kandy", title: "Kandy", subtitle: "Sacred temples on the still shores of Kandy Lake", badge: "Cultural Capital", highlight: "Home to the Temple of the Tooth", image: "https://images.unsplash.com/photo-1676360109549-3d0b2bb72aa1?w=1400&q=80" },
];

const services = [
  { title: "Wedding Photography", copy: "Elegantly composed and natural images that reflect your unique love story — candid and classic frames remembered as vividly as they were lived.", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80" },
  { title: "Island Destination Weddings", copy: "On-location photography across Sri Lanka's most breathtaking backdrops — from tropical southern shores to misty hill-country estates.", image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80" },
  { title: "Pre-Wedding & Engagement Shoots", copy: "Romantic sessions at the island's most scenic spots — Galle's ramparts, Ella's tea hills, Sigiriya's plains — before the big day arrives.", image: "https://images.unsplash.com/photo-1763030597070-6ec70fdea04b?w=1200&q=80" },
  { title: "Heritage Ceremonies", copy: "Deep cultural understanding for traditional Sri Lankan celebrations — rituals, colour, and joy documented with reverence and craft.", image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80" },
];

const spotlight = [
  { couple: "Waruni & Asanka", type: "Wedding Photography", location: "Sri Lanka", image: "/spotlight/waruni-asanka-1.jpg" },
  { couple: "Waruni & Asanka", type: "Wedding Photography", location: "Sri Lanka", image: "/spotlight/waruni-asanka-2.jpg" },
  { couple: "Waruni & Asanka", type: "Wedding Photography", location: "Sri Lanka", image: "/spotlight/waruni-asanka-3.jpg" },
  { couple: "Mihiri & Simon", type: "Casual Shoot", location: "Galle", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1000&q=80" },
  { couple: "Anna & Vladimir", type: "Destination Wedding", location: "Bentota", image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1000&q=80" },
  { couple: "Celia & Tom", type: "Wedding Photography", location: "Kandy", image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1000&q=80" },
  { couple: "Laura & Amar", type: "Wedding Photography", location: "Mirissa", image: "https://images.unsplash.com/photo-1716388343057-9199e096ffaf?w=1000&q=80" },
  { couple: "Helen & Dilrukshan", type: "Wedding Photography", location: "Colombo", image: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=1000&q=80" },
  { couple: "Inami & Dimuth", type: "Casual Shoot", location: "Ella", image: "https://images.unsplash.com/photo-1583939411023-14783179e581?w=1000&q=80" },
];

const packages = [
  { category: "Pre-Shoot", name: "Simple Bliss", subtitle: "", price: 25000, badge: "", features: ["2 Hours Session at a Preferred Location", "1 Outfit Change", "50 Professionally Retouched High-Resolution Images", "Online Gallery"].join("\n"), is_featured: 0 },
  { category: "Pre-Shoot", name: "Memories in Frame", subtitle: "", price: 40000, badge: "", features: ["3 Hours Session (Up to 2 Locations)", "2–3 Outfit Changes", "80 Professionally Retouched High-Resolution Images", "Online Gallery + USB", "1 Framed Enlargement (12×18)"].join("\n"), is_featured: 0 },
  { category: "Pre-Shoot", name: "Artful Romance", subtitle: "", price: 55000, badge: "", features: ["4 Hours Session (Multiple Locations)", "Unlimited Outfit Changes During Session", "100+ Professionally Retouched High-Resolution Images", "Online Gallery + USB", "1 Framed Enlargement (16×24)", "Optional Add-on: 8×24 Fine Art Story Album with Box (+Rs. 25,000)"].join("\n"), is_featured: 0 },
  { category: "Engagement", name: "Velvet Promise", subtitle: "", price: 35000, badge: "", features: ["Main Photo Session at Preferred Location", "2 Hours Coverage", "50 Professionally Retouched High-Resolution Images", "All Unedited Photos Included (USB or Online Gallery)"].join("\n"), is_featured: 0 },
  { category: "Engagement", name: "Keepsake Bond", subtitle: "", price: 50000, badge: "", features: ["Main Session at Preferred Location + Registration & Reception Coverage", "5 Hours Coverage", "150 Professionally Retouched High-Resolution Images", "All Unedited Photos Included", "1 Framed Enlargement (12×18)"].join("\n"), is_featured: 0 },
  { category: "Engagement", name: "Golden Vows", subtitle: "", price: 70000, badge: "", features: ["Main Session at Preferred Location + Registration & Reception Coverage", "6 Hours Coverage", "200 Professionally Retouched High-Resolution Images", "All Unedited Photos Included", "Fine Art Story Album (8×24, 40 Pages) with Box", "1 Framed Enlargement (16×24)"].join("\n"), is_featured: 0 },
  { category: "Wedding", name: "Velvet Classic", subtitle: "", price: 85000, badge: "", features: ["Bride & Groom Getting Ready Coverage (Hotel/Home)", "Main Photo Session at Preferred Location", "Wedding Ceremony + Reception Coverage", "8 Hours Coverage · 1 Photographer", "200 Professionally Retouched High-Resolution Images", "All Unedited Photos (USB/Online Gallery)", "+Rs. 25,000 for Preshoots · +Rs. 30,000 for Homecoming Shoots"].join("\n"), is_featured: 1 },
  { category: "Wedding", name: "Velvet Elegance", subtitle: "Wedding Only + 01 Album", price: 120000, badge: "", features: ["Bride & Groom Getting Ready Coverage", "Main Photo Session at Preferred Location", "Wedding Ceremony + Reception Coverage", "10 Hours Coverage · 2 Photographers", "250 Professionally Retouched Images", "All Unedited Photos", "Premium Album (10×24, 60 Pages) with Box", "1 Framed Enlargement (16×24) + 1 Framed Enlargement (12×18)"].join("\n"), is_featured: 0 },
  { category: "Wedding", name: "Velvet Signature", subtitle: "Wedding Only + 01 Album", price: 150000, badge: "Most Chosen", features: ["Bride & Groom Getting Ready Coverage", "Main Session + Full Wedding Ceremony & Reception", "10 Hours Coverage · 2 Photographers", "350 Professionally Retouched Images", "All Unedited Photos", "Story Album (12×30, 60 Pages) with Box", "2 Framed Enlargements (16×24) + 1 Framed Enlargement (12×18)", "100 Thanking Cards"].join("\n"), is_featured: 1 },
  { category: "Wedding", name: "Velvet Luxury", subtitle: "Wedding Only + 02 Albums", price: 180000, badge: "", features: ["Bride & Groom Getting Ready Coverage", "Main Session + Wedding Ceremony + Reception", "12 Hours Coverage · 2 Photographers", "400+ Professionally Retouched Images", "All Unedited Photos", "Story Album (12×30, 60 Pages) with Box + Family Album (8×24)", "2 Framed Enlargements (16×24) + 1 Framed Enlargement (12×18)", "150 Thanking Cards"].join("\n"), is_featured: 0 },
  { category: "Wedding", name: "Velvet Royal", subtitle: "Wedding Only + 02 Albums", price: 200000, badge: "", features: ["Bride & Groom Getting Ready Coverage", "Main Session + Full Wedding Ceremony & Reception", "12 Hours Coverage · 2 Photographers", "450+ Professionally Retouched Images", "All Unedited Photos", "Story Album (12×30, 60 Pages) with Box + Family Album (8×24)", "2 Framed Enlargements (16×24) + 2 Framed Enlargements (12×18)", "200 Thanking Cards"].join("\n"), is_featured: 1 },
  { category: "Wedding", name: "Most Popular", subtitle: "Wedding Only + Preshoot + 02 Albums", price: 200000, badge: "Most Popular", features: ["Pre Casual Shoot: 4 Hours at a Preferred Location & Theme, with a Preshoot Slideshow for the Wedding Day", "Bride & Groom Getting Ready at the Hotel", "Main Photo Session at Preferred Location", "Wedding Ceremony and Reception Coverage", "10 Hours Coverage · 2 Photographers", "12×30 Fine Art Story Album with Box (60 Pages)", "8×24 Magazine Family or Preshoot Album", "16×24 Two Enlargements + 12×18 One Enlargement", "150 Thanking Cards", "350 Professionally Retouched Images & All Unedited Photos on USB"].join("\n"), is_featured: 0 },
  { category: "Special Offer", name: "Wedding Glow", subtitle: "Premium Album + Wedding Video", price: 150000, badge: "Special Offer", features: ["Main Photo Session + Wedding Ceremony + Reception", "10 Hours Coverage · 2 Photographers", "300+ Professionally Retouched Images", "All Unedited Photos", "Premium Album (12×24, 50 Pages) with Box", "2 Framed Enlargements (16×24)", "100 Thanking Cards", "Wedding Highlight Video Coverage"].join("\n"), is_featured: 0 },
  { category: "Special Offer", name: "Special Wedding Package", subtitle: "Premium Album", price: 120000, badge: "Special Offer", features: ["Main Photo Session + Wedding Ceremony + Reception", "10 Hours Coverage · 2 Photographers", "250+ Professionally Retouched Images", "All Unedited Photos", "Premium Album (12×24, 50 Pages) with Box", "2 Framed Enlargements (16×24)", "100 Thanking Cards"].join("\n"), is_featured: 0 },
  { category: "Special Offer", name: "Special Wedding Package", subtitle: "Enlargements + Thanking Cards", price: 85000, badge: "Special Offer", features: ["Main Photo Session + Wedding Ceremony + Reception", "10 Hours Coverage · 1 Photographer", "250+ Professionally Retouched Images", "All Unedited Photos", "2 Framed Enlargements (16×24) + 1 Framed Enlargement (12×18)", "100 Thanking Cards"].join("\n"), is_featured: 0 },
];

async function main() {
  loadEnvFile(path.join(process.cwd(), ".env.local"));
  loadEnvFile(path.join(process.cwd(), ".env"));

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "velvet_keepsake",
    namedPlaceholders: true,
  });

  async function seedIfEmpty(table, rows, insertFn) {
    const [existing] = await connection.query(`SELECT COUNT(*) AS c FROM ${table}`);
    if (existing[0].c > 0) {
      console.log(`- ${table}: already has ${existing[0].c} row(s), skipping`);
      return;
    }
    for (let i = 0; i < rows.length; i++) {
      await insertFn(rows[i], i);
    }
    console.log(`✓ ${table}: seeded ${rows.length} row(s)`);
  }

  await seedIfEmpty("hero_slides", heroSlides, (row, i) =>
    connection.query(
      "INSERT INTO hero_slides (image, place, sort_order) VALUES (:image, :place, :sort_order)",
      { ...row, sort_order: i }
    )
  );

  await seedIfEmpty("hero_stats", heroStats, (row, i) =>
    connection.query(
      "INSERT INTO hero_stats (value, suffix, label, sort_order) VALUES (:value, :suffix, :label, :sort_order)",
      { ...row, sort_order: i }
    )
  );

  await seedIfEmpty("locations", locations, (row, i) =>
    connection.query(
      "INSERT INTO locations (slug, title, subtitle, badge, highlight, image, sort_order) VALUES (:slug, :title, :subtitle, :badge, :highlight, :image, :sort_order)",
      { ...row, sort_order: i }
    )
  );

  await seedIfEmpty("services", services, (row, i) =>
    connection.query(
      "INSERT INTO services (title, copy, image, sort_order) VALUES (:title, :copy, :image, :sort_order)",
      { ...row, sort_order: i }
    )
  );

  await seedIfEmpty("spotlight", spotlight, (row, i) =>
    connection.query(
      "INSERT INTO spotlight (couple, type, location, image, sort_order) VALUES (:couple, :type, :location, :image, :sort_order)",
      { ...row, sort_order: i }
    )
  );

  await seedIfEmpty("packages", packages, (row, i) =>
    connection.query(
      "INSERT INTO packages (category, name, subtitle, price, badge, features, is_featured, sort_order) VALUES (:category, :name, :subtitle, :price, :badge, :features, :is_featured, :sort_order)",
      { ...row, sort_order: i }
    )
  );

  const [existingSettings] = await connection.query("SELECT COUNT(*) AS c FROM site_settings");
  if (existingSettings[0].c > 0) {
    console.log(`- site_settings: already has ${existingSettings[0].c} row(s), skipping`);
  } else {
    for (const [key, value] of Object.entries(heroSettings)) {
      await connection.query(
        "INSERT INTO site_settings (setting_key, setting_value) VALUES (:key, :value)",
        { key, value }
      );
    }
    console.log(`✓ site_settings: seeded ${Object.keys(heroSettings).length} row(s)`);
  }

  await connection.end();
  console.log("✓ Content seed complete");
}

main().catch((err) => {
  console.error("Content seed failed:", err.message);
  process.exit(1);
});
