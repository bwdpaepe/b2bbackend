import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddProductCategory1683208846665 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "producten",
      new TableColumn({
        name: "categorie",
        type: "varchar",
        length: "255",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("producten", "categorie");
  }
}
