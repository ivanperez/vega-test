const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");
const http = require("http");
const socketIo = require("socket.io");

const app = express();

const API_KEY_AEMET =
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZW1ldC5lc0BpdmFwZXIuY29tIiwianRpIjoiYTdiMzAzYmUtNDYwZi00ZTBkLTg2MGEtOGVjMDBkOTliMGUzIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE1NjAwOTI2NjIsInVzZXJJZCI6ImE3YjMwM2JlLTQ2MGYtNGUwZC04NjBhLThlYzAwZDk5YjBlMyIsInJvbGUiOiIifQ.3nLJ7YGgMJ1prUp4T5ijhAHGjeofBmTh6v1v0K5MYCM";

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/api/stations", function(req, res) {
  axios({
    method: "get",
    url:
      "https://opendata.aemet.es/opendata/api/valores/climatologicos/inventarioestaciones/todasestaciones/",
    params: { api_key: API_KEY_AEMET }
  })
    .then(function(response) {
      axios({
        method: "get",
        url: response.data.datos,
        responseType: "arraybuffer"
      }).then(function(response) {
        const data = JSON.parse(response.data.toString("latin1"));
        const result = data.map(({ indicativo, nombre }) => {
          return {
            key: indicativo,
            value: nombre
          };
        });
        res.send(result);
      });
    })
    .catch(function(error) {
      res.send("error");
    });
});

let cache = [];

app.get("/api/temperature", function(req, res) {
  axios({
    method: "get",
    url:
      "https://opendata.aemet.es/opendata/api/valores/climatologicos/diarios/datos/fechaini/2018-01-01T00:00:00UTC/fechafin/2018-12-31T23:59:59UTC/estacion/6156X/",
    params: { api_key: API_KEY_AEMET }
  })
    .then(function(response) {
      axios({
        method: "get",
        url: response.data.datos,
        responseType: "arraybuffer"
      }).then(function(response) {
        const data = JSON.parse(response.data.toString("latin1"));
        const result = data.map(({ fecha, tmed, tmax, tmin }) => ({
          date: `${fecha} 00:00`,
          temp: parseFloat((tmed || tmax || tmin || "20").replace(",", "."))
        }));

        cache = result;

        res.send(cache);
      });
    })
    .catch(function(error) {
      res.send("error");
    });
});

const server = http.createServer(app);
const io = socketIo(server);
const NUM_UPDATES = 10;
const getApiAndEmit = async socket => {
  try {
    if (cache.length) {
      const idx = Math.floor(Math.random() * (cache.length - NUM_UPDATES));
      for (let index = idx; index < idx + NUM_UPDATES; index++) {
        cache[index].temp = cache[index].temp + Math.floor(Math.random() * 4);
      }
      socket.emit("UPDATE", cache);
    }
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

let interval;
io.on("connection", socket => {
  console.log("New client connected");

  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(() => getApiAndEmit(socket), 1000 * 2);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(process.env.PORT || 8080);
