
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

export { HOME_SECTION, logStatus, enChatType};
