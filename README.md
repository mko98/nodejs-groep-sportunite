# Node Mongodb server
Nodejs server, biedt API op een Mongodb database met userinformatie.
De server heeft geen frontend; hiervoor is een externe frontend applicatie nodig, zoals bijvoorbeeld deze [angular-starterpack](https://github.com/avansinformatica/angular-starterpack).

## Vooraf
- nodejs installeren
- Mongodb installeren

## Gebruik
Vanaf command line:
```
npm install
npm start
```
De server runt op [localhost:3000](http://localhost:3000) en op [Heroku](https://node-mongodb-server.herokuapp.com/api/v1/users).

## API Endpoints
Aanroepen van de endpoints kan met [Postman](https://www.getpostman.com/docs/introduction). 

Voorbeelden van endpoints: 
- GET,POST [localhost:3000/api/v1/users](http://localhost:3000/api/v1/users)
- GET, PUT, DELETE [localhost:3000/api/v1/users/2](http://localhost:3000/api/v1/users/2)

## Heroku
Je kunt de server gemakkelijk op Heroku of een andere cloudprovider deployen. Je moet dan wel zorgen dat je ook een Mongo database-in-the-cloud hebt. Dat kan onder andere gratis bij [mLab](https://mlab.com).

Hier kun je een Mongodb database aanmaken. De naam kies je zelf. Je krijgt bij je database een connectionstring die het mogelijk maakt met je database te verbinden. Die string heeft de volgende vorm:

```
mongodb://<dbuser>:<dbpassword>@ds115166.mlab.com:15166/node-mongodb-users
```

Let op: je moet een user in je database aanmaken. Dit is de user met account 'dbuser' en wachtwoord 'dbpassword'.

De connectionstring bouwen we op aan de hand van onderstaande omgevingsvariabelen.

### Omgevingsvariabelen
In de cloud moet je een aantal omgevingsvariabelen instellen. Dit zijn variablelen waarin configuratiewaarden zijn opgeslagen. Je wilt die settings (bv username, password) niet hardcoded in je programmabestanden opslaan.

![config vars](https://github.com/avansinformatica/node-mongodb-server/blob/master/configvars.png)

De variabelen die je moet instellen:
- ALLOW_ORIGIN: de URL van je Angular frontend. Hiermee geef je je frontend toegang tot de server.
- DB_DATABASE: de naam van je database
- DB_HOST: de host waar je database draait
- DB_PASSWORD: password van de database user
- DB_PORT: de port waarop je database bereikbaar is
- DB_USER: username waarmee je in je database inlogt

