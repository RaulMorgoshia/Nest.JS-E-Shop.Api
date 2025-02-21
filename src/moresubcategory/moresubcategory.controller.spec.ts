import { Test, TestingModule } from '@nestjs/testing';
import { MoresubcategoryController } from './moresubcategory.controller';

describe('MoresubcategoryController', () => {
  let controller: MoresubcategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoresubcategoryController],
    }).compile();

    controller = module.get<MoresubcategoryController>(MoresubcategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
