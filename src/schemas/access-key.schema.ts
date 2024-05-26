import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccessKeyDocument = AccessKey & Document;

@Schema()
export class AccessKey {
  @Prop({ unique: true, required: true })
  keyValue: string;

  @Prop({ required: true })
  rateLimit: number;

  @Prop({ required: true })
  expirationTime: Date;

  @Prop({ default: Date.now })
  creationDate: Date;

  @Prop({ default: 'active' })
  status: string;
}

export const AccessKeySchema = SchemaFactory.createForClass(AccessKey);
