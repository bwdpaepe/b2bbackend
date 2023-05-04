import { MigrationInterface, QueryRunner } from "typeorm";

export class seedBedrijfCategorieTable1683225889624
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
  INSERT INTO bedrijf_categorie (bedrijfId, categorieId)
  VALUES
    (1, 7),
    (1, 4),
    (1, 6),
    (2, 7),
    (2, 5),
    (2, 3),
    (2, 1),
    (2, 6),
    (3, 6),
    (3, 1),
    (3, 4),
    (4, 2),
    (4, 4),
    (4, 5),
    (4, 6),
    (4, 7),
    (5, 2),
    (5, 5),
    (5, 6),
    (5, 7);

`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DELETE FROM bedrijf_categorie
    WHERE bedrijfId IN (1, 2, 3, 4, 5)
    AND categorieId IN (1, 2, 3, 4, 5, 6, 7);
  `);
  }
}
