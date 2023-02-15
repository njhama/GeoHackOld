const puppeteer = require("puppeteer");
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });

//let argument  = process.argv.slice(1);
let portInpt = process.argv[2];
//let heightInpt = parseInt(argument[1]);
//let widthInpt = parseInt(argument[2]);
let heightInpt = 1200;
let widthInpt = 1200;

console.log("Launching...");
console.log("Port: " + portInpt);
console.log("Height: " + heightInpt);
console.log('Width: ' + widthInpt);
console.log("-" * 20);

io.on('connection', (socket) => {
    socket.emit("Connected");
    let newDate = new Date().toLocaleTimeString();
    console.log(`[${newDate}] ${socket.id} Connected`);
});

http.listen(portInpt, () => {
    console.log(`Server Online: Port ${portInpt}`);
    console.log("-------------------------");
});

const url = "https://www.geoguessr.com/signin";
let lastLat = 0;
let lastLong = 0;


async function start() {
    await puppeteer
        .launch({
            headless: false,
            ignoreDefaultArgs: ["--disable-extensions", "--enable-automation",],
            defaultViewport: null
        })
        .then(async (browser) => {
            const page = await browser.newPage();

            await page.setViewport({
                width: widthInpt,
                height: heightInpt
            });

            page.on("response", async (response) => {
                if (response.url().includes("GeoPhotoService")) {
                    const location = await response.text();
                    let intlong = location.indexOf("[[null,null");
                    const longlat = location.substring(intlong + 12, intlong + 44);
                    let lat = longlat.substring(0, longlat.indexOf(",") - 1);
                    let long = longlat.substring(longlat.indexOf(",") + 1, longlat.length - 1);

                    if (Math.round(lat) !== lastLat && Math.round(long) !== lastLong) {
                        lastLat = Math.round(lat);
                        lastLong = Math.round(long);
                        let newDate = new Date().toLocaleTimeString();
                        io.emit("coords", `${long},${lat}`);
                        console.log(`[${newDate}] Latitude: ${lat} Longitude: ${long}`);
                    }
                }
            });

            await page.goto(url, {
                waitUntil: "load",
                timeout: 0
            });
        });
}

start()