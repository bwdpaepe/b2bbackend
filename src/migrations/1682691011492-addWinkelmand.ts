import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class addWinkelmand1682691011492 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table(
                {
                    name: "winkelmand",
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
                            name : "user_id",
                            type : "BIGINT",
                            isNullable : false,
                            isUnique: true,

                        },
                        {
                            name : "product_id",
                            type: "BIGINT",
                            isNullable : false,
                            isUnique: true,

                        }

                    ],
                    foreignKeys: [
                    {
                        name: "user_id",
                        referencedTableName: "gebruikers",
                        referencedColumnNames: ["ID"],
                        columnNames:["user_id"],
                        onDelete: "NO ACTION",
                        onUpdate: "NO ACTION"
                    },
                    {
                        name:"product_id",
                        referencedTableName:"producten",
                        referencedColumnNames:["ID"],
                        columnNames:["product_id"],
                        onDelete: "NO ACTION",
                        onUpdate: "NO ACTION"
                    }
                    ]
                    
                }
            )
        )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("winkelmand");
    }

}
