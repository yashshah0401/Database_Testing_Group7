import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedTripsAndLinks1754902000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert 3 trips if identical rows don't already exist
    await queryRunner.query(`
      WITH seeds(origin, destination) AS (
        VALUES ('Toronto','Montreal'),
               ('Calgary','Edmonton'),
               ('Vancouver','Winnipeg')
      )
      INSERT INTO trips (origin, destination)
      SELECT s.origin, s.destination
      FROM seeds s
      WHERE NOT EXISTS (
        SELECT 1 FROM trips t
        WHERE t.origin = s.origin AND t.destination = s.destination
      );
    `);

    // Link the first trip to up to 2 shipments if available
    await queryRunner.query(`
      WITH t AS (
        SELECT trip_id FROM trips ORDER BY trip_id ASC LIMIT 1
      ),
      s AS (
        SELECT shipment_id FROM shipments ORDER BY shipment_id ASC LIMIT 2
      )
      INSERT INTO tripshipments (trip_id, shipment_id)
      SELECT t.trip_id, s.shipment_id
      FROM t CROSS JOIN s
      WHERE NOT EXISTS (
        SELECT 1 FROM tripshipments ts
        WHERE ts.trip_id = t.trip_id AND ts.shipment_id = s.shipment_id
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM tripshipments
      WHERE trip_id IN (SELECT trip_id FROM trips WHERE (origin, destination) IN
        (('Toronto','Montreal'), ('Calgary','Edmonton'), ('Vancouver','Winnipeg'))
      );
    `);
    await queryRunner.query(`
      DELETE FROM trips
      WHERE (origin, destination) IN
        (('Toronto','Montreal'), ('Calgary','Edmonton'), ('Vancouver','Winnipeg'));
    `);
  }
}
