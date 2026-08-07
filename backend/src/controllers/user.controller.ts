import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../services/user.service";
import { sendSuccess } from "../utils/response";

export class UserController {
  constructor(private service = new UserService()) {}

  list = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Users retrieved", await this.service.list(request.query as never));
  create = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "User created", await this.service.create(request.body as never), 201);
  update = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    return sendSuccess(reply, "User updated", await this.service.update(id, request.body as never));
  };
  delete = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    return sendSuccess(reply, "User deleted", await this.service.delete(id));
  };
}
