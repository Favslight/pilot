import { BaseRepository } from "../repositories/base.repository";
import { AppError } from "../utils/errors";

export class BaseService<T extends { id: string }> {
  constructor(private repository: BaseRepository<T>, private label: string) {}

  list(options: { page: number; limit: number; search?: string }) {
    return this.repository.list(options);
  }

  async create(data: Record<string, unknown>) {
    return this.repository.create(data);
  }

  async update(id: string, data: Record<string, unknown>) {
    const item = await this.repository.update(id, data);
    if (!item) throw new AppError(`${this.label} not found`, 404);
    return item;
  }

  async delete(id: string) {
    const item = await this.repository.delete(id);
    if (!item) throw new AppError(`${this.label} not found`, 404);
    return item;
  }
}
