import { Module } from '@nestjs/common';
import { MetaOptionsController } from './meta-options.controller';
import { MetaOptionsService } from './providers/meta-options.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetaOptionEntity } from './entities/meta-option.entity';

@Module({
  controllers: [MetaOptionsController],
  providers: [MetaOptionsService],
  imports: [TypeOrmModule.forFeature([MetaOptionEntity])],
})
export class MetaOptionsModule {}
