import { IsInt, Min } from "class-validator";

export class OrderDto {
    @IsInt()
    @Min(1, { message: "itemId cannot be lower than 1" })
    itemId: number;

    @IsInt()
    @Min(1, { message: "amount cannot be lower than 1" })
    amount: number;
}