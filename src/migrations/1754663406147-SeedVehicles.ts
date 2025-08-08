import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedVehicles1754663406147 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "vehicle" ("type", "model", "licensePlate", "capacity")
      VALUES
        ('Cargo Plane', 'Boeing 747', 'CP001', 50000),
        ('In-city Truck', 'Ford F-150', 'IC002', 1200),
        ('Long Haul Truck', 'Freightliner Cascadia', 'LH003', 18000);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "vehicle" 
      WHERE "licensePlate" IN ('CP001', 'IC002', 'LH003');
    `);
  }
}
