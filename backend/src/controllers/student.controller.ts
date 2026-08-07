import { FastifyReply, FastifyRequest } from "fastify";
import { StudentService } from "../services/student.service";
import { sendSuccess } from "../utils/response";

export class StudentController {
  constructor(private service = new StudentService()) {}

  list = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Students retrieved", await this.service.list(request.query as never));
  create = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Student created", await this.service.create(request.body as never, request.authUser?.id, request.ip), 201);
  profile = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Student profile retrieved", await this.service.profile((request.params as { id: string }).id));
  update = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Student updated", await this.service.update((request.params as { id: string }).id, request.body as never, request.authUser?.id, request.ip));
  archive = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Student archived", await this.service.archive((request.params as { id: string }).id, request.authUser?.id, request.ip));

  guardians = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Guardians retrieved", await this.service.guardians((request.params as { studentId: string }).studentId));
  createGuardian = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Guardian saved", await this.service.saveGuardian((request.params as { studentId: string }).studentId, request.body as never, request.authUser?.id, request.ip), 201);
  updateGuardian = async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { studentId: string; id: string };
    return sendSuccess(reply, "Guardian updated", await this.service.saveGuardian(params.studentId, request.body as never, request.authUser?.id, request.ip, params.id));
  };
  deleteGuardian = async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { studentId: string; id: string };
    await this.service.deleteGuardian(params.studentId, params.id, request.authUser?.id, request.ip);
    return sendSuccess(reply, "Guardian deleted");
  };

  medical = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Medical record retrieved", await this.service.medical((request.params as { studentId: string }).studentId));
  saveMedical = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Medical record saved", await this.service.saveMedical((request.params as { studentId: string }).studentId, request.body as never, request.authUser?.id, request.ip));
  documents = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Documents retrieved", await this.service.documents((request.params as { studentId: string }).studentId));
  addDocument = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Document added", await this.service.addDocument((request.params as { studentId: string }).studentId, request.body as never, request.authUser?.id, request.ip), 201);
  deleteDocument = async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { studentId: string; id: string };
    await this.service.deleteDocument(params.studentId, params.id, request.authUser?.id, request.ip);
    return sendSuccess(reply, "Document deleted");
  };
}
