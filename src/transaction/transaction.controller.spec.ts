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
          create: jest.fn().mockReturnValue({
            success: true,
            data: {
              id: 1,
              buyerId: 2,
              ownerId: 1,
              orders: [{
                itemId: 1,
                amount: 1
              }],
              total: 109.95,
              status: 'pending',
              rejectReason: null
            },
            message: "Transaction successfully created"
          }),
          findAll: jest.fn().mockReturnValue({
            success: true,
            data: [{
              id: 1,
              buyerId: 2,
              ownerId: 1,
              details: [{
                item: {
                  "id": 1,
                  "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
                  "price": 109.95,
                  "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
                  "category": "men's clothing",
                  "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
                  "rating": {
                    "rate": 3.9,
                    "count": 120
                  }
                },
                amount: 1
              }],
              total: 109.95,
              status: 'pending',
              rejectReason: null
            }],
            message: "Transactions successfully fetched"
          }),
          findOne: jest.fn().mockReturnValue({
            success: true,
            data: {
              id: 1,
              buyerId: 2,
              ownerId: 1,
              details: [{
                item: {
                  "id": 1,
                  "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
                  "price": 109.95,
                  "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
                  "category": "men's clothing",
                  "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
                  "rating": {
                    "rate": 3.9,
                    "count": 120
                  }
                },
                amount: 1
              }],
              total: 109.95,
              status: 'pending',
              rejectReason: null
            },
            message: "Transaction successfully fetched"
          }),
          update: jest.fn().mockReturnValue({
            success: true,
            data: {
              id: 1,
              buyerId: 2,
              ownerId: 1,
              orders: [{
                itemId: 1,
                amount: 1
              }],
              total: 109.95,
              status: 'accepted',
              rejectReason: null
            },
            message: "Transaction successfully created"
          })
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
