import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInventoryAdjustmentsTable1743761613690
  implements MigrationInterface
{
  name = 'CreateInventoryAdjustmentsTable1743761613690';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "inventory_adjustments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "adjustment_type" character varying NOT NULL, "reason" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "product_id" uuid, CONSTRAINT "PK_67a6cd67ec23f212ac3d124325e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_adjustments" ADD CONSTRAINT "FK_fe247ee01cf040fc74cb2656c99" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inventory_adjustments" DROP CONSTRAINT "FK_fe247ee01cf040fc74cb2656c99"`,
    );
    await queryRunner.query(`DROP TABLE "inventory_adjustments"`);
  }
}
