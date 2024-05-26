import { Module } from '@nestjs/common';
import { AccessKeyService } from './access-key.service';
import { AccessKeyController } from './access-key.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessKey, AccessKeySchema } from '../../schemas/access-key.schema';
import { UserPlanController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import Redis from 'ioredis';
import { ConfigModule } from '@nestjs/config';
import { RedisSubscriberService } from './redis-subscriber.service';



@Module({
  imports: [
    // ClientsModule.register([
    //   {
    //     name: 'REDIS_SUBSCRIBER',
    //     transport: Transport.REDIS,
    //     options: {
    //       host: 'redis-14536.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
    //       port: 14536,
    //       password: 'CGiUqQlAncPmC80bTvrBsFSZnN09XMYf',
    //     },
    //   },
    // ]),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL),  // Update with your MongoDB connection string
    MongooseModule.forFeature([{ name: AccessKey.name, schema: AccessKeySchema }]),
  ],
  controllers: [AccessKeyController,UserPlanController],
  providers: [AccessKeyService,RedisSubscriberService,{
    provide: 'REDIS_CLIENT',
    useFactory: () => {
      return new Redis({
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT,10),
        password:process.env.REDIS_PASSWORD,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        reconnectOnError: (err) => {
          const targetError = 'READONLY';
          console.log("error in redis",err)
          if (err.message.includes(targetError)) {
            // Only reconnect when the error contains "READONLY"
            return true;
          }
          return false;
        },
      });
    },
  },],
})
export class AccessKeyModule {}
