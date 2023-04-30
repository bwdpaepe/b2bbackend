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
                ],
                foreignKeys:[{
                    name: "winkelmand",
                    referencedTableName:"winkelmand",
                    referencedColumnNames:["id"],
                    columnNames:["winkelmand_id"],
                    onDelete: "NO ACTION",
                    onUpdate: "NO ACTION"

                },
                {
                    name: "producten_winkelmand",
                    referencedTableName:"producten",
                    referencedColumnNames:["ID"],
                    columnNames:["product_id"],
                    onDelete:"NO ACTION",
                    onUpdate:"NO ACTION"

                }
            ]

            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("winkelmand_producten")
    }

}
