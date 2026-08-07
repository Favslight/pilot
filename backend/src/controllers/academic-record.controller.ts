import { FastifyReply, FastifyRequest } from "fastify";
import { AcademicRecordService } from "../services/academic-record.service";
import { sendSuccess } from "../utils/response";

export class AcademicRecordController {
  constructor(private service = new AcademicRecordService()) {}

  list = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Academic records retrieved", await this.service.list(request.query as never));
  create = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Academic record created", await this.service.create(request.body as never, request.authUser?.id, request.ip), 201);
  get = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Academic record retrieved", await this.service.get((request.params as { id: string }).id));
  update = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Academic record updated", await this.service.update((request.params as { id: string }).id, request.body as never, request.authUser?.id, request.ip));
  delete = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Academic record deleted", await this.service.delete((request.params as { id: string }).id, request.authUser?.id, request.ip));
  history = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Academic history retrieved", await this.service.history((request.params as { id: string }).id));
  promote = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Student promoted", await this.service.promote((request.params as { id: string }).id, request.body as never, request.authUser?.id, request.ip), 201);
  bulkPromote = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Students promoted", await this.service.bulkPromote(request.body as never, request.authUser?.id, request.ip), 201);
}
