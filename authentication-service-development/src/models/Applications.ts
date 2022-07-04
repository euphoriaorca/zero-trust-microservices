import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, BaseEntity } from 'typeorm';
import { whereClauseFromObject } from '@distinctai/random-utils';

import { AppTypes, IModelOptions } from '../interfaces';
import { ErrorCode } from '../constants';

@Entity('apps')
export class Applications extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  appId!: string;

  @Column({
    type: 'enum',
    enum: [AppTypes.BROWSER],
  })
  appType!: AppTypes;

  @Column({
    type: 'varchar',
    length: 100,
    comment: 'Domain from which request will be coming from',
    nullable: true,
  })
  domain?: string;

  @Column({
    type: 'varchar',
    length: 45,
    comment: 'Ip address from which frontend request will be coming from. I.e. where frontend application is hosted.',
    nullable: true,
  })
  ip?: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Permissions available for application',
  })
  permissions!: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  password!: string;

  @Column({
    type: 'text',
    comment: 'Application description',
  })
  description!: string;

  @Column({
    type: 'uuid',
    comment: 'Id of admin user who created this application',
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
   * Creates a new application
   *
   * @param application
   */
  static async createApplication(application: Object): Promise<Applications> {
    try {
      return await Applications.create(application).save();
    } catch (err) {
      throw {
        code: ErrorCode.SERVER_ERROR,
        message: 'Typeorm error. Unable to create application.',
      };
    }
  }

  /**
   * Finds an application
   *
   * @param param0
   */
  static async findApplication({ select, where }: IModelOptions): Promise<Applications | undefined> {
    try {
      return await Applications.createQueryBuilder('a')
        .select(select!)
        .where(whereClauseFromObject(where!, 'a'))
        .getOne();
    } catch (err) {
      throw {
        code: ErrorCode.SERVER_ERROR,
        message: 'Typeorm error. Unable to find application.',
        data: err.stack,
      };
    }
  }

  /**
   * Updates an application
   *
   * @param update
   * @param options
   */
  static async updateApplication(update: Object, options: IModelOptions): Promise<boolean> {
    const { where } = options;

    if (!where) {
      throw {
        code: ErrorCode.SERVER_ERROR,
        message: 'Blocked bad attempt to update all applications.',
      };
    }

    const updated = await Applications.createQueryBuilder()
      .update()
      .set(update)
      .where(whereClauseFromObject(where!))
      .execute();

    if (!updated) {
      throw {
        err: ErrorCode.SERVER_ERROR,
        message: 'Typeorm error. Unable to update application.',
      };
    }

    return true;
  }
}
