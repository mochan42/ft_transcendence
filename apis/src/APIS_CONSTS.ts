export const ACCEPTED = 'ACCEPTED';
export const PENDING = 'PENDING';
export const BALL_X_ZERO = 0;
export const BALL_Y_ZERO = 0;
export const LEFT_PADDLE_Y_ZERO = 0;
export const RIGHT_PADDLE_Y_ZERO = 0;
export const BOOST_X_ZERO = 0;
export const BOOST_Y_ZERO = 0;

export enum GAME_STATE {
  NOT_STARTED = 'NOT_STARTED',
  ON_GOING = 'ON_GOING',
  ON_PAUSE = 'ON_PAUSE',
}

export enum MEMBER_STATUS {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  INVITE = 'invited',
}

export enum CHANNEL_TYPE {
  PUBLIC = 'public',
  PRIVATE = 'private',
  PROTECTED = 'protected',
}

export enum MEMBER_RANK {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
}

export enum MEMBER_RIGHTS {
  PRIVILEDGED = 'priviledged',
  BANNED = 'banned', // same with muted
}

export enum LOG_STATE {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  INGAME = 'IN GAME',
}
