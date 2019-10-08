
// SPI SETUP

spi.setup({
  mosi: NodeMCU.D5,
  miso: NodeMCU.D4,
  sck: NodeMCU.D3
});

var nfc = require("MFRC522").connect(spi, NodeMCU.D2 /*CS*/ );
setInterval(function() {
  nfc.findCards(function(card) {
    print("Found card " + card);
    card = JSON.stringify(card);
	}
}

// WiFi setup

var wifi = require("Wifi");
var http = require('http');
var WIFI_NAME = "name";
var WIFI_OPTIONS = {
  password: "pass"
}

wifi.connect(WIFI_NAME, WIFI_OPTIONS, function(err) {
  if (err) {
    console.log("Connection error: " + err);
    return;
  }
  console.log("Connected!");
});