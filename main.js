var container;
var WIFI_NAME = "WIFI_name";
var WIFI_OPTIONS = {
  password: "Password"
};
var device_mode = true; //Logowanie
var wifi = require("Wifi");
var tryb = "";
var odp = "";
wifi.connect(WIFI_NAME, WIFI_OPTIONS, function(err) {
  if (err) {
    console.log("Connection error: " + err);
    return;
  }
  console.log("Connected!");
});


function karty(card) {
  card = card.replace("[", "");
  card = card.replace("]", "");
  card = card + ",";
  if (card.charAt(1) == ",") {
    card = "0" + card;
  }
  console.log(card);
  if (card.charAt(2) == ",") {
    card = "0" + card;
  }
  console.log(card);
  if (card.charAt(5) == ",") {
    card = card.substring(0, 4) + "0" + card.substring(4, 16);
  }
  console.log(card);
  if (card.charAt(6) == ",") {
    card = card.substring(0, 4) + "0" + card.substring(4, 16);
  }
  console.log(card);
  if (card.charAt(8) == ",") {
    card = card.substring(0, 7) + "0" + card.substring(7, 16);
  }
  console.log(card);
  if (card.charAt(9) == ",") {
    card = card.substring(0, 8) + "0" + card.substring(8, 16);
  }
  console.log(card);
  if (card.charAt(10) == ",") {
    card = card.substring(0, 9) + "0" + card.substring(9, 16);
  }
  console.log(card);
  if (card.charAt(12) == ",") {
    card = card.substring(0, 11) + "0" + card.substring(11, 16);
  }
  console.log(card);
  if (card.charAt(13) == ",") {
    card = card.substring(0, 12) + "0" + card.substring(12, 16);
  }
  console.log(card);
  if (card.charAt(14) == ",") {
    card = card.substring(0, 12) + "0" + card.substring(12, 16);
  }
  console.log(card);

  card = card.replace(",", "");
  card = card.replace(",", "");
  card = card.replace(",", "");
  card = card.replace(",", "");
  console.log(card);
  return card;
}
//GET
var http = require("http");
http.get("http://185.243.52.8/api/getCurrentLecture/E4", function(res) {
  var contents = "";
  res.on("data", function(data) {
    contents += data;
  });
  res.on("close", function() {
    var list = JSON.parse(contents);
    console.log(list);
    container = list;
  });
});


var a = 1;
setInterval(function() {
  console.log(device_mode);
  a++;
  if (a > 3) {
    a = 1;
  }
  console.log("zmiana");
  if (device_mode == true) {
    tryb = "logowanie";
  } else {
    tryb = "rejestracja";
  }
}, 5000);

function drawScreen() {
  setInterval(function() {
    if (a == 1) {
      g.clear();
      g.setFontVector(10);
      g.drawString(tryb, 10, 40);
      g.drawString("START DATE:", 10, 12);
      g.drawString(container[0].start_date, 10, 25);
      g.flip();
    }

    if (a == 2) {
      g.clear();
      g.setFontVector(10);
      g.drawString(tryb, 10, 40);
      g.drawString("END DATE:", 10, 12);
      g.drawString(container[0].end_date, 10, 25);
      g.flip();
    }

    if (a == 3) {
      g.clear();
      g.setFontVector(10);
      g.drawString(tryb, 10, 50);
      g.drawString("Lesson:", 10, 10);
      g.drawString(container[0].lesson.name.substring(0, 10), 10, 22);
      g.drawString(container[0].lesson.description, 10, 34);
      g.flip();
    }
    if (a == 4) {
      g.clear();
      g.setFontVector(15);
      g.drawString(odp, 0, 32);

      g.flip();
    }
  }, 1000);
}
drawScreen();

//SPI dla ekranu
var s = new SPI();
s.setup({ mosi: NodeMCU.D0, sck: NodeMCU.D4 });
var g = require("SH1106").connectSPI(
  s,
  NodeMCU.D2 /* DC */,
  NodeMCU.D1,
  drawScreen
);

//----- -------------------------------------

//SPI do kart

var spi1 = new SPI();
spi1.setup({
  mosi: NodeMCU.D6,
  miso: NodeMCU.D5,
  sck: NodeMCU.D7
});
var nfc = require("MFRC522").connect(spi1, NodeMCU.D8 /*CS*/);
function sendRequest(idlegitymacji) {
  console.log(idlegitymacji);
  if (device_mode == true) {
    payload = {
      nfc_id: idlegitymacji
    };
  } else {
    payload = {};
  }
  payload = JSON.stringify(payload);
  registerOptions = {
    host: "185.243.52.8",
    port: 80,
    path:
      device_mode == false
        ? "/api/register/" + idlegitymacji
        : "/api/addAttendanceRecord/" + container[0].id,
    method: "POST",
    protocol: "http",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": payload.length,
      Accept: "application/json"
    }
  };
  var req = http.request(registerOptions, function(res) {
    console.log("Status: " + res.statusCode);
    console.log("Headers: " + JSON.stringify(res.headers));
    res.on("data", function(data) {
      console.log(data);
      if (device_mode == false) {
        odp = "number: " + data;
      } else {
        odp = data;
      }
     
      console.log("HTTP> " + data);
    });
    res.on("close", function(data) {
      console.log("Connection closed");
      console.log(data);
    });
    res.on("error", function(error) {
      console.log(error);
    });
  });
  req.write(payload);
  req.end();
  a = 4;
}

setInterval(function() {
  nfc.findCards(function(card) {
    print("Found card " + card);
    card = JSON.stringify(card);
    card = karty(card);
    sendRequest(card);
  });
}, 500);

setWatch(
  function() {
    device_mode = !device_mode;
  },
  NodeMCU.D3,
  { repeat: true, edge: "rising", /*debounce: 100 ,*/ irq: true }
);
setInterval(function() {
  console.log(device_mode);
}, 1000);