import { MulterModuleOptions } from '@nestjs/platform-express/multer';

export const multerConfig: MulterModuleOptions = {
  dest: './avatars',
};
