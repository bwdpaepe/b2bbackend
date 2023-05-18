import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class addCategorie1683221364822 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "categorie",
        columns: [
          {
            name: "id",
            type: "BIGINT",
            isNullable: false,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "naam",
            type: "varchar",
            length: "255",
            isUnique: true,
          },
        ],
      })
    );

    await queryRunner.addColumn(
      "Producten",
      new TableColumn({
        name: "categorie_id",
        type: "BIGINT",
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      "Producten",
      new TableForeignKey({
        columnNames: ["categorie_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "categorie",
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("Producten", "categorie_id");
    await queryRunner.dropColumn("Producten", "categorie_id");
    await queryRunner.dropTable("categorie");
  }
}
