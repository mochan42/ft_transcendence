import { Test, TestingModule } from '@nestjs/testing';
import { JoinchannelService } from './joinchannel.service';

describe('JoinchannelService', () => {
  let service: JoinchannelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JoinchannelService],
    }).compile();

    service = module.get<JoinchannelService>(JoinchannelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
