
// SPI SETUP
var spi = new SPI();
spi.setup({
  mosi: NodeMCU.D6,
  miso: NodeMCU.D7,
  sck: NodeMCU.D8
});

var nfc = require("MFRC522").connect(spi, NodeMCU.D1 /*CS*/ );
setInterval(function() {
  nfc.findCards(function(card) {
    print("Found card " + card);
    card = JSON.stringify(card);
	}
  );
}

            );
// WiFi setup

var wifi = require("Wifi");
var http = require('http');
var WIFI_NAME = "Redmib";
var WIFI_OPTIONS = {
  password: "12345678"
};

wifi.connect(WIFI_NAME, WIFI_OPTIONS, function(err) {
  if (err) {
    console.log("Connection error: " + err);
    return;
  }
  console.log("Connected!");
});
