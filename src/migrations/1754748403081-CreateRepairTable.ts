import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRepairTable1754719999999 implements MigrationInterface {
  name = 'CreateRepairTable1754719999999'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create table
    await queryRunner.query(`
      CREATE TABLE "repair" (
        "id" SERIAL PRIMARY KEY,
        "estimatedRepairTime" INTEGER NOT NULL,
        "actualRepairTime" INTEGER,
        "vehicleId" INTEGER NOT NULL,
        "mechanicId" INTEGER NOT NULL
      )
    `);

    // Foreign keys
    await queryRunner.query(`
      ALTER TABLE "repair"
      ADD CONSTRAINT "FK_repair_vehicle"
      FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "repair"
      ADD CONSTRAINT "FK_repair_mechanic"
      FOREIGN KEY ("mechanicId") REFERENCES "employees"("employee_id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Optional indexes (helps joins/filters)
    await queryRunner.query(`CREATE INDEX "IDX_repair_vehicleId" ON "repair" ("vehicleId")`);
    await queryRunner.query(`CREATE INDEX "IDX_repair_mechanicId" ON "repair" ("mechanicId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_repair_mechanicId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_repair_vehicleId"`);
    await queryRunner.query(`ALTER TABLE "repair" DROP CONSTRAINT IF EXISTS "FK_repair_mechanic"`);
    await queryRunner.query(`ALTER TABLE "repair" DROP CONSTRAINT IF EXISTS "FK_repair_vehicle"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "repair"`);
  }
}