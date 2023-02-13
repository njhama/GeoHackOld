
mapboxgl.accessToken = 'pk.eyJ1Ijoibmlja3loYW1hIiwiYSI6ImNsMHIwbDY0dTJmaXIzYm41ZmMydHdlNHQifQ.s0e5ntX9Pp0nJur9tPv2Bw';

const map = new mapboxgl.Map
({
    container: 'map',
    style: 'mapbox://styles/nickyhama/cl2f6k55u000014qqkyfv26ml',
    center: [0, 0],
    zoom: 1
});
//mapbox://styles/nickyhama/cl2f6iiy8000214qmakcw4nyk

let messageBox = document.getElementById("fullMessage");
let msg = document.getElementById("inputfield")
var MarkerOn = false;
var marker, marker2;
let ServerStatus = document.getElementById("serverStatus");
let serverConnection = false;
var long = 0,lat = 0
const terminal = document.getElementById("terminal");

//Server Configuration
let port = prompt("Enter port")
//let port = "9001"
const socket = io("ws://localhost:" + port);

socket.on('connect', function() {
    ServerStatus.innerHTML = "Connected to Server: True";
    ServerStatus.style.color = "green";
    serverConnection = true;
});

socket.on('disconnect', function() {
    ServerStatus.innerHTML = "Disconnected from Server"
    ServerStatus.style.color = "red"
    serverConnection = false;
});

socket.on('coords', longlat => 
{
    long = longlat.substring(0, longlat.indexOf(","));
    lat =  longlat.substring(longlat.indexOf(",") +1, longlat.length - 1);

    flyToLoc(long, lat);
    getCountryName(long, lat);

    if (MarkerOn)   {marker.remove();}

    marker = new mapboxgl.Marker({
        color: "#5E9DAD",
        draggable: false
    }).setLngLat([long, lat])
    .addTo(map)
        
    MarkerOn = true;
});

function flyToLoc(long, lat)
{
    zoomAmmount1 = 5;
    map.flyTo({
        center: [long, lat],
        zoom: zoomAmmount1,
        essential: true 
    });

}

async function getCountryName(lng, lat) {
    const mapbox_access_token = 'pk.eyJ1Ijoibmlja3loYW1hIiwiYSI6ImNsMHIwbDY0dTJmaXIzYm41ZmMydHdlNHQifQ.s0e5ntX9Pp0nJur9tPv2Bw';
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=poi&access_token=${mapbox_access_token}`;
  
    const response = await fetch(url);
    const data = await response.json();
  
    try{
        var location = data.features[0].place_name;
    }
    catch (error)   {
        location =  data.features[0].text;
    }
    
    const server_text = document.getElementById("server_text").innerHTML = "This is " + location;
  }
  

  
