import { MulterModuleOptions } from '@nestjs/platform-express/multer';

export const multerConfig: MulterModuleOptions = {
  dest: './avatars',
  limits: {
      fileSize: 1024 * 1024,
    },
};
