import { PartialType } from '@nestjs/mapped-types';
import { CreatePMatchDto } from './create-p_match.dto';

export class UpdatePMatchDto extends PartialType(CreatePMatchDto) {}
