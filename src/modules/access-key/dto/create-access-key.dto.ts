import { IsString, IsInt, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccessKeyDto {
  @ApiProperty({ description: 'The unique value of the access key' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The rate limit for the access key' })
  @IsInt()
  rateLimit: number;

  @ApiProperty({ description: 'The expiration time of the access key' })
  @IsDateString()
  expirationTime: Date;
}
