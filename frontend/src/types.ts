
type User = {
	'id': number;
	'userName': string;
	'userNameLoc': string;
	'firstName': string;
	'lastName': string;
	'is2Fa': boolean;
	'authToken': string;
	'email': string;
	'secret2Fa'?: string;
	'avatar'?: string;
	'xp': number;
	'isLogged': boolean;
	'lastSeen'?: string;
};

type UserStats = {
	'id': number;
	'userId': number;
	'wins': number,
	'losses': number,
	'draws': number,
};

type UserAchievements = {
	'id': number;
	'userId': number;
	'goalId': number;
	'createdAt': string;
};

interface ProfileProps {
	userId: number;
};

type Goal = {
	'id': number;
	'label'?: string;
	'image'?: string;
	'description'?: string;
};

export  { User, UserStats, UserAchievements, ProfileProps, Goal };
