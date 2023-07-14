import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@/common/entity/abstract.entity';
import { UserEntity } from '@/modules/system/user/entities/user.entity';

@Entity('todo')
export class TodoEntity extends AbstractEntity {
  @Column()
  @ApiProperty({ description: 'todo' })
  value: string;

  @ApiProperty({ description: 'todo' })
  @Column({ default: false })
  status: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}