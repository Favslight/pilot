import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository";
import { AppError } from "../utils/errors";

export class UserService {
  constructor(private users = new UserRepository()) {}

  list(options: { page: number; limit: number; search?: string }) {
    return this.users.list(options);
  }

  async create(data: Record<string, unknown>) {
    return this.users.create({ ...data, password: await bcrypt.hash(String(data.password), 12) });
  }

  async update(id: string, data: Record<string, unknown>) {
    const payload = { ...data };
    if (payload.password) payload.password = await bcrypt.hash(String(payload.password), 12);
    const user = await this.users.update(id, payload);
    if (!user) throw new AppError("User not found", 404);
    return this.users.findPublicById(id);
  }

  async delete(id: string) {
    const user = await this.users.softDelete(id);
    if (!user) throw new AppError("User not found", 404);
    return user;
  }
}
