import { MultipartFile } from "@fastify/multipart";
import { cloudinary } from "../config/cloudinary";
import { AppError } from "./errors";

const allowed = ["image/png", "image/jpg", "image/jpeg"];
const documentAllowed = [...allowed, "application/pdf"];

export const uploadImage = async (file: MultipartFile) => {
  if (!allowed.includes(file.mimetype)) throw new AppError("Only PNG, JPG and JPEG files are allowed", 422);
  const buffer = await file.toBuffer();
  if (buffer.length > 5 * 1024 * 1024) throw new AppError("File must not exceed 5MB", 422);
  const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: "image", folder: "pilot-records" }, (error, uploadResult) => {
      if (error || !uploadResult) return reject(error);
      resolve(uploadResult);
    }).end(buffer);
  });
  return { url: result.secure_url, public_id: result.public_id };
};

export const uploadStudentDocument = async (file: MultipartFile) => {
  if (!documentAllowed.includes(file.mimetype)) throw new AppError("Only PDF, PNG, JPG and JPEG files are allowed", 422);
  const buffer = await file.toBuffer();
  if (buffer.length > 5 * 1024 * 1024) throw new AppError("File must not exceed 5MB", 422);
  const result = await new Promise<{ secure_url: string; public_id: string; bytes: number; format: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: "auto", folder: "pilot-records/student-documents" }, (error, uploadResult) => {
      if (error || !uploadResult) return reject(error);
      resolve(uploadResult);
    }).end(buffer);
  });
  return { url: result.secure_url, public_id: result.public_id, file_name: file.filename, file_size: result.bytes || buffer.length, mime_type: file.mimetype };
};
