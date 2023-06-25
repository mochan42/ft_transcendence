import { Test, TestingModule } from '@nestjs/testing';
import { PMatchController } from './p_match.controller';
import { PMatchService } from './p_match.service';

describe('PMatchController', () => {
  let controller: PMatchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PMatchController],
      providers: [PMatchService],
    }).compile();

    controller = module.get<PMatchController>(PMatchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
