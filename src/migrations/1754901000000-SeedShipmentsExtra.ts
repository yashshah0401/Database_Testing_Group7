import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedShipmentsExtra1754901000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert up to 3 shipments, mapped to the first 3 customers (if they exist).
    await queryRunner.query(`
      WITH customers_cte AS (
        SELECT customer_id, ROW_NUMBER() OVER (ORDER BY customer_id) AS rn
        FROM customers
        ORDER BY customer_id
        LIMIT 3
      ),
      seeds AS (
        SELECT * FROM (VALUES
          (500,  '100000.00', 'Toronto',  'Montreal'),
          (300,   '75000.00', 'Calgary',  'Edmonton'),
          (800,  '150000.00', 'Vancouver','Winnipeg')
        ) AS s(weight, value, origin, destination)
      ),
      seeds_rn AS (
        SELECT ROW_NUMBER() OVER () AS rn, weight, value, origin, destination
        FROM seeds
      )
      INSERT INTO shipments (customer_id, weight, value, origin, destination)
      SELECT c.customer_id, s.weight, s.value::numeric(10,2), s.origin, s.destination
      FROM customers_cte c
      JOIN seeds_rn s ON s.rn = c.rn
      WHERE NOT EXISTS (
        SELECT 1
        FROM shipments x
        WHERE x.customer_id = c.customer_id
          AND x.weight = s.weight
          AND x.value = s.value::numeric(10,2)
          AND x.origin = s.origin
          AND x.destination = s.destination
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM shipments
      WHERE (weight, value, origin, destination) IN (
        (500,  '100000.00', 'Toronto',  'Montreal'),
        (300,   '75000.00', 'Calgary',  'Edmonton'),
        (800,  '150000.00', 'Vancouver','Winnipeg')
      );
    `);
  }
}
