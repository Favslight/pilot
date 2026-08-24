import { FastifyInstance } from "fastify";
import { ZodSchema } from "zod";
import { CrudController } from "../controllers/crud.controller";
import { authenticate, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { BaseRepository } from "../repositories/base.repository";
import { BaseService } from "../services/base.service";
import { paginationSchema, uuidParamSchema } from "../validators/common";

export const registerCrudRoutes = <T extends { id: string }>(
  app: FastifyInstance,
  prefix: string,
  label: string,
  repository: BaseRepository<T>,
  schema: ZodSchema,
  updateSchema: ZodSchema = (schema as never as { partial: () => ZodSchema }).partial(),
) => {
  const controller = new CrudController(new BaseService(repository, label), label);
  app.get(prefix, { preHandler: [authenticate, validate(paginationSchema, "query")] }, controller.list);
  app.post(prefix, { preHandler: [authenticate, authorize("Administrator"), validate(schema)] }, controller.create);
  app.put(`${prefix}/:id`, { preHandler: [authenticate, authorize("Administrator"), validate(uuidParamSchema, "params"), validate(updateSchema)] }, controller.update);
  app.delete(`${prefix}/:id`, { preHandler: [authenticate, authorize("Administrator"), validate(uuidParamSchema, "params")] }, controller.delete);
};
