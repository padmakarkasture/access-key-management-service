import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AccessKeyModule } from './modules/access-key/access-key.module';

@Module({
  imports: [ConfigModule.forRoot(),AccessKeyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
