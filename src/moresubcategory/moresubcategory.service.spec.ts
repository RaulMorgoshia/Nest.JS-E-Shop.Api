import { Test, TestingModule } from '@nestjs/testing';
import { MoresubcategoryService } from './moresubcategory.service';

describe('MoresubcategoryService', () => {
  let service: MoresubcategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoresubcategoryService],
    }).compile();

    service = module.get<MoresubcategoryService>(MoresubcategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
