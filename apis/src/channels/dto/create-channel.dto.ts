import { IsNumber, IsString } from "class-validator";


export class CreateChannelDto {
	@IsNumber()
	owner: number;

	@IsString()
	label: string;

	@IsString()
	type: 'PUBLIC' | 'PRIVATE' | ' PROTECTED';

	@IsString()
	password?: string;

	 @IsString()
	createdAt: string;
}
