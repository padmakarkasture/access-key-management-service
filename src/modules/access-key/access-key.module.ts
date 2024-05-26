import { Module } from '@nestjs/common';
import { AccessKeyService } from './access-key.service';
import { AccessKeyController } from './access-key.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessKey, AccessKeySchema } from '../../schemas/access-key.schema';
import { UserPlanController } from './user.controller';



@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://admin:admin@cluster0.0m6yefn.mongodb.net/'),  // Update with your MongoDB connection string
    MongooseModule.forFeature([{ name: AccessKey.name, schema: AccessKeySchema }]),
  ],
  controllers: [AccessKeyController,UserPlanController],
  providers: [AccessKeyService],
})
export class AccessKeyModule {}
