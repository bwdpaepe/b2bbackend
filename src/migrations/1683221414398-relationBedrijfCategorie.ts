import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class relationBedrijfCategorie1683221414398
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "bedrijf_categorie",
        columns: [
          {
            name: "bedrijfId",
            type: "bigint",
            isPrimary: true,
          },
          {
            name: "categorieId",
            type: "bigint",
            isPrimary: true,
          },
        ],

        foreignKeys: [
          {
            columnNames: ["bedrijfId"],
            referencedColumnNames: ["ID"],
            referencedTableName: "bedrijf",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
          {
            columnNames: ["categorieId"],
            referencedColumnNames: ["id"],
            referencedTableName: "categorie",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("bedrijf_categorie");
  }
}
