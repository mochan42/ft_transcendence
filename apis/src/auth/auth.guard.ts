
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

const isAuth = (request: any): boolean => {
  
  return true;
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return isAuth(request);
  }
}
