import { MigrationInterface, QueryRunner } from "typeorm";

export class categorieSeeding1683221473794 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO categorie (naam)
            VALUES
              ('Kleding'),
              ('Kantoorbenodigdheden'),
              ('Drank'),
              ('Decoratie'),
              ('Glazen'),
              ('Verzorgingsproducten'),
              ('Elektronica')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM categorie
            WHERE naam IN ('Kleding', 'Kantoorbenodigdheden', 'Drank', 'Decoratie', 'Glazen', 'Verzorgingsproducten', 'Elektronica')`);
  }
}
