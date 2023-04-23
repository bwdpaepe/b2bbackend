import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();
/*
  This script will seed the product table with 100 products.
  run this script with: npm run seed
*/

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USERNAME,
      port: Number(process.env.DATABASE_PORT),
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    });

    await connection.execute(`
    UPDATE producten SET picture_filepath = CONCAT('product_picture', ((id - 1) % 25 + 1), '.jpg') WHERE id > 0;
  `);

    await connection.execute(`UPDATE producten SET voorraad = 
    CASE id % 5
      WHEN 0 THEN 0
      WHEN 1 THEN 5
      WHEN 2 THEN 10
      WHEN 3 THEN 15
      WHEN 4 THEN 20
    END
  WHERE id > 0;
  `);

    await connection.execute(`   
    UPDATE producten
    SET omschrijving = CONCAT('Dit is een omschrijving van ', naam)
    WHERE ID BETWEEN 1 AND 100
    `);

    console.log("Product seeding executed successfully!");
    connection.end();
  } catch (error) {
    console.error(error);
  }
})();
