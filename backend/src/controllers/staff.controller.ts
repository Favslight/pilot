import { FastifyReply, FastifyRequest } from "fastify";
import { StaffService } from "../services/staff.service";
import { sendSuccess } from "../utils/response";

export class StaffController {
  constructor(private service = new StaffService()) {}

  list = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Staff retrieved", await this.service.list(request.query as never));
  create = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Staff created", await this.service.create(request.body as never, request.authUser?.id, request.ip), 201);
  get = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Staff profile retrieved", await this.service.get((request.params as { id: string }).id));
  update = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Staff updated", await this.service.update((request.params as { id: string }).id, request.body as never, request.authUser?.id, request.ip));
  archive = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Staff archived", await this.service.archive((request.params as { id: string }).id, request.authUser?.id, request.ip));
}
