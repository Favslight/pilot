import { query } from "../database/pool";
import { writeAuditLog } from "../repositories/audit.repository";
import { AcademicRecordRepository } from "../repositories/academic-record.repository";
import { AppError } from "../utils/errors";

export class AcademicRecordService {
  constructor(private records = new AcademicRecordRepository()) {}

  list(options: Record<string, string | number | undefined>) {
    return this.records.list(options);
  }

  async get(id: string) {
    const record = await this.records.findById(id);
    if (!record) throw new AppError("Academic record not found", 404);
    return record;
  }

  async create(data: Record<string, unknown>, userId?: string, ipAddress?: string) {
    const record = await this.records.create({ ...data, created_by: userId || null });
    await writeAuditLog({ userId, action: "Academic Record Created", tableName: "student_academic_records", recordId: record.id, ipAddress });
    return record;
  }

  async update(id: string, data: Record<string, unknown>, userId?: string, ipAddress?: string) {
    const record = await this.records.update(id, data);
    if (!record) throw new AppError("Academic record not found", 404);
    await writeAuditLog({ userId, action: "Academic Record Updated", tableName: "student_academic_records", recordId: id, ipAddress });
    return record;
  }

  async delete(id: string, userId?: string, ipAddress?: string) {
    const record = await this.records.delete(id);
    if (!record) throw new AppError("Academic record not found", 404);
    await writeAuditLog({ userId, action: "Academic Record Deleted", tableName: "student_academic_records", recordId: id, ipAddress });
    return record;
  }

  history(studentId: string) {
    return this.records.history(studentId);
  }

  async promote(studentId: string, data: Record<string, unknown>, userId?: string, ipAddress?: string) {
    const previous = await this.records.latestForStudent(studentId);
    const record = await this.create({ ...data, student_id: studentId }, userId, ipAddress);
    const action = data.academic_status === "Repeated" ? "Student Repeated" : data.academic_status === "Graduated" ? "Student Graduated" : "Student Promoted";
    await writeAuditLog({ userId, action, tableName: "student_academic_records", recordId: record.id, ipAddress });
    return { previous, record };
  }

  async bulkPromote(data: Record<string, unknown>, userId?: string, ipAddress?: string) {
    const studentIds = data.student_ids as string[];
    const sourceStudents = await this.records.classStudents(String(data.source_session_id), String(data.source_class_id), String(data.source_arm_id));
    const sourceIds = new Set(sourceStudents.map((student) => student.id));
    for (const studentId of studentIds) {
      if (!sourceIds.has(studentId)) throw new AppError("One or more selected students do not belong to the source class", 422);
    }
    await query("BEGIN");
    try {
      const created = [];
      for (const studentId of studentIds) {
        const exists = await query("SELECT id FROM student_academic_records WHERE student_id = $1 AND academic_session_id = $2", [studentId, data.destination_session_id]);
        if (exists.rows[0]) throw new AppError("A selected student already has a record for the destination session", 409);
        const result = await query(
          `INSERT INTO student_academic_records (student_id, academic_session_id, class_id, arm_id, academic_status, remarks, created_by)
           VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
          [studentId, data.destination_session_id, data.destination_class_id, data.destination_arm_id, data.academic_status, data.remarks || null, userId || null],
        );
        created.push(result.rows[0]);
      }
      await query("COMMIT");
      for (const record of created) {
        await writeAuditLog({ userId, action: "Bulk Promotion", tableName: "student_academic_records", recordId: record.id, ipAddress });
      }
      return created;
    } catch (error) {
      await query("ROLLBACK");
      throw error;
    }
  }
}
