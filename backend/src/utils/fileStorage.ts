import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const extensionByMimeType: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

export const getUploadDirectoryPath = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');

  const uploadPath = path.join(
    process.cwd(),
    'uploads',
    'reports',
    year,
    month
  );

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return uploadPath;
};

export const generateUniqueFileName = (mimeType: string): string => {
  const ext = extensionByMimeType[mimeType];
  if (!ext) {
    throw new Error('Unsupported image MIME type');
  }

  const timestamp = Date.now();
  const uuid = crypto.randomUUID();
  return `${timestamp}-${uuid}${ext}`;
};

export const getRelativeUploadPath = (fileName: string): string => {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  return `/uploads/reports/${year}/${month}/${fileName}`;
};
