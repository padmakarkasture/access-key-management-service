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
    const { name } = createAccessKeyDto;
    try {
      const existingKey = await this.accessKeyModel.findOne({ name }).exec();
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
      console.log("error",error)
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

  async updateAccessKey(name: string, updateAccessKeyDto: UpdateAccessKeyDto): Promise<AccessKey> {
    try {
      const updatedAccessKey = await this.accessKeyModel.findOneAndUpdate({name}, updateAccessKeyDto, { new: true }).exec();
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

  async removeAccessKey(name: string): Promise<any> {
    try {
      const result = await this.accessKeyModel.findOneAndDelete({name}).exec();
      if (!result) {
        throw new NotFoundException('Access key not found');
      }

      // Uncomment to enable Redis events
      // this.redisClient.publish('key-events', JSON.stringify({
      //   event: 'key_deleted',
      //   data: { id },
      // }));
      return {message:"deleted Succesfully"}
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to delete access key');
      }
    }
  }

  async getPlanDetails(name: string): Promise<AccessKey> {
    try {
      const accessKey = await this.accessKeyModel.findOne({name}).exec();
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

  async disableKey(name: string): Promise<AccessKey> {
    try {
      const result = await this.accessKeyModel.findOneAndUpdate({name}, { status: STATUS.DISABLED }).exec();
      if (!result) {
        throw new NotFoundException('Access key not found');
      }

      // Uncomment to enable Redis events
      // this.redisClient.publish('key-events', JSON.stringify({
      //   event: 'key_disabled',
      //   data: { name },
      // }));
      return result
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to disable access key');
      }
    }
  }
}
