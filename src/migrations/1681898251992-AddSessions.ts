import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableIndex,
    TableColumn,
    TableForeignKey,
} from "typeorm"

/* deze file wordt gecreerde door de CLI npx typeorm migration:create ./src/migrations/<KIES UW NAAM>
* voeg daarna deze classe in de migration-data-source.ts en run het script npm run migration
* Vul zeker ook de public async down const in! dat is het omgekeerde van de up. (zie het als een rollback manier)
* TypeORM voegt dan een timestamp toe aan de migratie, deze zal maar 1 keer uitgevoerd worden, ongeacht hoe vaak je de migration command uitvoert (tenzij je het revert hebt op een bepaald punt)
*/

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
                            isGenerated: true,
                            generationStrategy: "increment"
                            
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
                            isNullable: true,
                            
                        },
                        {
                            name: "lastNotificationCheck",
                            type: "DATETIME",
                            isNullable: true,
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
