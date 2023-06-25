import { Test, TestingModule } from '@nestjs/testing';
import { PMatchService } from './p_match.service';

describe('PMatchService', () => {
  let service: PMatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PMatchService],
    }).compile();

    service = module.get<PMatchService>(PMatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
