
mapboxgl.accessToken = 'pk.eyJ1Ijoibmlja3loYW1hIiwiYSI6ImNsMHIwbDY0dTJmaXIzYm41ZmMydHdlNHQifQ.s0e5ntX9Pp0nJur9tPv2Bw';

const map = new mapboxgl.Map
({
    container: 'map',
    style: 'mapbox://styles/nickyhama/cl2f6k55u000014qqkyfv26ml',
    center: [0, 0],
    zoom: 1
});
//mapbox://styles/nickyhama/cl2f6iiy8000214qmakcw4nyk


//Web Logic
//127.0.0.1
//192.168.0.12
//192.168.56.1
//socket connect here
//const socket = io("ws://localhost:9000");
let messageBox = document.getElementById("fullMessage");
let msg = document.getElementById("inputfield")
var MarkerOn = false;
var marker, marker2;
let ServerStatus = document.getElementById("serverStatus");
let serverConnection = false;
var long = 0,lat = 0
const terminal = document.getElementById("terminal");

//Server Configuration
let port = "9001"
const socket = io("ws://localhost:" + port);

socket.on('connect', function() {
    ServerStatus.innerHTML = "Connected to Server: True";
    ServerStatus.style.color = "green";
    serverConnection = true;
    terminal.innerHTML += "<br>Server: User has connected";

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

    //FLy to Location
    flyToLoc(long, lat);
    //getCoordInfo(long, lat);
    //addToTable(long, lat);
    getCountryName(long, lat);
    //ADD MARKER BASED ON COORDS
    if (MarkerOn)
    {
        marker.remove()
       
    }

    marker = new mapboxgl.Marker({
        color: "#5E9DAD",
        draggable: false
        }).setLngLat([long, lat])
        .addTo(map)
        
   

    MarkerOn = true;

    //terminal.innerHTML += "<br>Server: New Location detected. (" + long + ", " + lat + ") ";



});




function blobToString(b) {
    var u, x;
    u = URL.createObjectURL(b);
    x = new XMLHttpRequest();
    x.open('GET', u, false); 
    x.send();
    URL.revokeObjectURL(u);
    return x.responseText;
}


function flyToLoc(long, lat)
{

    //var zoomAmmount1 = document.getElementById("m1zoom").value
    zoomAmmount1 = 5;

    map.flyTo({
        center: [long, lat],
        zoom: zoomAmmount1,
        essential: true 
        });

}



async function getCountryName(lng, lat) {
    // Set your Mapbox access token
    const mapbox_access_token = 'pk.eyJ1Ijoibmlja3loYW1hIiwiYSI6ImNsMHIwbDY0dTJmaXIzYm41ZmMydHdlNHQifQ.s0e5ntX9Pp0nJur9tPv2Bw';
  
    // Set the URL of the Mapbox Geocoder API endpoint
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=poi&access_token=${mapbox_access_token}`;
  
    // Make the HTTP request to the API
    const response = await fetch(url);
  
    // Get the JSON data from the responsde
    const data = await response.json();
  
    // Get the country name from the data
    //const country_name = data.features[3].text;
    //alert(data.features.text)
   
    //alert(country_name) 
    //alert(JSON.stringify(data.features))
    
    //terminal.innerHTML += "<br>Server: This is " + data.features[0].place_name;
    try{
        var location = data.features[0].place_name;
    }
    catch (error)   {
        location =  data.features[0].text;
    }
    
    
    terminal.insertAdjacentHTML('afterbegin', `<div class = "srv_msg">This is ${location}</div>`);
  }
  

  
