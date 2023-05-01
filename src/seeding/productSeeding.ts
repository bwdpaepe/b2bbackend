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
    CASE id % 10
      WHEN 0 THEN 0
      WHEN 1 THEN 50
      WHEN 2 THEN 100
      WHEN 3 THEN 150
      WHEN 4 THEN 200
      WHEN 5 THEN 250
      WHEN 6 THEN 300
      WHEN 7 THEN 350
      WHEN 8 THEN 400
      WHEN 9 THEN 450
    END
  WHERE id > 0;
  `);

    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('Curology zalf v', ID), picture_filepath = 'curology.jpg', omschrijving = 'De Curology cleanser is een reinigingsproduct dat bedoeld is om vuil, overtollig talg en make-up van het gezicht te verwijderen en de huid voor te bereiden op andere huidverzorgingsproducten. Het product heeft een inhoud van 80 ml en bevat ingrediënten die de huid zacht reinigen zonder deze uit te drogen.'
    WHERE ID IN (1, 6, 11, 16);
    `);

    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('Computer muis v', ID), picture_filepath = 'muis.jpg', omschrijving = "Deze muis is ontworpen voor comfortabel gebruik met zowel links- als rechtshandige gebruikers. Het heeft een optische sensor die zorgt voor precieze en responsieve tracking en een scrollwiel voor het snel navigeren door webpagina's en documenten."
    WHERE ID IN (3, 8, 13, 18);
    `);

    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('Gameboy Color v', ID), picture_filepath = 'gameboy.jpg', omschrijving = "De Gameboy Color kwam in 1998 op de markt. Samen met de Gameboy Classic zijn er maar liefst 120 miljoen exemplaren verkocht. Met twee AA batterijen kan er ongeveer 13 uur worden gespeeld. Een must-have voor de retro gamer!"
    WHERE ID IN (4, 9, 14, 19);
    `);

    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('Patchouli olie v', ID), picture_filepath = 'patchouli.jpg', omschrijving = "Patchouli olie stimuleert de vernieuwing van je huidcellen, waardoor de olie littekens en acne kan helpen vervagen. Hoe langer je de olie houdt, hoe krachtiger hij wordt, net als een goeie wijn dus verbetert de kwaliteit met de ouderdom. Last but not least, is de olie ook insectwerend."
    WHERE ID IN (5, 10, 15, 20);
    `);

    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('LED kaarsen v', ID), picture_filepath = 'kaarsen.jpg', omschrijving = "4 Led kaarsen op batterij (inbegrepen). Batterij ook weer vervangbaar. Het is ideaal als alternatief voor traditionele kaars voor binnen, maar ook voor buiten in een lantaren of een van onze herdenkingslichten. Hebben een lange brandtijd. Het ledje flikkerd net een echte kaars en is 100% veilig."
    WHERE ID IN (2, 7, 12, 17);
    `);

    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('Beker v', ID), picture_filepath = 'beker.jpg', omschrijving = 'Drinkbeker van kunststof 300 ml in het roze. Afmetingen: ca. 8 x 10 cm. Inhoud: ca. 300 ml. Materiaal: kunststof.'
    WHERE ID IN (21, 26, 31, 36);
    `);

    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('Koffie Houseblend v', ID), picture_filepath = 'koffie.jpg', omschrijving = 'Onze ‘House Blend’ is een mengeling van de Colombia, Brazil en Ethiopië. Deze blend heeft een gebalanceerde smaak, ook ideaal in combinatie met melk. De Houseblend heeft een medium body, waarin je zowel de zoete eigenschappen van de Colombia zal smaken als de citrusachtige toetsen van de Ethiopië.'
    WHERE ID IN (23, 28, 33, 38);
    `);

    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('Caffeine serum v', ID), picture_filepath = 'serum.jpg', omschrijving = "Met een zeer geconcentreerde dosering van caffeïne en Epigallocatechine Gallatyl Glucoside (EGCG) afkomstig van groene theeblaadjes, absorbeert het lichte serum snel in het kwetsbare gebied rond de ogen om te helpen verkleuringen te verminderen en symptomen van vermoeidheid en stress te verlichten. De huid voelt verfrist en gelift aan met verbeterde hydratatie en een meer gelijkmatige tint."
    WHERE ID IN (24, 29, 34, 39);
    `);

    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('Zonnebril v', ID), picture_filepath = 'zonnebril.jpg', omschrijving = "Met onze nieuwste model zonnebril creëert u makkelijk een modieuze ‘look’. Onze brillen zijn ideaal voor het strand, park, autorijden en fietsen of tijdens het sporten."
    WHERE ID IN (25, 30, 35, 40);
    `);

    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('Koptelefoon v', ID), picture_filepath = 'koptelefoon.jpg', omschrijving = "De eenvoudig te gebruiken koptelefoon heeft een batterij die tot wel 40 uur meegaat en met de USB-C oplaadkabel binnen 5 minuten oplaadt voor 2 extra uren muziek. En als er iemand belt terwijl je een video op een ander apparaat aan het bekijken bent, schakelt onze koptelefoon naadloos over naar je mobiel."
    WHERE ID IN (22, 27, 32, 37);
    `);

    console.log("Product seeding executed successfully!");
    connection.end();
  } catch (error) {
    console.error(error);
  }
})();
