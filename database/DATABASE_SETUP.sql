-- ============================================================================
-- SHELTRA DATABASE SETUP SCRIPT
-- Database-First Approach - SQL Schema and Seed Data
-- ============================================================================

-- Create the database
CREATE DATABASE IF NOT EXISTS sheltra_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sheltra_db;

-- ============================================================================
-- TABLE 1: users
-- ============================================================================
CREATE TABLE users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('refugee', 'ngo', 'employer', 'admin') NOT NULL DEFAULT 'refugee',
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    KEY email_idx (email),
    KEY role_idx (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 2: refugee_profiles
-- ============================================================================
CREATE TABLE refugee_profiles (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    alias_name VARCHAR(255) NULL,
    country VARCHAR(255) NULL,
    languages JSON NULL,
    experience_summary LONGTEXT NULL,
    availability VARCHAR(255) NULL,
    verification_status ENUM('pending', 'in_review', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT refugee_profiles_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    KEY user_id_idx (user_id),
    KEY verification_status_idx (verification_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 3: ngo_profiles
-- ============================================================================
CREATE TABLE ngo_profiles (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    organization_name VARCHAR(255) NOT NULL,
    country VARCHAR(255) NULL,
    contact_email VARCHAR(255) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT ngo_profiles_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    KEY user_id_idx (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 4: employer_profiles
-- ============================================================================
CREATE TABLE employer_profiles (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(255) NULL,
    website VARCHAR(255) NULL,
    ethical_hiring_pledge BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT employer_profiles_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    KEY user_id_idx (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 5: skills
-- ============================================================================
CREATE TABLE skills (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    KEY name_idx (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 6: refugee_skills
-- ============================================================================
CREATE TABLE refugee_skills (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    refugee_profile_id BIGINT UNSIGNED NOT NULL,
    skill_id BIGINT UNSIGNED NOT NULL,
    level VARCHAR(255) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT refugee_skills_refugee_profile_id_foreign FOREIGN KEY (refugee_profile_id) REFERENCES refugee_profiles(id) ON DELETE CASCADE,
    CONSTRAINT refugee_skills_skill_id_foreign FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_refugee_skill (refugee_profile_id, skill_id),
    KEY refugee_profile_id_idx (refugee_profile_id),
    KEY skill_id_idx (skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 7: jobs
-- ============================================================================
CREATE TABLE jobs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    employer_profile_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT NOT NULL,
    location VARCHAR(255) NULL,
    status ENUM('open', 'closed') NOT NULL DEFAULT 'open',
    required_skills JSON NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT jobs_employer_profile_id_foreign FOREIGN KEY (employer_profile_id) REFERENCES employer_profiles(id) ON DELETE CASCADE,
    KEY employer_profile_id_idx (employer_profile_id),
    KEY status_idx (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 8: verifications
-- ============================================================================
CREATE TABLE verifications (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    refugee_profile_id BIGINT UNSIGNED NOT NULL,
    ngo_profile_id BIGINT UNSIGNED NULL,
    status ENUM('pending', 'in_review', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
    notes LONGTEXT NULL,
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT verifications_refugee_profile_id_foreign FOREIGN KEY (refugee_profile_id) REFERENCES refugee_profiles(id) ON DELETE CASCADE,
    CONSTRAINT verifications_ngo_profile_id_foreign FOREIGN KEY (ngo_profile_id) REFERENCES ngo_profiles(id) ON DELETE SET NULL,
    KEY refugee_profile_id_idx (refugee_profile_id),
    KEY ngo_profile_id_idx (ngo_profile_id),
    KEY status_idx (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 9: case_notes
-- ============================================================================
CREATE TABLE case_notes (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    refugee_profile_id BIGINT UNSIGNED NOT NULL,
    ngo_profile_id BIGINT UNSIGNED NOT NULL,
    note LONGTEXT NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT case_notes_refugee_profile_id_foreign FOREIGN KEY (refugee_profile_id) REFERENCES refugee_profiles(id) ON DELETE CASCADE,
    CONSTRAINT case_notes_ngo_profile_id_foreign FOREIGN KEY (ngo_profile_id) REFERENCES ngo_profiles(id) ON DELETE CASCADE,
    KEY refugee_profile_id_idx (refugee_profile_id),
    KEY ngo_profile_id_idx (ngo_profile_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 10: placements
-- ============================================================================
CREATE TABLE placements (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    refugee_profile_id BIGINT UNSIGNED NOT NULL,
    job_id BIGINT UNSIGNED NOT NULL,
    status ENUM('matched', 'placed', 'completed', 'closed') NOT NULL DEFAULT 'matched',
    placed_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT placements_refugee_profile_id_foreign FOREIGN KEY (refugee_profile_id) REFERENCES refugee_profiles(id) ON DELETE CASCADE,
    CONSTRAINT placements_job_id_foreign FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    KEY refugee_profile_id_idx (refugee_profile_id),
    KEY job_id_idx (job_id),
    KEY status_idx (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 11: audit_logs
-- ============================================================================
CREATE TABLE audit_logs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    actor_user_id BIGINT UNSIGNED NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(255) NOT NULL,
    entity_id BIGINT UNSIGNED NULL,
    metadata JSON NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT audit_logs_actor_user_id_foreign FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL,
    KEY actor_user_id_idx (actor_user_id),
    KEY action_idx (action),
    KEY entity_type_idx (entity_type),
    KEY created_at_idx (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 12: personal_access_tokens (Laravel Sanctum)
-- ============================================================================
CREATE TABLE personal_access_tokens (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    abilities LONGTEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    KEY tokenable_type_tokenable_id_idx (tokenable_type, tokenable_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert Skills (must be first due to dependencies)
INSERT INTO skills (name, created_at, updated_at) VALUES
('Teaching', NOW(), NOW()),
('Carpentry', NOW(), NOW()),
('Welding', NOW(), NOW()),
('Plumbing', NOW(), NOW()),
('Nursing', NOW(), NOW()),
('Customer Service', NOW(), NOW());

-- Insert Users (must be before profile creation)
-- Password: password123 (bcrypt hashed)
-- Note: Use the following hash for 'password123':
-- Laravel hash: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO users (name, email, email_verified_at, password, role, created_at, updated_at) VALUES
('Admin User', 'admin@sheltra.test', NOW(), '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NOW(), NOW()),
('Ahmed Hassan', 'refugee@sheltra.test', NOW(), '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'refugee', NOW(), NOW()),
('NGO Coordinator', 'ngo@sheltra.test', NOW(), '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ngo', NOW(), NOW()),
('Employer Manager', 'employer@sheltra.test', NOW(), '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employer', NOW(), NOW());

-- Insert Refugee Profiles
INSERT INTO refugee_profiles (user_id, full_name, alias_name, country, languages, experience_summary, availability, verification_status, created_at, updated_at) VALUES
(2, 'Ahmed Hassan', 'Ahmed', 'Syria', '["Arabic", "English"]', 'Experienced teacher with 10 years in secondary education. Strong background in mathematics and sciences.', 'full_time', 'pending', NOW(), NOW());

-- Insert NGO Profiles
INSERT INTO ngo_profiles (user_id, organization_name, country, contact_email, created_at, updated_at) VALUES
(3, 'Refugee Integration Services', 'Canada', 'contact@risservices.org', NOW(), NOW());

-- Insert Employer Profiles
INSERT INTO employer_profiles (user_id, company_name, industry, website, ethical_hiring_pledge, created_at, updated_at) VALUES
(4, 'TechVision Inc.', 'Technology', 'https://techvision.example.com', TRUE, NOW(), NOW());

-- Insert Refugee Skills
INSERT INTO refugee_skills (refugee_profile_id, skill_id, level, created_at, updated_at) VALUES
(1, 1, 'advanced', NOW(), NOW()),
(1, 6, 'intermediate', NOW(), NOW());

-- Insert Jobs
INSERT INTO jobs (employer_profile_id, title, description, location, status, required_skills, created_at, updated_at) VALUES
(1, 'Education Coordinator', 'We are looking for an experienced educator to lead our training programs. You will work with refugees to develop professional skills and connect them with employment opportunities. Requirements: 5+ years in education, strong communication skills, and passion for community impact.', 'Toronto, ON', 'open', '["Teaching", "Customer Service"]', NOW(), NOW());

-- Insert Verifications
INSERT INTO verifications (refugee_profile_id, ngo_profile_id, status, notes, verified_at, created_at, updated_at) VALUES
(1, 1, 'in_review', 'Currently reviewing teaching credentials and certification.', NULL, NOW(), NOW());

-- Insert Placements
INSERT INTO placements (refugee_profile_id, job_id, status, placed_at, created_at, updated_at) VALUES
(1, 1, 'matched', NULL, NOW(), NOW());

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these queries to verify the setup:

-- Check all tables exist:
-- SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'sheltra_db';

-- Verify user count:
-- SELECT COUNT(*) as user_count FROM users;

-- Check refugee profile with skills:
-- SELECT rp.full_name, s.name as skill, rs.level 
-- FROM refugee_profiles rp 
-- JOIN refugee_skills rs ON rp.id = rs.refugee_profile_id 
-- JOIN skills s ON rs.skill_id = s.id;

-- Test login credentials:
-- Email: admin@sheltra.test | Password: password123
-- Email: refugee@sheltra.test | Password: password123
-- Email: ngo@sheltra.test | Password: password123
-- Email: employer@sheltra.test | Password: password123
