import { MigrationInterface, QueryRunner, Table } from "typeorm"
import { query } from "winston"

export class addWinkelmandProducten1682848647253 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "winkelmand_producten",
                columns:[
                {
                    name: "id",
                    type: "BIGINT",
                    isNullable: false,
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                        
                },    
                {
                    name: "winkelmand_id",
                    type: "BIGINT"
                },
                {
                    name:"product_id",
                    type:"BIGINT"
                },
                {
                    name: "aantal",
                    type:"int"
                }
                ]

            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("winkelmand_producten")
    }

}
