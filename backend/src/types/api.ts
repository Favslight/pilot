export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
};

export type AuthUser = {
  id: string;
  email: string;
  fullname: string;
  roleId: string;
  roleName: string;
};
