export class CreateUserDto {
  userName: string;
  userNameLoc: string;
  firstName: string;
  lastName: string;
  is2Fa: boolean;
  authToken: string;
  email: string;
  secret2Fa?: string;
  avatar: string;
  xp: number;
  isLogged: boolean;
  lastSeen: Date;
}
