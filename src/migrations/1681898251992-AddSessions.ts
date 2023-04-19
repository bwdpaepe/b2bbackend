import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableIndex,
    TableColumn,
    TableForeignKey,
} from "typeorm"

export class AddSessions1681898251992 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table(
                {
                    name: "session",
                    columns:[
                        {
                            name: "sessionId",
                            type: "BIGINT",
                            isNullable: false,
                            isPrimary: true,
                        },
                        {
                            name : "userId",
                            type : "BIGINT",
                            isNullable : false,
                            isUnique: true,

                        },
                        {
                            name: "sessionStart",
                            type: "DATETIME",
                            isNullable: false,
                        },
                        {
                            name: "sessionEnd",
                            type: "DATETIME",
                            isNullable: false,
                        },
                        {
                            name: "lastNotificationCheck",
                            type: "DATETIME",
                            isNullable: false,
                        }
                    ]
                }
            )
        )
        await queryRunner.createForeignKey("session", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["ID"],
            referencedTableName: "gebruikers",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"

        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("session")
    }

}
