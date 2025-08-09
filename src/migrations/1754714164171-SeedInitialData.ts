import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedEmployees1754663500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "employees" ("first_name", "last_name", "seniority", "is_mechanic")
      VALUES
        ('Rahul', 'Sharma', 4, false),
        ('Priya', 'Mehta', 2, true),
        ('Anjali', 'Patel', 6, false);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "employee" 
      WHERE ("first_name", "last_name") IN 
        (('Rahul', 'Sharma'), ('Priya', 'Mehta'), ('Anjali', 'Patel'));
    `);
  }
}