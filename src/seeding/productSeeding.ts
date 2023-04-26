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
    
UPDATE producten SET picture_filepath =
CASE 
  WHEN LEVERANCIER_ID = 1 AND id % 5 = 1 THEN 'product_picture1.jpg'
  WHEN LEVERANCIER_ID = 1 AND id % 5 = 2 THEN 'product_picture5.jpg'
  WHEN LEVERANCIER_ID = 1 AND id % 5 = 3 THEN 'product_picture2.jpg'
  WHEN LEVERANCIER_ID = 1 AND id % 5 = 4 THEN 'product_picture3.jpg'
  WHEN LEVERANCIER_ID = 1 AND id % 5 = 0 THEN 'product_picture4.jpg'
  WHEN LEVERANCIER_ID = 2 AND id % 5 = 1 THEN 'product_picture6.jpg'
  WHEN LEVERANCIER_ID = 2 AND id % 5 = 2 THEN 'product_picture10.jpg'
  WHEN LEVERANCIER_ID = 2 AND id % 5 = 3 THEN 'product_picture7.jpg'
  WHEN LEVERANCIER_ID = 2 AND id % 5 = 4 THEN 'product_picture8.jpg'
  WHEN LEVERANCIER_ID = 2 AND id % 5 = 0 THEN 'product_picture9.jpg'
  WHEN LEVERANCIER_ID = 3 AND id % 5 = 1 THEN 'product_picture11.jpg'
  WHEN LEVERANCIER_ID = 3 AND id % 5 = 2 THEN 'product_picture15.jpg'
  WHEN LEVERANCIER_ID = 3 AND id % 5 = 3 THEN 'product_picture12.jpg'
  WHEN LEVERANCIER_ID = 3 AND id % 5 = 4 THEN 'product_picture13.jpg'
  WHEN LEVERANCIER_ID = 3 AND id % 5 = 0 THEN 'product_picture14.jpg'
  WHEN LEVERANCIER_ID = 4 AND id % 5 = 1 THEN 'product_picture16.jpg'
  WHEN LEVERANCIER_ID = 4 AND id % 5 = 2 THEN 'product_picture20.jpg'
  WHEN LEVERANCIER_ID = 4 AND id % 5 = 3 THEN 'product_picture17.jpg'
  WHEN LEVERANCIER_ID = 4 AND id % 5 = 4 THEN 'product_picture18.jpg'
  WHEN LEVERANCIER_ID = 4 AND id % 5 = 0 THEN 'product_picture19.jpg'
  WHEN LEVERANCIER_ID = 5 AND id % 5 = 1 THEN 'product_picture21.jpg'
  WHEN LEVERANCIER_ID = 5 AND id % 5 = 2 THEN 'product_picture25.jpg'
  WHEN LEVERANCIER_ID = 5 AND id % 5 = 3 THEN 'product_picture22.jpg'
  WHEN LEVERANCIER_ID = 5 AND id % 5 = 4 THEN 'product_picture23.jpg'
  WHEN LEVERANCIER_ID = 5 AND id % 5 = 0 THEN 'product_picture24.jpg'
  ELSE picture_filepath
END
WHERE LEVERANCIER_ID IN (1, 2, 3, 4, 5);
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
