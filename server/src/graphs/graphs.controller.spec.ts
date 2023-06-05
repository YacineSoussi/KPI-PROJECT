import { Test, TestingModule } from '@nestjs/testing';
import { GraphsController } from './graphs.controller';

describe('GraphsController', () => {
  let controller: GraphsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GraphsController],
    }).compile();

    controller = module.get<GraphsController>(GraphsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
