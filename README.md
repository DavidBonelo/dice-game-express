## dice-game-express

A express webapp to play a simple game with dices.

The server uses a mongo database, so you need to have a [local mongodb installed and running](https://www.mongodb.com/docs/manual/administration/install-community/), or if you want to use a cloud mongo database you need to modify the `mongoDB` constant in the [app.js](./app.js) file with the [connection string](https://www.mongodb.com/docs/atlas/driver-connection/).

To run the server use the following commands:
```sh
npm install
# for OSX/Linux
DEBUG=express-locallibrary-tutorial:* npm run start
# for Windows
SET DEBUG=express-locallibrary-tutorial:* & npm start
```
Then navigate to [localhost:3000](localhost:3000) inyour browser

> _ps: the routing seems quite random because the instruccions for this exercise were ambiguous :'_