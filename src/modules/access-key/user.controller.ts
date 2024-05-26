import { Controller, Get, Post, HttpCode, HttpStatus, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AccessKeyService } from "./access-key.service";
import { AccessKey } from "./entities/access-key.entity";

@ApiTags('user/plan')
@Controller('user/plan')
export class UserPlanController {
  constructor(private readonly accessKeyService: AccessKeyService) {}

  @ApiOperation({ summary: 'Get access plan details' })
  @ApiQuery({ name: 'name', description: 'The access key value' })
  @ApiResponse({ status: 200, description: 'The access plan details', type: AccessKey })
  @Get()
  getPlanDetails(@Query('name') name: string): Promise<AccessKey> {
    return this.accessKeyService.getPlanDetails(name);
  }

  @ApiOperation({ summary: 'Disable an access key' })
  @ApiParam({ name: 'name', description: 'The access key value' })
  @ApiResponse({ status: 204, description: 'The access key has been successfully disabled.' })
  @Post(':name/disable')
  disableKey(@Param('name') name: string): Promise<AccessKey> {
    return this.accessKeyService.disableKey(name);
  }
}
