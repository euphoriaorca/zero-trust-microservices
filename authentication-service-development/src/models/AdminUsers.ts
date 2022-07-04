import 'reflect-metadata';
import { Column, PrimaryGeneratedColumn, Entity, UpdateDateColumn, CreateDateColumn, BaseEntity } from 'typeorm';
import { whereClauseFromObject } from '@distinctai/random-utils';

import { UserTypes } from '../interfaces';
import { IModelOptions } from '../interfaces/IModelOptions';
import { ErrorCode } from '../constants';

@Entity('users')
export class AdminUsers extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  userId!: string;

  @Column('varchar')
  password!: string;

  @Column({
    type: 'enum',
    enum: [UserTypes.USER0, UserTypes.USER],
    default: UserTypes.USER,
  })
  userType!: UserTypes;

  @Column('text', { nullable: true })
  permissions!: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt!: Date;

  /**
   * Finds an admin user
   *
   * @param param0
   */
  static async findUser({ select, where }: IModelOptions): Promise<AdminUsers | undefined> {
    try {
      return await AdminUsers.createQueryBuilder('u')
        .select(select!)
        .where(whereClauseFromObject(where!, 'u'))
        .getOne();
    } catch (err) {
      throw {
        code: ErrorCode.SERVER_ERROR,
        message: 'Typeorm error. Unable to find admin users',
        data: err.stack,
      };
    }
  }
}
