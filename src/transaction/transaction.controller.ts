import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto, @Res() res) {
    try {
      let data = await this.transactionService.create(createTransactionDto);
      if (data.success) return res.status(HttpStatus.CREATED).json(data);
      else return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(data);
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  }

  @Get()
  async findAll(@Res() res) {
    try {
      let data = await this.transactionService.findAll();
      if (data.success) return res.status(HttpStatus.OK).json(data);
      else return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(data);
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      let data = await this.transactionService.findOne(+id);
      if (data.success) return res.status(HttpStatus.OK).json(data);
      else if (data.message === "Transaction not found") return res.status(HttpStatus.NOT_FOUND).json(data);
      else return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(data);
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto, @Res() res) {
    try {
      let data = await this.transactionService.update(+id, updateTransactionDto);
      if (data.success) return res.status(HttpStatus.OK).json(data);
      else return res.status(HttpStatus.NOT_FOUND).json(data);
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.transactionService.remove(+id);
  // }
}
