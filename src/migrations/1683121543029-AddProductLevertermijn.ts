import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddProductLevertermijn1683121543029 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("Producten", [
      new TableColumn({
        name: "levertermijn",
        type: "integer",
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("Producten", "levertermijn");
  }
}
