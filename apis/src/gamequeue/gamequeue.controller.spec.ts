import { Test, TestingModule } from '@nestjs/testing';
import { GamequeueController } from './gamequeue.controller';

describe('GamequeueController', () => {
  let controller: GamequeueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamequeueController],
    }).compile();

    controller = module.get<GamequeueController>(GamequeueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
