import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionStatus } from './entities/transaction.entity';
import { getMockRes } from '@jest-mock/express'

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;
  let mockRes: any;

  beforeAll(async () => {
    const { res } = getMockRes();
    mockRes = res;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [{
        provide: TransactionService,
        useValue: {
          create: jest.fn(),
          findAll: jest.fn(),
          findOne: jest.fn(),
          update: jest.fn()
        }
      }],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  // it('should be defined', () => {
  //   expect(controller).toBeDefined();
  // });

  it('should call the create service', () => {
    const newTransaction = {
      buyerId: 2,
      ownerId: 1,
      orders: [{
        itemId: 1,
        amount: 1
      }]
    };
    controller.create(newTransaction, mockRes);
    expect(service.create).toHaveBeenCalledWith(newTransaction);
  });

  it('should call the findAll service', () => {
    controller.findAll(mockRes);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call the findOne service', () => {
    controller.findOne('1', mockRes);
    expect(service.findOne).toHaveBeenCalledWith(+'1');
  });

  it('should call the update service', () => {
    const updateData = {
      status: TransactionStatus.ACCEPTED
    };
    controller.update('1', updateData, mockRes);
    expect(service.update).toHaveBeenCalledWith(+'1', updateData);
  })
});
