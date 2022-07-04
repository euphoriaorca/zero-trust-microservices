/* eslint-disable quotes */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1581812783596 implements MigrationInterface {
  name = 'Initial1581812783596';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "CREATE TABLE IF NOT EXISTS `users` (`userId` varchar(36) NOT NULL, `password` varchar(255) NOT NULL, `userType` enum ('USER0', 'USER') NOT NULL DEFAULT 'USER', `permissions` text NULL, `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`userId`)) ENGINE=InnoDB",
      undefined,
    );
    await queryRunner.query(
      "CREATE TABLE IF NOT EXISTS `apps` (`appId` varchar(36) NOT NULL, `appType` enum ('BROWSER') NOT NULL, `domain` varchar(100) NULL COMMENT 'Domain from which request will be coming from', `ip` varchar(45) NULL COMMENT 'Ip address from which frontend request will be coming from. I.e. where frontend application is hosted.', `permissions` text NULL COMMENT 'Permissions available for application', `password` varchar(255) NULL, `description` text NOT NULL COMMENT 'Application description', `createdBy` varchar(255) NOT NULL COMMENT 'Id of admin user who created this application', `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`appId`)) ENGINE=InnoDB",
      undefined,
    );
    await queryRunner.query(
      "CREATE TABLE IF NOT EXISTS `services` (`serviceId` varchar(36) NOT NULL, `permissions` text NULL, `password` varchar(255) NOT NULL, `description` text NOT NULL, `createdBy` varchar(255) NOT NULL COMMENT 'Id of admin user who created this service', `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`serviceId`)) ENGINE=InnoDB",
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE IF EXISTS `services`', undefined);
    await queryRunner.query('DROP TABLE IF EXISTS `apps`', undefined);
    await queryRunner.query('DROP TABLE IF EXISTS `users`', undefined);
  }
}
