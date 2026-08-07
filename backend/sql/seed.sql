INSERT INTO roles (name, description, is_system) VALUES
('Administrator','Full system administration access', TRUE),
('Principal','School principal records oversight', TRUE),
('Vice Principal','Deputy administrative access', TRUE),
('Registrar','Admissions and academic records access', TRUE),
('Data Entry Officer','Operational data entry access', TRUE)
ON CONFLICT (name) DO NOTHING;

INSERT INTO academic_sessions (session_name, is_current, status)
VALUES ('2026/2027', TRUE, 'active')
ON CONFLICT (session_name) DO UPDATE SET is_current = EXCLUDED.is_current, status = EXCLUDED.status;

INSERT INTO departments (name, description, status) VALUES
('Administration','School administration','active'),
('Science','Science department','active'),
('Arts','Arts department','active'),
('Commercial','Commercial department','active'),
('ICT','Information and communication technology','active'),
('Accounts','Finance and accounts','active'),
('Guidance & Counseling','Student guidance and counseling','active')
ON CONFLICT (name) DO NOTHING;

INSERT INTO classes (name, level, display_order) VALUES
('JSS1','junior',1),('JSS2','junior',2),('JSS3','junior',3),
('SS1','senior',4),('SS2','senior',5),('SS3','senior',6)
ON CONFLICT (name) DO NOTHING;

INSERT INTO class_arms (name) VALUES
('A'),('B'),('C'),('D'),('Science'),('Arts'),('Commercial')
ON CONFLICT (name) DO NOTHING;

