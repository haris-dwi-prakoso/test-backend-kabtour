import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction, TransactionStatus } from './entities/transaction.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TransactionService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>
  ) { }

  async create(createTransactionDto: CreateTransactionDto) {
    let { buyerId, ownerId, orders } = createTransactionDto;
    let total = 0;
    let error = false;
    for (let order of orders) {
      let itemRequest = await firstValueFrom(this.httpService.get(`https://fakestoreapi.com/products/${order.itemId}`));
      if (itemRequest.data) {
        let item = itemRequest.data;
        total += item.price * order.amount;
      } else {
        error = true;
        break;
      }
    }
    if (!error) {
      let newTransaction = new Transaction();
      newTransaction.buyerId = buyerId;
      newTransaction.ownerId = ownerId;
      newTransaction.orders = orders;
      newTransaction.total = total;
      return {
        success: true,
        data: await this.transactionRepo.save(newTransaction),
        message: "Transaction successfully created"
      }
    } else return {
      success: false,
      data: null,
      message: "Encountered an error while retrieving one of the order items"
    }
  }

  async findAll() {
    let transactions = await this.transactionRepo.find();
    let returnData: any[] = [];
    let error = false;
    for (let transaction of transactions) {
      let { id, buyerId, ownerId, orders, total, status, rejectReason } = transaction;
      let details: any[] = [];
      for (let order of orders) {
        let itemRequest = await firstValueFrom(this.httpService.get(`https://fakestoreapi.com/products/${order.itemId}`));
        if (itemRequest.data) {
          let item = itemRequest.data;
          details.push({
            item: item,
            amount: order.amount
          });
        } else {
          error = true;
          break;
        }
      }
      if (!error) {
        returnData.push({
          id: id,
          buyerId: buyerId,
          ownerId: ownerId,
          details: details,
          total: total,
          status: status,
          rejectReason: rejectReason
        });
      } else break;
    }
    if (!error) return {
      success: true,
      data: returnData,
      message: "Transactions successfully fetched"
    }
    else return {
      success: false,
      data: null,
      message: "Encountered an error while retrieving one of the order items"
    }
  }

  async findOne(id: number) {
    let transaction = await this.transactionRepo.findOneBy({ id: id });
    let error = false;
    if (transaction) {
      let { buyerId, ownerId, orders, total, status, rejectReason } = transaction;
      let details: any[] = [];
      for (let order of orders) {
        let itemRequest = await firstValueFrom(this.httpService.get(`https://fakestoreapi.com/products/${order.itemId}`));
        if (itemRequest.data) {
          let item = itemRequest.data;
          details.push({
            item: item,
            amount: order.amount
          });
        } else {
          error = true;
          break;
        }
      }
      if (!error) return {
        success: true,
        data: {
          id: id,
          buyerId: buyerId,
          ownerId: ownerId,
          details: details,
          total: total,
          status: status,
          rejectReason: rejectReason
        },
        message: "Transaction successfully fetched"
      }
      else return {
        success: false,
        data: null,
        message: "Encountered an error while retrieving one of the order items"
      }
    } else return {
      success: false,
      data: null,
      message: "Transaction not found"
    }
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    let { status, rejectReason } = updateTransactionDto;
    let transaction = await this.transactionRepo.findOneBy({ id: id });
    if (!transaction) return {
      success: false,
      data: null,
      message: "Transaction not found"
    }
    transaction.status = status;
    if (status == TransactionStatus.REJECTED && rejectReason) transaction.rejectReason = rejectReason;
    return {
      success: true,
      data: await this.transactionRepo.save(transaction),
      message: "Transaction successfully created"
    }
  }

  // async remove(id: number) {
  //   return await this.transactionRepo.softDelete({ id: id });
  // }
}
