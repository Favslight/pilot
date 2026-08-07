CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(80) NOT NULL UNIQUE,
  description TEXT,
  is_system BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fullname VARCHAR(160) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','suspended')),
  last_login TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS academic_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_name VARCHAR(20) NOT NULL UNIQUE,
  is_current BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS one_current_academic_session ON academic_sessions (is_current) WHERE is_current;

CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120) NOT NULL UNIQUE,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(20) NOT NULL UNIQUE,
  level VARCHAR(20) NOT NULL CHECK (level IN ('junior','senior')),
  display_order INT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS class_arms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(40) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(120) NOT NULL,
  table_name VARCHAR(120) NOT NULL,
  record_id UUID,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS school_information (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_name VARCHAR(180) NOT NULL,
  school_code VARCHAR(40) NOT NULL UNIQUE,
  motto VARCHAR(220),
  email VARCHAR(160),
  phone VARCHAR(40),
  alternate_phone VARCHAR(40),
  website VARCHAR(220),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) NOT NULL DEFAULT 'Nigeria',
  postal_code VARCHAR(40),
  principal_name VARCHAR(160),
  vice_principal_name VARCHAR(160),
  school_logo_url TEXT,
  school_logo_public_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT only_one_school_information CHECK (id = '00000000-0000-0000-0000-000000000001'::uuid)
);

CREATE TABLE IF NOT EXISTS terms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES academic_sessions(id) ON DELETE CASCADE,
  term_name VARCHAR(40) NOT NULL,
  display_order INT NOT NULL CHECK (display_order BETWEEN 1 AND 3),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'inactive' CHECK (status IN ('active','inactive','closed','archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_term_dates CHECK (end_date >= start_date),
  CONSTRAINT unique_session_term UNIQUE (session_id, term_name),
  CONSTRAINT unique_session_term_order UNIQUE (session_id, display_order)
);

CREATE UNIQUE INDEX IF NOT EXISTS one_active_term ON terms (status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_terms_session_id ON terms(session_id);

CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120) NOT NULL UNIQUE,
  description TEXT,
  module VARCHAR(80) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admission_number VARCHAR(40) NOT NULL UNIQUE,
  firstname VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  middlename VARCHAR(100),
  gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male','Female')),
  date_of_birth DATE NOT NULL,
  place_of_birth VARCHAR(120),
  state_of_origin VARCHAR(100),
  lga VARCHAR(100),
  nationality VARCHAR(100) NOT NULL DEFAULT 'Nigeria',
  religion VARCHAR(80),
  blood_group VARCHAR(10),
  genotype VARCHAR(10),
  phone VARCHAR(40),
  email VARCHAR(160),
  home_address TEXT,
  admission_date DATE NOT NULL,
  admission_year INT NOT NULL,
  expected_graduation_year INT,
  current_status VARCHAR(30) NOT NULL DEFAULT 'Active' CHECK (current_status IN ('Active','Graduated','Transferred','Withdrawn','Suspended','Expelled','Deceased','Archived')),
  passport_url TEXT,
  passport_public_id TEXT,
  remarks TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_guardians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  relationship VARCHAR(30) NOT NULL CHECK (relationship IN ('Father','Mother','Guardian','Sponsor')),
  fullname VARCHAR(160) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  alternate_phone VARCHAR(40),
  email VARCHAR(160),
  occupation VARCHAR(120),
  address TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS one_primary_guardian_per_student ON student_guardians(student_id) WHERE is_primary;

CREATE TABLE IF NOT EXISTS student_medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL UNIQUE REFERENCES students(id) ON DELETE CASCADE,
  blood_group VARCHAR(10),
  genotype VARCHAR(10),
  allergies TEXT,
  medical_conditions TEXT,
  physical_disability TEXT,
  hospital_name VARCHAR(160),
  hospital_phone VARCHAR(40),
  doctor_name VARCHAR(160),
  medical_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  document_type VARCHAR(40) NOT NULL CHECK (document_type IN ('Birth Certificate','Admission Letter','Transfer Letter','Passport','Medical Report','Other')),
  file_name VARCHAR(220) NOT NULL,
  file_url TEXT NOT NULL,
  public_id TEXT NOT NULL,
  file_size BIGINT,
  mime_type VARCHAR(120),
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  fullname VARCHAR(160) NOT NULL,
  relationship VARCHAR(80),
  phone VARCHAR(40) NOT NULL,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_academic_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  academic_session_id UUID NOT NULL REFERENCES academic_sessions(id) ON DELETE RESTRICT,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE RESTRICT,
  arm_id UUID NOT NULL REFERENCES class_arms(id) ON DELETE RESTRICT,
  academic_status VARCHAR(30) NOT NULL DEFAULT 'Active' CHECK (academic_status IN ('Active','Repeated','Transferred','Withdrawn','Graduated')),
  remarks TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_student_session_record UNIQUE (student_id, academic_session_id)
);

CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_number VARCHAR(30) NOT NULL UNIQUE,
  firstname VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  middlename VARCHAR(100),
  gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male','Female')),
  date_of_birth DATE,
  phone VARCHAR(40),
  alternate_phone VARCHAR(40),
  email VARCHAR(160) UNIQUE,
  address TEXT,
  state_of_origin VARCHAR(100),
  lga VARCHAR(100),
  nationality VARCHAR(100) NOT NULL DEFAULT 'Nigeria',
  religion VARCHAR(80),
  qualification VARCHAR(180),
  employment_date DATE NOT NULL,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
  designation VARCHAR(120) NOT NULL,
  employment_type VARCHAR(30) NOT NULL CHECK (employment_type IN ('Teaching','Non-Teaching','Contract','Temporary')),
  status VARCHAR(30) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active','On Leave','Retired','Resigned','Suspended','Terminated','Archived')),
  passport_url TEXT,
  passport_public_id TEXT,
  remarks TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS school_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_code VARCHAR(40) NOT NULL UNIQUE,
  asset_name VARCHAR(160) NOT NULL,
  category VARCHAR(120) NOT NULL,
  serial_number VARCHAR(120),
  purchase_date DATE,
  condition VARCHAR(30) NOT NULL DEFAULT 'Good' CHECK (condition IN ('New','Good','Fair','Damaged')),
  current_location VARCHAR(160),
  assigned_staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'Available' CHECK (status IN ('Available','Assigned','Under Maintenance','Retired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_permissions_module ON permissions(module);
CREATE INDEX IF NOT EXISTS idx_students_name ON students(lastname, firstname);
CREATE INDEX IF NOT EXISTS idx_students_admission_year ON students(admission_year);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(current_status);
CREATE INDEX IF NOT EXISTS idx_students_gender ON students(gender);
CREATE INDEX IF NOT EXISTS idx_students_deleted_at ON students(deleted_at);
CREATE INDEX IF NOT EXISTS idx_student_guardians_student_id ON student_guardians(student_id);
CREATE INDEX IF NOT EXISTS idx_student_documents_student_id ON student_documents(student_id);
CREATE INDEX IF NOT EXISTS idx_academic_records_student_id ON student_academic_records(student_id);
CREATE INDEX IF NOT EXISTS idx_academic_records_session_id ON student_academic_records(academic_session_id);
CREATE INDEX IF NOT EXISTS idx_academic_records_class_arm ON student_academic_records(class_id, arm_id);
CREATE INDEX IF NOT EXISTS idx_academic_records_status ON student_academic_records(academic_status);
CREATE INDEX IF NOT EXISTS idx_staff_department_id ON staff(department_id);
CREATE INDEX IF NOT EXISTS idx_staff_status ON staff(status);
CREATE INDEX IF NOT EXISTS idx_staff_employment_type ON staff(employment_type);
CREATE INDEX IF NOT EXISTS idx_staff_name ON staff(lastname, firstname);
CREATE INDEX IF NOT EXISTS idx_staff_deleted_at ON staff(deleted_at);
CREATE INDEX IF NOT EXISTS idx_assets_category ON school_assets(category);
CREATE INDEX IF NOT EXISTS idx_assets_status ON school_assets(status);

CREATE OR REPLACE VIEW current_student_academic_status AS
SELECT DISTINCT ON (ar.student_id)
  ar.student_id,
  ar.id AS academic_record_id,
  ar.academic_session_id,
  ac.session_name,
  ar.class_id,
  c.name AS class_name,
  c.display_order AS class_display_order,
  ar.arm_id,
  ca.name AS arm_name,
  ar.academic_status,
  ar.remarks,
  ar.created_at AS academic_record_created_at,
  ar.updated_at AS academic_record_updated_at
FROM student_academic_records ar
JOIN academic_sessions ac ON ac.id = ar.academic_session_id
JOIN classes c ON c.id = ar.class_id
JOIN class_arms ca ON ca.id = ar.arm_id
ORDER BY ar.student_id, ac.session_name DESC, ar.created_at DESC;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION enforce_single_current_session()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_current = TRUE THEN
    UPDATE academic_sessions SET is_current = FALSE WHERE id <> NEW.id AND is_current = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION enforce_single_active_term()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' THEN
    UPDATE terms SET status = 'inactive' WHERE id <> NEW.id AND status = 'active';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_roles_updated_at ON roles;
CREATE TRIGGER set_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS set_users_updated_at ON users;
CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS set_sessions_updated_at ON academic_sessions;
CREATE TRIGGER set_sessions_updated_at BEFORE UPDATE ON academic_sessions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS enforce_single_current_session_trigger ON academic_sessions;
CREATE TRIGGER enforce_single_current_session_trigger BEFORE INSERT OR UPDATE ON academic_sessions FOR EACH ROW EXECUTE FUNCTION enforce_single_current_session();
DROP TRIGGER IF EXISTS set_departments_updated_at ON departments;
CREATE TRIGGER set_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS set_classes_updated_at ON classes;
CREATE TRIGGER set_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS set_class_arms_updated_at ON class_arms;
CREATE TRIGGER set_class_arms_updated_at BEFORE UPDATE ON class_arms FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS set_school_information_updated_at ON school_information;
CREATE TRIGGER set_school_information_updated_at BEFORE UPDATE ON school_information FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS set_terms_updated_at ON terms;
CREATE TRIGGER set_terms_updated_at BEFORE UPDATE ON terms FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS enforce_single_active_term_trigger ON terms;
CREATE TRIGGER enforce_single_active_term_trigger BEFORE INSERT OR UPDATE ON terms FOR EACH ROW EXECUTE FUNCTION enforce_single_active_term();
DROP TRIGGER IF EXISTS set_students_updated_at ON students;
CREATE TRIGGER set_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS set_student_guardians_updated_at ON student_guardians;
CREATE TRIGGER set_student_guardians_updated_at BEFORE UPDATE ON student_guardians FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS set_student_medical_records_updated_at ON student_medical_records;
CREATE TRIGGER set_student_medical_records_updated_at BEFORE UPDATE ON student_medical_records FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS set_student_contacts_updated_at ON student_contacts;
CREATE TRIGGER set_student_contacts_updated_at BEFORE UPDATE ON student_contacts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS set_student_academic_records_updated_at ON student_academic_records;
CREATE TRIGGER set_student_academic_records_updated_at BEFORE UPDATE ON student_academic_records FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS set_staff_updated_at ON staff;
CREATE TRIGGER set_staff_updated_at BEFORE UPDATE ON staff FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS set_school_assets_updated_at ON school_assets;
CREATE TRIGGER set_school_assets_updated_at BEFORE UPDATE ON school_assets FOR EACH ROW EXECUTE FUNCTION set_updated_at();
