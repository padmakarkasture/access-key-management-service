import { Test, TestingModule } from '@nestjs/testing';
import { AccessKeyController } from './access-key.controller';
import { AccessKeyService } from './access-key.service';

describe('AccessKeyController', () => {
  let controller: AccessKeyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessKeyController],
      providers: [AccessKeyService],
    }).compile();

    controller = module.get<AccessKeyController>(AccessKeyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
