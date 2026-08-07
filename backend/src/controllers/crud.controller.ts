import { FastifyReply, FastifyRequest } from "fastify";
import { BaseService } from "../services/base.service";
import { sendSuccess } from "../utils/response";

export class CrudController<T extends { id: string }> {
  constructor(private service: BaseService<T>, private label: string) {}

  list = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, `${this.label} list retrieved`, await this.service.list(request.query as never));
  create = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, `${this.label} created`, await this.service.create(request.body as never), 201);
  update = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    return sendSuccess(reply, `${this.label} updated`, await this.service.update(id, request.body as never));
  };
  delete = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    return sendSuccess(reply, `${this.label} deleted`, await this.service.delete(id));
  };
}
