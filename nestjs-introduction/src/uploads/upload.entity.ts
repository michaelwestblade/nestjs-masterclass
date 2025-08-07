import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileTypes } from './enums/file-types.enum';

@Entity()
export class UploadEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: false,
  })
  path: string;

  @Column({
    type: 'enum',
    enum: FileTypes,
    nullable: false,
  })
  type: FileTypes;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  mimetype: string;

  @Column({
    type: 'float',
    nullable: false,
  })
  size: number;

  @CreateDateColumn({})
  createdAt: Date;

  @UpdateDateColumn({})
  updatedAt: Date;
}
