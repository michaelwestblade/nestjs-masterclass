import { Module } from '@nestjs/common';
import { MetaOptionsController } from './meta-options.controller';
import { MetaOptionsService } from './providers/meta-options.service';

@Module({
  controllers: [MetaOptionsController],
  providers: [MetaOptionsService],
})
export class MetaOptionsModule {}
