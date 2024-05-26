import { Injectable, ConflictException, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createClient } from 'redis';
import { AccessKey, AccessKeyDocument } from '../../schemas/access-key.schema';
import { CreateAccessKeyDto, UpdateAccessKeyDto } from './dto';
import { STATUS } from 'src/common/messages';

@Injectable()
export class AccessKeyService {
  private redisClient = createClient({
    password: '*******',
    socket: {
        host: 'redis-14536.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 14536
    }
  });

  constructor(
    @InjectModel(AccessKey.name) private accessKeyModel: Model<AccessKeyDocument>,
  ) {}

  async createAccessKey(createAccessKeyDto: CreateAccessKeyDto): Promise<AccessKey> {
    const { keyValue } = createAccessKeyDto;
    try {
      const existingKey = await this.accessKeyModel.findOne({ keyValue }).exec();
      if (existingKey) {
        throw new ConflictException('Access key already exists');
      }
      const createdAccessKey = new this.accessKeyModel(createAccessKeyDto);
      await createdAccessKey.save();

      // Uncomment to enable Redis events
      // this.redisClient.publish('key-events', JSON.stringify({
      //   event: 'key_created',
      //   data: createdAccessKey,
      // }));

      return createdAccessKey;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to create access key');
      }
    }
  }

  async findAll(page: number, limit: number): Promise<AccessKey[]> {
    try {
      return this.accessKeyModel.find().skip((page - 1) * limit).limit(limit).exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve access keys');
    }
  }

  async updateAccessKey(id: string, updateAccessKeyDto: UpdateAccessKeyDto): Promise<AccessKey> {
    try {
      const updatedAccessKey = await this.accessKeyModel.findByIdAndUpdate(id, updateAccessKeyDto, { new: true }).exec();
      if (!updatedAccessKey) {
        throw new NotFoundException('Access key not found');
      }

      // Uncomment to enable Redis events
      // this.redisClient.publish('key-events', JSON.stringify({
      //   event: 'key_updated',
      //   data: updatedAccessKey,
      // }));

      return updatedAccessKey;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to update access key');
      }
    }
  }

  async removeAccessKey(id: string): Promise<void> {
    try {
      const result = await this.accessKeyModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException('Access key not found');
      }

      // Uncomment to enable Redis events
      // this.redisClient.publish('key-events', JSON.stringify({
      //   event: 'key_deleted',
      //   data: { id },
      // }));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to delete access key');
      }
    }
  }

  async getPlanDetails(keyValue: string): Promise<AccessKey> {
    try {
      const accessKey = await this.accessKeyModel.findById(keyValue).exec();
      if (!accessKey) {
        throw new NotFoundException('Access key not found');
      }
      return accessKey;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to retrieve plan details');
      }
    }
  }

  async disableKey(keyValue: string): Promise<void> {
    try {
      const result = await this.accessKeyModel.findByIdAndUpdate(keyValue, { status: STATUS.DISABLED }).exec();
      if (!result) {
        throw new NotFoundException('Access key not found');
      }

      // Uncomment to enable Redis events
      // this.redisClient.publish('key-events', JSON.stringify({
      //   event: 'key_disabled',
      //   data: { keyValue },
      // }));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to disable access key');
      }
    }
  }
}
