import { Injectable, OnModuleInit, Logger, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { AccessKeyService } from './access-key.service';

@Injectable()
export class RedisSubscriberService implements OnModuleInit {

  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly accessKeyService: AccessKeyService
  ) {}

  async onModuleInit() {

    this.redisClient.subscribe('rate-limit', (err, count) => {
        console.log("in subscribe")
      if (err) {
        console.log(`Failed to subscribe: ${err.message}`);
      } else {
        console.log(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
      }
    });

    this.redisClient.on('message',async (channel, message) => {
        const data= JSON.parse(message)
        const keyDetails= await this.accessKeyService.getPlanDetails(data.accessKey)
        keyDetails.rateLimit = keyDetails.rateLimit-1;
       this.accessKeyService.updateAccessKey(data.accessKey,keyDetails)
        
      });
  }
}
