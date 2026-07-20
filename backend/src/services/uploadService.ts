import { getRelativeUploadPath } from '../utils/fileStorage';

export const processUploadedFile = (file: Express.Multer.File): string => {
  return getRelativeUploadPath(file.filename);
};
