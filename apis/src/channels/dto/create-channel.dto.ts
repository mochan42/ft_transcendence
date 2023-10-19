import { IsString } from "class-validator";


export class CreateChannelDto {
	@IsString()
	owner: string;

	@IsString()
	label: string;

	@IsString()
	type: string;

	@IsString()
	password?: string;

	 @IsString()
	createdAt: string;
}
