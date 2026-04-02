-- ============================================
-- PhoneBook App - Database Schema
-- Jalankan perintah ini di MySQL untuk setup
-- ============================================

-- 1. Buat database
CREATE DATABASE IF NOT EXISTS phones_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 2. Gunakan database
USE phones_db;

-- 3. Buat tabel phones
CREATE TABLE IF NOT EXISTS phones (
  id    INT          NOT NULL AUTO_INCREMENT,
  name  VARCHAR(100) NOT NULL,
  phone VARCHAR(20)  NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. (Opsional) Contoh data awal
INSERT INTO phones (name, phone) VALUES
  ('Budi Santoso',   '+62 812-3456-7890'),
  ('Siti Rahayu',    '+62 857-9876-5432'),
  ('Ahmad Fauzi',    '+62 821-1111-2222'),
  ('Dewi Lestari',   '+62 838-3333-4444');
