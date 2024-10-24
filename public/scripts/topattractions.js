const hotel_identifying = window.hotel_identifying;

if (hotel_identifying !== null) {
  var iframeSrc = window.map_iframe;

  var srcMatch = iframeSrc.match(/src="(.*?)"/);
  var src = srcMatch ? srcMatch[1] : null;

  function extractCoordinatesFromGoogleMapsIframe(src) {
    if (src) {
      var latMatch = src.match(/!3d(-?\d+\.\d+)/);
      var lonMatch = src.match(/!2d(-?\d+\.\d+)/);

      if (latMatch && latMatch.length > 1 && lonMatch && lonMatch.length > 1) {
        var latitude = parseFloat(latMatch[1]);
        var longitude = parseFloat(lonMatch[1]);
        return { latitude: latitude, longitude: longitude };
      }
    }

    return null;
  }

  var hotel_coordinates = src
    ? extractCoordinatesFromGoogleMapsIframe(src)
    : null;

  var attractions = window.top_attractions;

  var map = L.map("map", {
    center: [hotel_coordinates.latitude, hotel_coordinates.longitude],
    zoom: 13,
    maxZoom: 18,
    minZoom: 1,
  });

  var redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  if (hotel_coordinates)
    var hotelMarker = L.marker(
      [hotel_coordinates.latitude, hotel_coordinates.longitude],
      { icon: redIcon },
    )
      .addTo(map)
      .bindPopup("<b>" + window.hotel_name + "</b>")
      .openPopup();

  var markers = [hotelMarker || ""];

  if (attractions.length > 0) {
    attractions.forEach(function (attraction) {
      var coords = attraction.coordinates.split(",").map(Number);
      var marker = L.marker(coords)
        .bindPopup(
          "<b>" +
            attraction.name +
            "</b><br>Distance: " +
            attraction.distance +
            " miles",
        )
        .addTo(map);
      markers.push(marker);
    });

    var group = new L.featureGroup(markers);
    map.fitBounds(group.getBounds(), {
      padding: [50, 50],
    });
  } else {
    console.log("No attractions available");
  }

  map.on("zoomend", function () {
    var currentZoom = map.getZoom();
    console.log("Current Zoom Level:", currentZoom);
  });
}

const coordinates_guide = document.getElementById("coordinates_guide");
const modal = new bootstrap.Modal(document.getElementById("instructionModal"));

coordinates_guide.addEventListener("click", function () {
  modal.show();
});

document.addEventListener("DOMContentLoaded", function () {
  const attractionsContainer = document.getElementById("attractionsContainer");
  const addAttractionButton = document.getElementById("addAttraction");
  let index = attractions ? attractions.length : 1;

  addAttractionButton.addEventListener("click", (e) => {
    e.preventDefault();
    const newEntry = document.createElement("div");
    newEntry.classList.add("attractionEntry");
    newEntry.classList.add("mb-2");
    newEntry.classList.add("row");
    newEntry.classList.add("g-2");
    newEntry.classList.add("align-items-center");

    newEntry.innerHTML = `
          <div class='col'>
            <label for='name' class='form-label'>Name of attraction:</label>
            <input type='text' id='name' class='form-control' name='top_attractions[${index}][name]' required>
          </div>

          <div class='col'>
            <label for='distance' class='form-label'>Distance from hotel (miles):</label>
            <input type='number' id='distance' class='form-control' step='0.01' name='top_attractions[${index}][distance]' required>
          </div>

          <div class='col'>
            <label for='coordinates' class='form-label'>Coordinates:</label>
            <input type='text' id='coordinates' class='form-control' name='top_attractions[${index}][coordinates]' required>
          </div>
        `;
    attractionsContainer.appendChild(newEntry);
    index++;
  });
});

function errorModal(title, body) {
  const errorModalInstance = new bootstrap.Modal(
    document.getElementById("errorModal"),
  );

  document.getElementById("errorModalTitle").innerText = title;
  document.getElementById("errorModalBody").innerHTML = body;
  errorModalInstance.show();
}

document
  .getElementById("topAttractions")
  .addEventListener("submit", function (e) {
    const coordinateInputs = document.querySelectorAll(
      'input[name^="top_attractions"][name$="[coordinates]"]',
    );

    const coordinatePattern =
      /^-?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*-?(1[0-7]\d(\.\d+)?|180(\.0+)?|[1-9]?\d(\.\d+)?)$/;

    for (let i = 0; i < coordinateInputs.length; i++) {
      const coordinatesInput = coordinateInputs[i].value;

      if (coordinatesInput.includes("<iframe")) {
        e.preventDefault();
        errorModal(
          "Error submitting coordinates",
          `<p>Please enter coordinates, what you have entered is an iframe. Refer to our guide at the top of this page.</p>`,
        );
        return;
      }

      if (!coordinatePattern.test(coordinatesInput)) {
        e.preventDefault();
        errorModal(
          "Error with coordinates format",
          `<p>
            Please enter coordinates in a format similar to this: <code>-3.9941853093602537, 39.73328517148325</code>.
            <br/><br/>If you are stuck, see our guide at the top of this page.
          </p>`,
        );
        return;
      }
    }
  });
