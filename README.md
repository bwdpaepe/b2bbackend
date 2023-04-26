# 2023 Backend T03

## Studenten

- Ian Daelman
- Bart De Paepe
- Joachim Dauchot
- Dimitri Valckenier

## Vereisten

De volgende software dient reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [npm](https://www.npmjs.com/)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

## Opstarten

- aanmaken .env file (in root folder) met de volgende variabelen: <br />

      NODE_ENV="development"

      DATABASE_USERNAME=[DB_USERNAME]
      DATABASE_PASSWORD=[DB_PW]
      DATABASE_PORT=[DB_PORT]
      DATABASE_HOST=[DB_HOST]
      DATABASE_NAME=[DB_NAME]
      CORS_ORIGIN=[URL]

      #JWT config
      JWT_SECRET=[JWT_KEY]
      BCRYPTHASHING_SALT_ROUNDS=[NUMBER]

- installatie van de dependencies via dit commando: **npm i** <br />
- starten van de webservice via dit commando: **npm run start** <br />
