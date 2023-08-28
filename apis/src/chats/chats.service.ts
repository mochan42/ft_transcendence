import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatsService {
	constructor(private readonly usersService: UsersService) { }
	
	async getUserFromSocket(socket: Socket) {
		const cookie = socket.handshake.headers.cookie;
		const [userId, isAuth] = cookie.split(' ');
		const user = await this.usersService.findOne(+userId);
		if (!user) {
			throw new WsException('Invalid user');
		}
		return user;
	}
}
