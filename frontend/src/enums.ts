
const enum HOME_SECTION
{
  PROFILE,
  CHAT_USER,
  CHAT_GROUP,
	GAME_REQUEST,
  GROUP_REQUEST
}

enum logStatus {
  DEFAULT,
  IS2FA,
  ISNOT2FA
}

enum enChatType {
  OneOnOne = "individual",
  Group ="group"
}

enum enChatPrivacy {
  PUBLIC = "public",
  PRIVATE = "private",
  PROTECTED = "protected"
}

enum enChatMemberRank {
  OWNER = "owner",
  ADMIN = "admin",
  MEMBER = "member",
  GUESS = "guess",
}

enum enChatMemberRights {
  PRIVILEDGED = "priviledged",
  BANNED = "banned", // same with muted
}

enum enGameDifficulty {
  EASY,
  MEDIUM,
  HARD,
  VERY_HARD,
  EXTREME,
}

enum enChatGroupInviteStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  INVITE = "invited",
}

enum LOG_STATE {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  INGAME = 'IN GAME',
}

export { HOME_SECTION, logStatus, enChatType, enChatMemberRank,
  enChatMemberRights, enChatPrivacy, 
  enGameDifficulty,
  enChatGroupInviteStatus,
  LOG_STATE
}
