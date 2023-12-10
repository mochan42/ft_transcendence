
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      console.log(request);
      return true;
  }
}
