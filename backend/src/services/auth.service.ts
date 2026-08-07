import bcrypt from "bcrypt";
import { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UserRepository } from "../repositories/user.repository";
import { AppError } from "../utils/errors";

export class AuthService {
  constructor(private app: FastifyInstance, private users = new UserRepository()) {}

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user || !user.password || user.status !== "active") throw new AppError("Invalid login credentials", 401);
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new AppError("Invalid login credentials", 401);
    await this.users.touchLogin(user.id);
    const payload = { id: user.id, email: user.email, fullname: user.fullname, roleId: user.role, roleName: user.role_name! };
    return {
      user: payload,
      accessToken: this.app.jwt.sign(payload, { expiresIn: "15m" }),
      refreshToken: jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: "7d" }),
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, env.jwtRefreshSecret) as Record<string, unknown>;
      return { accessToken: this.app.jwt.sign(payload, { expiresIn: "15m" }) };
    } catch {
      throw new AppError("Invalid refresh token", 401);
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.users.findPublicById(userId);
    if (!user) throw new AppError("User not found", 404);
    const privateUser = await this.users.findByEmail(user.email);
    if (!privateUser?.password || !(await bcrypt.compare(currentPassword, privateUser.password))) {
      throw new AppError("Current password is incorrect", 400);
    }
    await this.users.update(userId, { password: await bcrypt.hash(newPassword, 12) });
  }
}
