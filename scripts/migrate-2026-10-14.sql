-- Migration for EXISTING installs (fresh installs get this from schema.sql).
-- Idempotent: each step checks information_schema first, so it is safe to re-run.
-- Run against the app database:  mysql -u <user> -p velvet_keepsake < scripts/migrate-2026-10-14.sql

USE velvet_keepsake;

-- 0. Pre-flight: UNIQUE(photos.public_id) fails if duplicates exist. Inspect with:
--    SELECT public_id, COUNT(*) c FROM photos WHERE public_id IS NOT NULL GROUP BY public_id HAVING c > 1;
--    Remove/repair duplicate rows before running this script. (NULLs are allowed to repeat.)

-- 1. photos: UNIQUE (public_id)
SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.statistics
    WHERE table_schema = DATABASE() AND table_name = 'photos' AND index_name = 'uq_photos_public_id') = 0,
  'ALTER TABLE photos ADD UNIQUE KEY uq_photos_public_id (public_id)',
  'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 2. photos: composite (category, created_at) replaces single-column category index
SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.statistics
    WHERE table_schema = DATABASE() AND table_name = 'photos' AND index_name = 'idx_category_created_at') = 0,
  'ALTER TABLE photos ADD INDEX idx_category_created_at (category, created_at)',
  'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.statistics
    WHERE table_schema = DATABASE() AND table_name = 'photos' AND index_name = 'idx_category') > 0,
  'ALTER TABLE photos DROP INDEX idx_category',
  'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 3. inquiries: INDEX (created_at) for ORDER BY created_at DESC
SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.statistics
    WHERE table_schema = DATABASE() AND table_name = 'inquiries' AND index_name = 'idx_inquiries_created_at') = 0,
  'ALTER TABLE inquiries ADD INDEX idx_inquiries_created_at (created_at)',
  'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
