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

    await connection.execute(`UPDATE producten SET levertermijn = 
    CASE id % 3
      WHEN 0 THEN 1
      WHEN 1 THEN 2
      WHEN 2 THEN 3
    END
  WHERE id > 0;
  `);

    //Leverancier 1
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

    //Leverancier 2
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

    //Leverancier 3
    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('Gloss v', ID), picture_filepath = 'gloss.jpg', omschrijving = 'De lipgloss formule is verrijkt met hyaluronzuur, collageen complex, pepermuntolie en menthol voor een plumping effect in de lippen. Hyaluronzuur ondersteunt de vochthuishouding voor hydratatie van de lippen. Het collageen complex versterkt de lippen en accentueert de natuurlijke vorm.'
    WHERE ID IN (41, 46, 51, 56);    
    `);

    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('Bloempot v', ID), picture_filepath = 'bloempot.jpg', omschrijving = "Deze prachtige design pot van gerecycled plastic is vorstbestendig en daardoor geschikt voor alle seizoenen in de tuin of op het terras. De pot heeft een geïntegreerd waterreservoir dat jouw planten altijd voldoende water hebben. Deze bloempotten zijn gemaakt van hoge kwaliteit plastic, waardoor ze makkelijk schoon te maken zijn, niet snel beschadigen en dus tegen een stootje kunnen."
    WHERE ID IN (43, 48, 53, 58);
    `);

    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('Miniatuurauto v', ID), picture_filepath = 'miniatuurauto.jpg', omschrijving = "Volkswagen Beetle (Garbus) Mexico 1985 (Wit) 1/43 Atlas - Modelauto - Schaalmodel - Modelauto - Miniatuurauto - Miniatuur auto's"
    WHERE ID IN (44, 49, 54, 59);    
    `);

    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('RayBan v', ID), picture_filepath = 'rayban.jpg', omschrijving = "De Ray-Ban Justin (RB4165) is een stijlvolle zonnebril geïnspireerd door de iconische Ray-Ban Wayfarer. De Ray-Ban Justin staat voor jeugd en creativiteit. Dit prachtige model heeft grote vierkante lenzen, en een semitransparant montuur afgewerkt met een subtiele rubberlaag."
    WHERE ID IN (45, 50, 55, 60);
    `);

    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('Herenschoenen v', ID), picture_filepath = 'herenschoenen.jpg', omschrijving = "Op zoek naar hoge kwaliteit heren schoenen om je garderobe mee op te vullen? Met deze schoenen heb je altijd een stijlvol schoen in huis. Leren herenschoen in de kleur groen en is gemaakt van Leer en suede met een effen dessin"
    WHERE ID IN (42, 47, 52, 57);
    `);

    //Leverancier 4
    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('Smartwatch v', ID), picture_filepath = 'smartwatch.jpg', omschrijving = 'Waar je ook voor gaat: een betere conditie, fitter worden of allebei, met deze nieuwe smartwatch is jouw personal trainer altijd binnen handbereik en sta je er niet alleen voor.'
    WHERE ID IN (61, 66, 71, 76);
    `);

    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('Namaak banaan v', ID), picture_filepath = 'banaan.jpg', omschrijving = "Banaan fruit decoratie gemaakt van kunststof en verder met de hand afgewerkt."
    WHERE ID IN (63, 68, 73, 78);
    `);

    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('Axe Black Bodyspray Deodorant v', ID), picture_filepath = 'deodorant.jpg', omschrijving = "Verbeterde AXE Black Deodorant Bodyspray: voor effectieve bescherming en een onweerstaanbare geur."
    WHERE ID IN (64, 69, 74, 79);
    `);

    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('Balpen v', ID), picture_filepath = 'balpen.jpg', omschrijving = "De Ray-Ban Justin (RB4165) is een stijlvolle zonnebril geïnspireerd door de iconische Ray-Ban Wayfarer. De Ray-Ban Justin staat voor jeugd en creativiteit. Dit prachtige model heeft grote vierkante lenzen, en een semitransparant montuur afgewerkt met een subtiele rubberlaag."
    WHERE ID IN (65, 70, 75, 80);
    `);

    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('Wijnglas v', ID), picture_filepath = 'wijnglas.jpg', omschrijving = "Dit wijnglas kan voor rode en witte wijn gebruikt worden. Misschien heb jij niet zoveel plek in jouw kast om verschillende wijnglazen te kopen, voor rood en wit. Met dit wijnglas heb je de oplossing."
    WHERE ID IN (62, 67, 72, 77);
    `);

    //Leverancier 5
    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('Fles v', ID), picture_filepath = 'fles.jpg', omschrijving = 'De 250 ml fles Basic Round HDPE is een veelzijdige en betrouwbare verpakkingsoptie voor diverse vloeibare producten, zoals cosmetica, persoonlijke verzorgingsproducten, huishoudelijke reinigingsmiddelen en voedingsmiddelen. Gemaakt van duurzaam en voedselveilig HDPE-materiaal, biedt deze fles een uitstekende bescherming en gebruiksgemak voor zowel consumenten als fabrikanten.'
    WHERE ID IN (81, 86, 91, 96);    
    `);

    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('Organische hennepzaadolie v', ID), picture_filepath = 'hennepzaadolie.jpg', omschrijving = "Gecertificeerd biologische hennepolie, rijke bron van plantaardig omega-3 (ALA) en GLA"
    WHERE ID IN (83, 88, 93, 98);
    `);

    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('Witte stoel v', ID), picture_filepath = 'stoel.jpg', omschrijving = "Deze comfortabele stoel maakt niet alleen indruk met zijn uitstekende ziteigenschappen, maar ook met zijn spannende materiaalmix. De zitschaal is gemaakt van stevig kunststof met kunstlederen bekleding of geheel van stof."
    WHERE ID IN (84,89, 94, 99);
    `);

    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('Waterglas v', ID), picture_filepath = 'waterglas.jpg', omschrijving = "Met dit sierlijke tumblerglas maak je een perfect ingedekte tafel af! Deze tumblerglazen zijn multifunctioneel, gebruik ze voor cocktails of sappen. Daarnaast zijn deze tumblers ook uitstekend te gebruiken als waterglas naast heerlijke wijn."
    WHERE ID IN (85, 90, 95, 100);
    `);

    await connection.execute(`   
    UPDATE producten
    SET naam = CONCAT('Draadloze Presenter v', ID), picture_filepath = 'presenter.jpg', omschrijving = "Met de draadloze Presenter zet je jouw argumenten extra kracht bij. De knoppen voor diavoorstellingen zijn zo geplaatst dat u ze gemakkelijk op de tast kunt vinden om vol vertrouwen door uw presentaties te navigeren. De presenter biedt bovendien een rode laser die u helpt bij het aanwijzen tijdens het presenteren, een opbergbare plug-and-play draadloze ontvanger en de draadloze presenter heeft een bereik van ruim 15 meter."
    WHERE ID IN (82, 87, 92, 97);
    `);

    //TODO string vervangen door de juiste categorie ID
    await connection.execute(`
    UPDATE producten
    SET categorie_id = '7'
    WHERE ID IN (3, 8, 13, 18, 4, 9, 14, 19, 22, 27, 32, 37, 61, 66, 71, 76, 82, 87, 92, 97);
    `);

    await connection.execute(`
    UPDATE producten
    SET categorie_id = '6'
    WHERE ID IN (5, 10, 15, 20, 1, 6, 11, 16, 24, 29, 34, 39, 41, 46, 51, 56, 64, 69, 74, 79, 83, 88, 93, 98);
    `);

    await connection.execute(`
    UPDATE producten
    SET categorie_id = '5'
    WHERE ID IN (21, 26, 31, 36, 62, 67, 72, 77, 81, 86, 91, 96, 85, 90, 95, 100);
    `);

    await connection.execute(`
    UPDATE producten
    SET categorie_id = '4'
    WHERE ID IN (2, 7, 12, 17, 43, 48, 53, 58, 44, 49, 54, 59, 63, 68, 73, 78);
    `);

    await connection.execute(`
    UPDATE producten
    SET categorie_id = '3'
    WHERE ID IN (23, 28, 33, 38);
    `);

    await connection.execute(`
    UPDATE producten
    SET categorie_id = '2'
    WHERE ID IN (65, 70, 75, 80, 84,89, 94, 99);
    `);

    await connection.execute(`
    UPDATE producten
    SET categorie_id = '1'
    WHERE ID IN (25, 30, 35, 40, 45, 50, 55, 60, 42, 47, 52, 57);
    `);

    console.log("Product seeding executed successfully!");

    // Function to generate random numbers within a range
    function getRandomArbitrary(min: number, max: number) {
      return (Math.random() * (max - min) + min).toFixed(0);
    }

    // create dozen for bedrijf 2 tem 5
    for (let bedrijfId = 2; bedrijfId <= 5; bedrijfId++) {
      for (let i = 0; i < 5; i++) {
        // Generate random values for Dimensie properties
        const breedte = getRandomArbitrary(1, 50);
        const hoogte = getRandomArbitrary(1, 50);
        const lengte = getRandomArbitrary(1, 50);

        // Insert the created Dimensie to the database
        const dimensieResult = await connection.execute(`
        INSERT INTO dimensies (BREEDTE, HOOGTE, LENGTE)
        VALUES (${breedte}, ${hoogte}, ${lengte});
      `);

        // Get the inserted Dimensie id
        const dimensieId = (dimensieResult[0] as mysql.OkPacket).insertId;

        // Generate random values for Doos properties
        const type = i % 2 === 0 ? "STANDAARD" : "CUSTOM";
        const isActief = true;
        const naam = `RandomDoosName_${i} _${bedrijfId}_${dimensieId}`;
        const prijs = getRandomArbitrary(10, 100);

        // Insert the created Doos to the database
        await connection.execute(`
      INSERT INTO dozen (BEDRIJF_ID, dimensie, DOOSTYPE, ISACTIEF, NAAM, PRIJS)
      VALUES (${bedrijfId}, ${dimensieId}, '${type}', ${isActief}, '${naam}', ${prijs});
    `);
      }
    }

    connection.end();
  } catch (error) {
    console.error(error);
  }
})();
