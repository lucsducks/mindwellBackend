import { IsArray, IsUUID } from "class-validator";


export class TestDto {
    @IsArray()
    tests: string[];
}
