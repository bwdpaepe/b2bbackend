import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm"

export class foreignkeysWinkelmandproducten1682931009287 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey("winkelmand", new TableForeignKey(                    {
            name: "user_id",
            referencedTableName: "gebruikers",
            referencedColumnNames: ["ID"],
            columnNames:["user_id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }))

        await queryRunner.createForeignKey("winkelmand", new TableForeignKey(       
            {
                name:"winkelmand_producten_id",
                referencedTableName:"winkelmand_producten",
                referencedColumnNames:["id"],
                columnNames:["winkelmand_producten_id"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            }
        ))

        await queryRunner.createForeignKey("winkelmand_producten", new TableForeignKey(       
            {
                name: "winkelmand",
                referencedTableName:"winkelmand",
                referencedColumnNames:["id"],
                columnNames:["winkelmand_id"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE"

            }
        ))

        await queryRunner.createForeignKey("winkelmand_producten", new TableForeignKey(       
            {
                name: "producten_winkelmand",
                referencedTableName:"producten",
                referencedColumnNames:["ID"],
                columnNames:["product_id"],
                onDelete:"CASCADE",
                onUpdate:"CASCADE"

            }
        ))




    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
