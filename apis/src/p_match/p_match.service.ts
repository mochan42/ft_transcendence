import { Injectable } from '@nestjs/common';
import { CreatePMatchDto } from './dto/create-p_match.dto';
import { UpdatePMatchDto } from './dto/update-p_match.dto';

@Injectable()
export class PMatchService {
  create(createPMatchDto: CreatePMatchDto) {
    return 'This action adds a new pMatch';
  }

  findAll() {
    return `This action returns all pMatch`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pMatch`;
  }

  update(id: number, updatePMatchDto: UpdatePMatchDto) {
    return `This action updates a #${id} pMatch`;
  }

  remove(id: number) {
    return `This action removes a #${id} pMatch`;
  }
}
