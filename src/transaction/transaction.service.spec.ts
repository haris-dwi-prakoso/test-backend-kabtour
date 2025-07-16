import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { HttpModule, HttpService } from '@nestjs/axios';
import { TestingDb } from '../db/db-test';
import { IBackup } from 'pg-mem';
import { DataSource } from 'typeorm';

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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a transaction', async () => {
    let newTransaction = await service.create({
      buyerId: 2,
      ownerId: 1,
      orders: [{
        itemId: 1,
        amount: 1
      }]
    });
    testId = newTransaction.data?.id ?? 0;
    expect(newTransaction.success).toBe(true);
    expect(newTransaction.data).toBeInstanceOf(Transaction);
    expect(newTransaction.message).toBe("Transaction successfully created");
  });

  it('should fetch all transactions', async () => {
    let response = await service.findAll();
    expect(response.success).toBe(true);
    expect(response.data).toEqual(expect.any(Array));
  })
});
