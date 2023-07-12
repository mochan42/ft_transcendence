import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
	const user = {
		id: '1',
		userName: 'John Doe',
		userNameLoc: 'string',
		// firstName: string,
		// lastName: string,
		// is2Fa: boolean,
		// authToken: string,
		// email: string,
		// secret2Fa: string,
		// avatar: string,
		// xp: number,
		// lastSeen: string,
		// isLogged: boolean,
	}
    return {user};
  }
}
