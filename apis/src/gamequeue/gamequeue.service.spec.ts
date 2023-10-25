import { Test, TestingModule } from '@nestjs/testing';
import { GamequeueService } from './gamequeue.service';

describe('GamequeueService', () => {
  let service: GamequeueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamequeueService],
    }).compile();

    service = module.get<GamequeueService>(GamequeueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
