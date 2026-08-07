import { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../utils/errors";
import { AuthUser } from "../types/api";
import { userHasPermission } from "../repositories/permission.repository";

declare module "fastify" {
  interface FastifyRequest {
    authUser?: AuthUser;
  }
}

export const authenticate = async (request: FastifyRequest, _reply: FastifyReply) => {
  try {
    request.authUser = await request.jwtVerify<AuthUser>();
  } catch {
    throw new AppError("Authentication required", 401);
  }
};

export const authorize =
  (...roles: string[]) =>
  async (request: FastifyRequest) => {
    if (!request.authUser) throw new AppError("Authentication required", 401);
    if (roles.length && !roles.includes(request.authUser.roleName)) throw new AppError("Insufficient permissions", 403);
  };

export const requirePermission =
  (permission: string) =>
  async (request: FastifyRequest) => {
    if (!request.authUser) throw new AppError("Authentication required", 401);
    if (request.authUser.roleName === "Administrator") return;
    if (!(await userHasPermission(request.authUser.id, permission))) throw new AppError("Insufficient permissions", 403);
  };
