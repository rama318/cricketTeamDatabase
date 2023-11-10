const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.join());
const dbPath = path.join(__dirname, "cricketMatchDetails.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const convertObjectPlayerDetails = (objectItem) => {
  return {
    playerId: objectItem.player_id,
    playerName: objectItem.player_name,
  };
};

//API-1

app.get("/players/", async (request, response) => {
  const getPlayerQuery = `select * from player_details`;
  const responseGetPlayerQuery = await db.all(getPlayerQuery);
  response.send(
    responseGetPlayerQuery.map((eachItem) =>
      convertObjectPlayerDetails(eachItem)
    )
  );
});

module.exports = app;
