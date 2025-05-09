import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('meta_option')
export class MetaOptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'json',
    nullable: false,
  })
  metaValue: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @DeleteDateColumn()
  deletedAt: string;
}
