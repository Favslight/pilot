import { query } from "../database/pool";
import { writeAuditLog } from "../repositories/audit.repository";
import { StudentRepository } from "../repositories/student.repository";
import { AppError } from "../utils/errors";

export class StudentService {
  constructor(private students = new StudentRepository()) {}

  list(queryParams: Record<string, string | number | undefined>) {
    return this.students.list(queryParams);
  }

  async create(data: Record<string, unknown>, userId?: string, ipAddress?: string) {
    const admissionYear = Number(data.admission_year);
    const admissionNumber = data.admission_number || await this.students.generateAdmissionNumber(admissionYear);
    const student = await this.students.create({ ...data, admission_number: admissionNumber });
    await writeAuditLog({ userId, action: "Created", tableName: "students", recordId: student.id, ipAddress });
    return student;
  }

  async update(id: string, data: Record<string, unknown>, userId?: string, ipAddress?: string) {
    const student = await this.students.update(id, data);
    if (!student) throw new AppError("Student not found", 404);
    await writeAuditLog({ userId, action: "Updated", tableName: "students", recordId: id, ipAddress });
    return student;
  }

  async archive(id: string, userId?: string, ipAddress?: string) {
    const student = await this.students.archive(id);
    if (!student) throw new AppError("Student not found", 404);
    await writeAuditLog({ userId, action: "Archived", tableName: "students", recordId: id, ipAddress });
    return student;
  }

  async profile(id: string) {
    const profile = await this.students.profile(id);
    if (!profile) throw new AppError("Student not found", 404);
    return profile;
  }

  async guardians(studentId: string) {
    return (await query("SELECT * FROM student_guardians WHERE student_id = $1 ORDER BY is_primary DESC, created_at ASC", [studentId])).rows;
  }

  async saveGuardian(studentId: string, data: Record<string, unknown>, userId?: string, ipAddress?: string, id?: string) {
    if (data.is_primary) await query("UPDATE student_guardians SET is_primary = FALSE WHERE student_id = $1", [studentId]);
    const keys = Object.keys(data);
    const guardian = id
      ? await query(`UPDATE student_guardians SET ${keys.map((key, i) => `${key} = $${i + 1}`).join(",")} WHERE id = $${keys.length + 1} AND student_id = $${keys.length + 2} RETURNING *`, [...keys.map((key) => data[key]), id, studentId])
      : await query(`INSERT INTO student_guardians (student_id,${keys.join(",")}) VALUES ($1,${keys.map((_, i) => `$${i + 2}`).join(",")}) RETURNING *`, [studentId, ...keys.map((key) => data[key])]);
    await writeAuditLog({ userId, action: id ? "Guardian Updated" : "Guardian Added", tableName: "student_guardians", recordId: studentId, ipAddress });
    return guardian.rows[0];
  }

  async deleteGuardian(studentId: string, id: string, userId?: string, ipAddress?: string) {
    await query("DELETE FROM student_guardians WHERE id = $1 AND student_id = $2", [id, studentId]);
    await writeAuditLog({ userId, action: "Guardian Deleted", tableName: "student_guardians", recordId: studentId, ipAddress });
  }

  async medical(studentId: string) {
    return (await query("SELECT * FROM student_medical_records WHERE student_id = $1", [studentId])).rows[0] || null;
  }

  async saveMedical(studentId: string, data: Record<string, unknown>, userId?: string, ipAddress?: string) {
    const keys = Object.keys(data);
    const result = await query(
      `INSERT INTO student_medical_records (student_id,${keys.join(",")}) VALUES ($1,${keys.map((_, i) => `$${i + 2}`).join(",")})
       ON CONFLICT (student_id) DO UPDATE SET ${keys.map((key) => `${key} = EXCLUDED.${key}`).join(",")}
       RETURNING *`,
      [studentId, ...keys.map((key) => data[key])],
    );
    await writeAuditLog({ userId, action: "Medical Updated", tableName: "student_medical_records", recordId: studentId, ipAddress });
    return result.rows[0];
  }

  async documents(studentId: string) {
    return (await query("SELECT * FROM student_documents WHERE student_id = $1 ORDER BY created_at DESC", [studentId])).rows;
  }

  async addDocument(studentId: string, data: Record<string, unknown>, userId?: string, ipAddress?: string) {
    const keys = Object.keys(data);
    const result = await query(`INSERT INTO student_documents (student_id,uploaded_by,${keys.join(",")}) VALUES ($1,$2,${keys.map((_, i) => `$${i + 3}`).join(",")}) RETURNING *`, [studentId, userId || null, ...keys.map((key) => data[key])]);
    await writeAuditLog({ userId, action: "Document Uploaded", tableName: "student_documents", recordId: studentId, ipAddress });
    return result.rows[0];
  }

  async deleteDocument(studentId: string, documentId: string, userId?: string, ipAddress?: string) {
    await query("DELETE FROM student_documents WHERE id = $1 AND student_id = $2", [documentId, studentId]);
    await writeAuditLog({ userId, action: "Document Deleted", tableName: "student_documents", recordId: studentId, ipAddress });
  }
}
