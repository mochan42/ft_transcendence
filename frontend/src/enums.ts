
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
}

enum enChatMemberRights {
  PRIVILEDGED = "priviledged",
  BANNED = "banned", // same with muted
}
export { HOME_SECTION, logStatus, enChatType, enChatMemberRank,
enChatMemberRights, enChatPrivacy };
