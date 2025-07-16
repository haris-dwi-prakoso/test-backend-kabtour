import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { HttpModule, HttpService } from '@nestjs/axios';
import { TestingDb } from '../db/db-test';
import { IBackup } from 'pg-mem';
import { DataSource } from 'typeorm';
import { TransactionStatus } from './entities/transaction.entity';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpService: HttpService;
  let datasource: DataSource;
  let backup: IBackup;
  let testId: number;

  beforeAll(async () => {
    const testingDb = new TestingDb()
    const { db, databaseProviders, datasource: ds } = await testingDb.initialize()
    datasource = ds
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        TransactionService,
        ...databaseProviders
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    httpService = module.get<HttpService>(HttpService);
    backup = db.backup();
  });

  afterEach(() => {
    backup.restore();
  });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });

  it('should create a transaction', async () => {
    let response = await service.create({
      buyerId: 2,
      ownerId: 1,
      orders: [{
        itemId: 1,
        amount: 1
      }]
    });
    testId = response.data?.id ?? 0;
    expect(response.success).toBe(true);
    expect(response.data).toBeInstanceOf(Transaction);
    expect(response.message).toBe("Transaction successfully created");
  });

  it('should fetch all transactions', async () => {
    let response = await service.findAll();
    expect(response.success).toBe(true);
    expect(response.data).toEqual(expect.any(Array));
    expect(response.message).toBe("Transactions successfully fetched");
  });

  it('should fetch the specified transaction', async () => {
    let response = await service.findOne(testId);
    expect(response.success).toBe(true);
    expect(response.data?.buyerId).toEqual(2);
    expect(response.data?.ownerId).toEqual(1);
    expect(response.message).toBe("Transaction successfully fetched");
  });

  it('should update the transaction status to accepted', async () => {
    let response = await service.update(testId, { status: TransactionStatus.ACCEPTED });
    expect(response.success).toBe(true);
    expect(response.data?.status).toEqual(TransactionStatus.ACCEPTED);
    expect(response.message).toBe("Transaction successfully updated");
  })
});
