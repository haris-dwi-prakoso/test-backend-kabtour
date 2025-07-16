import { IsInt, IsArray, ValidateNested, ArrayMinSize, IsObject, Min } from "class-validator";
import { Type } from "class-transformer";
import { OrderDto } from "./order.dto";

export class CreateTransactionDto {
    @IsInt()
    @Min(1, { message: "buyerId cannot be lower than 1" })
    buyerId: number;

    @IsInt()
    @Min(1, { message: "ownerId cannot be lower than 1" })
    ownerId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @IsObject({ each: true })
    @ArrayMinSize(1, { message: "orders must have at least one item" })
    @Type(() => OrderDto)
    orders: OrderDto[];
}
