import { IsInt, IsDateString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAccessKeyDto {
  @ApiPropertyOptional({ description: 'The new rate limit for the access key' })
  @IsOptional()
  @IsInt()
  rateLimit?: number;

  @ApiPropertyOptional({ description: 'The new expiration time for the access key' })
  @IsOptional()
  @IsDateString()
  expirationTime?: Date;
}