INSERT INTO school_information (
  id, school_name, school_code, motto, email, phone, address, city, state, country, principal_name, vice_principal_name
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Pilot Secondary School',
  'PSS',
  'Knowledge and Character',
  'admin@pilotsecondary.school',
  '+2340000000000',
  'Pilot Secondary School Campus',
  'Lagos',
  'Lagos',
  'Nigeria',
  'Principal',
  'Vice Principal'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO permissions (name, description, module) VALUES
('users.view','View users','Users'),
('users.create','Create users','Users'),
('users.edit','Edit users','Users'),
('users.delete','Delete users','Users'),
('users.reset_password','Reset user passwords','Users'),
('roles.view','View roles','Roles'),
('roles.create','Create roles','Roles'),
('roles.edit','Edit roles','Roles'),
('roles.delete','Delete roles','Roles'),
('permissions.assign','Assign role permissions','Roles'),
('sessions.manage','Manage academic sessions','Academic'),
('terms.manage','Manage terms','Academic'),
('departments.manage','Manage departments','Settings'),
('classes.manage','Manage classes','Settings'),
('arms.manage','Manage class arms','Settings'),
('settings.manage','Manage school information','Settings'),
('reports.view','View reports','Reports'),
('reports.export','Export reports','Reports'),
('students.create','Create student records','Students'),
('students.view','View student records','Students'),
('students.edit','Edit student records','Students'),
('students.delete','Delete student records','Students'),
('students.archive','Archive student records','Students'),
('students.documents','Manage student documents','Students'),
('academic_records.view','View academic records','Academic'),
('academic_records.create','Create academic records','Academic'),
('academic_records.edit','Edit academic records','Academic'),
('academic_records.delete','Delete academic records','Academic'),
('academic_records.promote','Promote students','Academic'),
('staff.create','Create staff records','Staff'),
('staff.view','View staff records','Staff'),
('staff.edit','Edit staff records','Staff'),
('staff.delete','Delete staff records','Staff'),
('assets.manage','Manage school assets','Assets')
ON CONFLICT (name) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p WHERE r.name = 'Administrator'
ON CONFLICT DO NOTHING;

INSERT INTO terms (session_id, term_name, display_order, start_date, end_date, status)
SELECT id, 'First Term', 1, '2026-09-01', '2026-12-18', 'active' FROM academic_sessions WHERE session_name = '2026/2027'
ON CONFLICT (session_id, term_name) DO NOTHING;
INSERT INTO terms (session_id, term_name, display_order, start_date, end_date, status)
SELECT id, 'Second Term', 2, '2027-01-11', '2027-04-09', 'inactive' FROM academic_sessions WHERE session_name = '2026/2027'
ON CONFLICT (session_id, term_name) DO NOTHING;
INSERT INTO terms (session_id, term_name, display_order, start_date, end_date, status)
SELECT id, 'Third Term', 3, '2027-05-03', '2027-07-30', 'inactive' FROM academic_sessions WHERE session_name = '2026/2027'
ON CONFLICT (session_id, term_name) DO NOTHING;

INSERT INTO academic_sessions (session_name, is_current, status) VALUES
('2021/2022', FALSE, 'archived'),
('2022/2023', FALSE, 'archived'),
('2023/2024', FALSE, 'archived'),
('2024/2025', FALSE, 'archived'),
('2025/2026', FALSE, 'archived')
ON CONFLICT (session_name) DO NOTHING;

INSERT INTO users (fullname, email, password, role, status)
SELECT seed.fullname, seed.email, '$2b$12$ER2Q7Ws4iaTyu0Hfb2jit.YndmFAJ.H2ZDCVnZFqX7l4GU7Y5Hi1i', r.id, 'active'
FROM (VALUES
  ('Administrator','admin@pilot.test','Administrator'),
  ('Principal','principal@pilot.test','Principal'),
  ('Data Entry','dataentry@pilot.test','Data Entry Officer')
) AS seed(fullname, email, role_name)
JOIN roles r ON r.name = seed.role_name
ON CONFLICT (email) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r
JOIN permissions p ON p.name IN ('students.view','students.create','students.edit','academic_records.view','reports.view','staff.view')
WHERE r.name IN ('Principal','Registrar','Data Entry Officer')
ON CONFLICT DO NOTHING;

WITH names AS (
  SELECT * FROM (VALUES
    (1,'Mariam','Johnson','Female','Lagos','Christianity'),(2,'David','Usman','Male','Kaduna','Islam'),
    (3,'Chinonso','Okeke','Male','Anambra','Christianity'),(4,'Aisha','Bello','Female','Kano','Islam'),
    (5,'Timi','George','Male','Rivers','Christianity'),(6,'Blessing','Eze','Female','Enugu','Christianity'),
    (7,'Samuel','Adeyemi','Male','Oyo','Christianity'),(8,'Fatima','Sani','Female','Katsina','Islam'),
    (9,'Daniel','Akpan','Male','Akwa Ibom','Christianity'),(10,'Zainab','Lawal','Female','Sokoto','Islam'),
    (11,'Ifeoma','Nwosu','Female','Imo','Christianity'),(12,'Peter','Ojo','Male','Ogun','Christianity')
  ) AS n(idx, firstname, lastname, gender, state_of_origin, religion)
), generated AS (
  SELECT gs AS seq, n.firstname, n.lastname, n.gender, n.state_of_origin, n.religion,
    ((gs - 1) % 6) + 1 AS class_order,
    2021 + ((gs - 1) % 6) AS admission_year
  FROM generate_series(1,72) gs
  JOIN names n ON n.idx = ((gs - 1) % 12) + 1
)
INSERT INTO students (
  admission_number, firstname, lastname, middlename, gender, date_of_birth, place_of_birth,
  state_of_origin, lga, nationality, religion, phone, email, home_address, admission_date,
  admission_year, expected_graduation_year, current_status, remarks
)
SELECT
  'PSS/' || admission_year || '/' || LPAD(seq::text, 4, '0'),
  firstname, lastname, 'Demo', gender,
  DATE '2010-01-01' + (seq * INTERVAL '37 days'),
  'Lagos', state_of_origin, 'Central', 'Nigeria', religion,
  '+234800' || LPAD(seq::text, 7, '0'),
  LOWER(firstname || '.' || lastname || seq || '@student.demo'),
  seq || ' Pilot Avenue, Lagos',
  MAKE_DATE(admission_year, 9, 1),
  admission_year,
  admission_year + 6,
  CASE WHEN class_order = 6 AND seq % 5 = 0 THEN 'Graduated' ELSE 'Active' END,
  'Seeded demonstration student record.'
FROM generated
ON CONFLICT (admission_number) DO NOTHING;

INSERT INTO student_guardians (student_id, relationship, fullname, phone, email, occupation, address, is_primary)
SELECT id, 'Guardian', 'Guardian of ' || firstname || ' ' || lastname, '+234700' || RIGHT(REPLACE(id::text,'-',''), 7),
  'guardian.' || admission_number || '@demo.test', 'Civil Servant', home_address, TRUE
FROM students
WHERE admission_number LIKE 'PSS/%'
ON CONFLICT DO NOTHING;

INSERT INTO student_medical_records (student_id, blood_group, genotype, allergies, medical_conditions, physical_disability, medical_notes)
SELECT id,
  CASE WHEN EXTRACT(DAY FROM created_at)::int % 4 = 0 THEN 'O+' WHEN EXTRACT(DAY FROM created_at)::int % 4 = 1 THEN 'A+' WHEN EXTRACT(DAY FROM created_at)::int % 4 = 2 THEN 'B+' ELSE 'AB+' END,
  CASE WHEN EXTRACT(DAY FROM created_at)::int % 3 = 0 THEN 'AA' WHEN EXTRACT(DAY FROM created_at)::int % 3 = 1 THEN 'AS' ELSE 'SS' END,
  'None', 'None', 'None', 'Seeded medical summary.'
FROM students
ON CONFLICT (student_id) DO NOTHING;

INSERT INTO student_academic_records (student_id, academic_session_id, class_id, arm_id, academic_status, remarks, created_by)
SELECT s.id, sess.id, cls.id, arm.id,
  CASE WHEN cls.name = 'SS3' AND s.current_status = 'Graduated' THEN 'Graduated'
       WHEN RIGHT(s.admission_number, 1) = '7' THEN 'Repeated'
       ELSE 'Active' END,
  'Seeded academic progression for thesis demonstration.',
  u.id
FROM students s
JOIN academic_sessions sess ON sess.session_name = '2026/2027'
JOIN classes cls ON cls.display_order = (((RIGHT(s.admission_number, 2))::int - 1) % 6) + 1
JOIN class_arms arm ON arm.name = CASE WHEN cls.level = 'senior' THEN CASE WHEN ((RIGHT(s.admission_number, 2))::int % 3) = 0 THEN 'Science' WHEN ((RIGHT(s.admission_number, 2))::int % 3) = 1 THEN 'Arts' ELSE 'Commercial' END ELSE CASE WHEN ((RIGHT(s.admission_number, 2))::int % 4) = 0 THEN 'A' WHEN ((RIGHT(s.admission_number, 2))::int % 4) = 1 THEN 'B' WHEN ((RIGHT(s.admission_number, 2))::int % 4) = 2 THEN 'C' ELSE 'D' END END
LEFT JOIN users u ON u.email = 'admin@pilot.test'
ON CONFLICT (student_id, academic_session_id) DO NOTHING;

INSERT INTO staff (
  staff_number, firstname, lastname, middlename, gender, date_of_birth, phone, email, address,
  state_of_origin, lga, nationality, religion, qualification, employment_date, department_id,
  designation, employment_type, status, remarks
)
SELECT 'PSS/STF/' || LPAD(gs::text, 4, '0'),
  (ARRAY['Helen','Ibrahim','Grace','Kunle','Amina','Chinedu','Victoria','Musa','Sarah','Emeka','Yusuf','Bolanle','Daniel','Ngozi','Tunde','Fatima','Peter','Ruth'])[gs],
  (ARRAY['Adebayo','Musa','Okafor','Balogun','Sani','Nwankwo','George','Lawal','Etim','Eze','Bello','Ojo','Akpan','Nwosu','Adeyemi','Garba','Okon','Ibe'])[gs],
  'Demo',
  CASE WHEN gs % 2 = 0 THEN 'Male' ELSE 'Female' END,
  DATE '1980-01-01' + (gs * INTERVAL '280 days'),
  '+234805' || LPAD(gs::text, 7, '0'),
  'staff' || gs || '@pilot.test',
  gs || ' Staff Close, Lagos',
  (ARRAY['Lagos','Oyo','Kaduna','Enugu','Rivers','Kano'])[((gs - 1) % 6) + 1],
  'Central', 'Nigeria',
  CASE WHEN gs % 3 = 0 THEN 'Islam' ELSE 'Christianity' END,
  CASE WHEN gs % 2 = 0 THEN 'B.Ed' ELSE 'B.Sc' END,
  DATE '2018-09-01' + (gs * INTERVAL '45 days'),
  d.id,
  (ARRAY['Principal','Vice Principal','Registrar','ICT Officer','Accountant','Guidance Counselor','Biology Teacher','English Teacher','Mathematics Teacher','Physics Teacher','Chemistry Teacher','Economics Teacher','Government Teacher','Clerical Officer','Librarian','Lab Assistant','Security Supervisor','Sports Coordinator'])[gs],
  CASE WHEN gs BETWEEN 7 AND 13 THEN 'Teaching' WHEN gs IN (1,2,3) THEN 'Teaching' ELSE 'Non-Teaching' END,
  CASE WHEN gs = 15 THEN 'Retired' WHEN gs = 16 THEN 'On Leave' ELSE 'Active' END,
  'Seeded demonstration staff record.'
FROM generate_series(1,18) gs
JOIN departments d ON d.name = (ARRAY['Administration','Science','Arts','Commercial','ICT','Accounts','Guidance & Counseling'])[((gs - 1) % 7) + 1]
ON CONFLICT (staff_number) DO NOTHING;

INSERT INTO school_assets (asset_code, asset_name, category, serial_number, purchase_date, condition, current_location, status)
SELECT 'PSS/AST/' || LPAD(gs::text, 4, '0'),
  (ARRAY['Desktop Computer','Projector','Laboratory Microscope','Library Desk','Office Chair','Football Kit','School Bus','Printer'])[((gs - 1) % 8) + 1],
  (ARRAY['Computers','Projectors','Laboratory equipment','Library furniture','Office furniture','Sports equipment','School buses','ICT'])[((gs - 1) % 8) + 1],
  'SN-' || LPAD(gs::text, 6, '0'),
  DATE '2022-01-01' + (gs * INTERVAL '21 days'),
  CASE WHEN gs % 5 = 0 THEN 'Fair' WHEN gs % 7 = 0 THEN 'Damaged' ELSE 'Good' END,
  (ARRAY['ICT Lab','Science Lab','Library','Administration Office','Sports Store','Classroom Block'])[((gs - 1) % 6) + 1],
  CASE WHEN gs % 6 = 0 THEN 'Under Maintenance' WHEN gs % 4 = 0 THEN 'Assigned' ELSE 'Available' END
FROM generate_series(1,24) gs
ON CONFLICT (asset_code) DO NOTHING;
