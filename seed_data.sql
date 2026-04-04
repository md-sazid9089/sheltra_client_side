-- Insert Refugee Profiles
INSERT INTO refugee_profiles (user_id, full_name, alias_name, country, languages, experience_summary, availability, verification_status, created_at, updated_at) VALUES
(2, 'Ahmed Hassan', 'Ahmed', 'Syria', '["Arabic", "English"]', 'Experienced teacher with 10 years in secondary education. Strong background in mathematics and sciences.', 'full_time', 'pending', NOW(), NOW());

-- Insert NGO Profiles
INSERT INTO ngo_profiles (user_id, organization_name, country, contact_email, created_at, updated_at) VALUES
(3, 'Refugee Integration Services', 'Canada', 'contact@risservices.org', NOW(), NOW());

-- Insert Employer Profiles
INSERT INTO employer_profiles (user_id, company_name, industry, website, ethical_hiring_pledge, created_at, updated_at) VALUES
(4, 'TechVision Inc.', 'Technology', 'https://techvision.example.com', 1, NOW(), NOW());

-- Insert Refugee Skills
INSERT INTO refugee_skills (refugee_profile_id, skill_id, level, created_at, updated_at) VALUES
(1, 1, 'advanced', NOW(), NOW()),
(1, 6, 'intermediate', NOW(), NOW());

-- Insert Jobs
INSERT INTO jobs (employer_profile_id, title, description, location, status, required_skills, created_at, updated_at) VALUES
(1, 'Education Coordinator', 'We are looking for an experienced educator to lead our training programs. You will work with refugees to develop professional skills and connect them with employment opportunities. Requirements: 5+ years in education, strong communication skills, and passion for community impact.', 'Toronto, ON', 'open', '["Teaching", "Customer Service"]', NOW(), NOW());

-- Insert Verifications
INSERT INTO verifications (refugee_profile_id, ngo_profile_id, status, notes, created_at, updated_at) VALUES
(1, 1, 'in_review', 'Currently reviewing teaching credentials and certification.', NOW(), NOW());

-- Insert Placements
INSERT INTO placements (refugee_profile_id, job_id, status, created_at, updated_at) VALUES
(1, 1, 'matched', NOW(), NOW());
