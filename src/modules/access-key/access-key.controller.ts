import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { AccessKeyService } from './access-key.service';
import { CreateAccessKeyDto, UpdateAccessKeyDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AccessKey } from '../../schemas/access-key.schema';

@ApiTags('admin/keys')
@Controller('admin/keys')
export class AccessKeyController {
  constructor(private readonly accessKeyService: AccessKeyService) {}

  @ApiOperation({ summary: 'Create a new access key' })
  @ApiResponse({ status: 201, description: 'The access key has been successfully created.' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAccessKeyDto: CreateAccessKeyDto): Promise<AccessKey> {
    return this.accessKeyService.createAccessKey(createAccessKeyDto);
  }

  @ApiOperation({ summary: 'List all access keys' })
  @ApiResponse({ status: 200, description: 'List of access keys', type: [AccessKey] })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'limit', required: true, type: Number })
  @Get()
  findAll(@Query('page', ParseIntPipe) page: number, @Query('limit', ParseIntPipe) limit: number): Promise<AccessKey[]> {
    return this.accessKeyService.findAll(page, limit);
  }

  @ApiOperation({ summary: 'Delete an access key' })
  @ApiParam({ name: 'name', description: 'The name of the access key' })
  @ApiResponse({ status: 204, description: 'The access key has been successfully deleted.' })
  @Delete(':name')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('name') name: string): Promise<any> {
    return this.accessKeyService.removeAccessKey(name);
  }

  @ApiOperation({ summary: 'Update an access key' })
  @ApiParam({ name: 'name', description: 'The name of the access key' })
  @ApiResponse({ status: 200, description: 'The access key has been successfully updated.', type: AccessKey })
  @Put(':name')
  update(@Param('name') name: string, @Body() updateAccessKeyDto: UpdateAccessKeyDto): Promise<AccessKey> {
    return this.accessKeyService.updateAccessKey(name, updateAccessKeyDto);
  }
}
