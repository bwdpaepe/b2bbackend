import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterProducts1682016268609 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("producten", [
      new TableColumn({
        name: "voorraad",
        type: "integer",
        isNullable: true,
      }),
      new TableColumn({
        name: "picture_filepath",
        type: "varchar",
        isNullable: true,
      }),
      new TableColumn({
        name: "omschrijving",
        type: "text",
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns("produten", [
      new TableColumn({
        name: "voorraad",
        type: "integer",
        isNullable: true,
      }),
      new TableColumn({
        name: "picture_filepath",
        type: "varchar",
        isNullable: true,
      }),
      new TableColumn({
        name: "omschrijving",
        type: "text",
        isNullable: true,
      }),
    ]);
  }
}
