import { Controller, Get, Post, HttpCode, HttpStatus, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AccessKeyService } from "./access-key.service";
import { AccessKey } from "./entities/access-key.entity";

@ApiTags('user/plan')
@Controller('user/plan')
export class UserPlanController {
  constructor(private readonly accessKeyService: AccessKeyService) {}

  @ApiOperation({ summary: 'Get access plan details' })
  @ApiQuery({ name: 'key', description: 'The access key value' })
  @ApiResponse({ status: 200, description: 'The access plan details', type: AccessKey })
  @Get()
  getPlanDetails(@Query('key') keyValue: string): Promise<AccessKey> {
    return this.accessKeyService.getPlanDetails(keyValue);
  }

  @ApiOperation({ summary: 'Disable an access key' })
  @ApiParam({ name: 'keyValue', description: 'The access key value' })
  @ApiResponse({ status: 204, description: 'The access key has been successfully disabled.' })
  @Post(':keyValue/disable')
  @HttpCode(HttpStatus.NO_CONTENT)
  disableKey(@Param('keyValue') keyValue: string): Promise<void> {
    return this.accessKeyService.disableKey(keyValue);
  }
}
