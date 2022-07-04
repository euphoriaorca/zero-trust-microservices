import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, BaseEntity } from 'typeorm';
import { whereClauseFromObject } from '@distinctai/random-utils';

import { IModelOptions } from '../interfaces';
import { ErrorCode } from '../constants';

@Entity('services')
export class Services extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  serviceId!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  permissions!: string;

  @Column('varchar')
  password!: string;

  @Column('text')
  description!: string;

  @Column({
    type: 'uuid',
    comment: 'Id of admin user who created this service',
  })
  createdBy!: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt!: Date;

  /**
   * Finds a service
   *
   * @param param0
   */
  static async findService({ select, where }: IModelOptions): Promise<Services | undefined> {
    try {
      return await Services.createQueryBuilder('s')
        .select(select!)
        .where(whereClauseFromObject(where!, 's'))
        .getOne();
    } catch (err) {
      throw {
        code: ErrorCode.SERVER_ERROR,
        message: 'Typeorm error. Unable to find service.',
        data: err.stack,
      };
    }
  }

  /**
   * Creates a service
   *
   * @param service
   */
  static async createService(service: Object): Promise<Services> {
    try {
      return await Services.create(service).save();
    } catch (err) {
      throw {
        code: ErrorCode.SERVER_ERROR,
        message: 'Typeorm error. Unable to create service.',
      };
    }
  }

  /**
   * Updates a service
   *
   * @param update
   * @param options
   */
  static async updateService(update: Object, options: IModelOptions): Promise<boolean> {
    const { where } = options;

    if (!where) {
      throw {
        code: ErrorCode.SERVER_ERROR,
        message: 'Blocked bad attempt to update all services.',
      };
    }

    const updated = await Services.createQueryBuilder()
      .update()
      .set(update)
      .where(whereClauseFromObject(where!))
      .execute();

    if (!updated) {
      throw {
        err: ErrorCode.SERVER_ERROR,
        message: 'Typeorm error. Unable to update service.',
      };
    }

    return true;
  }
}
