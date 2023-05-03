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
