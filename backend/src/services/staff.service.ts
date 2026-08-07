import { query } from "../database/pool";
import { writeAuditLog } from "../repositories/audit.repository";
import { StaffRepository } from "../repositories/staff.repository";
import { AppError } from "../utils/errors";

export class StaffService {
  constructor(private staff = new StaffRepository()) {}

  list(options: Record<string, string | number | undefined>) {
    return this.staff.list(options);
  }

  async get(id: string) {
    const record = await this.staff.findById(id);
    if (!record) throw new AppError("Staff record not found", 404);
    const logs = await query("SELECT * FROM audit_logs WHERE table_name = 'staff' AND record_id = $1 ORDER BY created_at DESC LIMIT 20", [id]);
    return { ...record, activity: logs.rows };
  }

  async create(data: Record<string, unknown>, userId?: string, ipAddress?: string) {
    const staffNumber = data.staff_number || await this.staff.generateStaffNumber();
    const record = await this.staff.create({ ...data, staff_number: staffNumber });
    await writeAuditLog({ userId, action: "Staff Created", tableName: "staff", recordId: record.id, ipAddress });
    return record;
  }

  async update(id: string, data: Record<string, unknown>, userId?: string, ipAddress?: string) {
    const record = await this.staff.update(id, data);
    if (!record) throw new AppError("Staff record not found", 404);
    await writeAuditLog({ userId, action: data.status ? "Status Changed" : "Staff Updated", tableName: "staff", recordId: id, ipAddress });
    return record;
  }

  async archive(id: string, userId?: string, ipAddress?: string) {
    const record = await this.staff.archive(id);
    if (!record) throw new AppError("Staff record not found", 404);
    await writeAuditLog({ userId, action: "Staff Archived", tableName: "staff", recordId: id, ipAddress });
    return record;
  }
}
