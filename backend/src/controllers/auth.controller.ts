import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "../services/auth.service";
import { writeAuditLog } from "../repositories/audit.repository";
import { sendSuccess } from "../utils/response";

export class AuthController {
  private service: AuthService;

  constructor(app: FastifyInstance) {
    this.service = new AuthService(app);
  }

  login = async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as { email: string; password: string };
    const result = await this.service.login(email, password);
    await writeAuditLog({ userId: result.user.id, action: "Login", tableName: "users", recordId: result.user.id, ipAddress: request.ip });
    return sendSuccess(reply, "Login successful", result);
  };

  logout = async (request: FastifyRequest, reply: FastifyReply) => {
    await writeAuditLog({ userId: request.authUser?.id, action: "Logout", tableName: "users", recordId: request.authUser?.id, ipAddress: request.ip });
    return sendSuccess(reply, "Logout successful");
  };

  refresh = async (request: FastifyRequest, reply: FastifyReply) => {
    const { refreshToken } = request.body as { refreshToken: string };
    return sendSuccess(reply, "Token refreshed", await this.service.refresh(refreshToken));
  };

  me = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Current user retrieved", request.authUser);
  profile = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Profile retrieved", request.authUser);

  changePassword = async (request: FastifyRequest, reply: FastifyReply) => {
    const { currentPassword, newPassword } = request.body as { currentPassword: string; newPassword: string };
    await this.service.changePassword(request.authUser!.id, currentPassword, newPassword);
    await writeAuditLog({ userId: request.authUser?.id, action: "Password Change", tableName: "users", recordId: request.authUser?.id, ipAddress: request.ip });
    return sendSuccess(reply, "Password changed successfully");
  };
}
