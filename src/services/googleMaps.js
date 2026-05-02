/**
 * @fileoverview Google Maps Service Integration.
 * Encapsulates all map-related logic and graceful fallbacks.
 */

let mapInstance;
let markersArray = [];

/**
 * Initializes the Google Maps integration module.
 * Sets up listeners for the API load event and the "Find Stations" button.
 */
export function initGoogleMapsIntegration() {
  const findBtn = document.getElementById('find-stations-btn');
  const statusText = document.getElementById('map-status');

  if (!findBtn || !statusText) return;

  // Listen for the async script load triggered from index.html
  window.addEventListener('google-maps-loaded', () => {
    console.log("Google Maps API loaded successfully.");
    statusText.textContent = "Map API ready.";
  });

  findBtn.addEventListener('click', () => handleFindStations(findBtn, statusText));
}

/**
 * Handles the "Find Stations Near Me" button click event.
 * @param {HTMLElement} btn - The trigger button.
 * @param {HTMLElement} statusText - The status text container.
 */
function handleFindStations(btn, statusText) {
  btn.disabled = true;
  statusText.textContent = "Locating nearby simulated polling stations...";
  
  // Simulate network/geolocation delay
  setTimeout(() => {
    renderMap();
    statusText.textContent = "Showing nearby polling stations (Sample Data).";
    btn.textContent = "Refresh Map";
    btn.disabled = false;
  }, 800);
}

/**
 * Renders the map UI. Provides a graceful fallback if the Google Maps API 
 * is missing, misconfigured, or lacks a valid API key.
 */
function renderMap() {
  const mapContainer = document.getElementById('map-container');
  if (!mapContainer) return;
  
  if (typeof google === 'undefined' || !google.maps) {
    renderMapFallback(mapContainer);
    return;
  }

  // Clear any existing placeholder content
  mapContainer.innerHTML = '';

  // Centered on New Delhi for simulation purposes
  const centerLocation = { lat: 28.6139, lng: 77.2090 };

  mapInstance = new google.maps.Map(mapContainer, {
    center: centerLocation,
    zoom: 14,
    mapTypeControl: false,
    streetViewControl: false,
  });

  renderMockMarkers();
}

/**
 * Renders a fallback UI when the Google Maps API fails to load.
 * @param {HTMLElement} container - The map container element.
 */
function renderMapFallback(container) {
  container.innerHTML = `
    <div class="map-placeholder">
      <p>Google Maps API failed to load or requires a valid API Key.</p>
      <p>In a production environment, this would display an interactive map with pins for polling stations.</p>
      <div style="margin-top: 1rem; padding: 1rem; background: #fff; border: 1px solid #ccc; border-radius: 4px;">
        <strong>Simulated Nearby Stations:</strong>
        <ul style="margin-top: 0.5rem; padding-left: 1.5rem; color: #333;">
          <li>KV School Polling Booth (0.5 km)</li>
          <li>Community Hall Booth 42 (1.2 km)</li>
        </ul>
      </div>
    </div>
  `;
}

/**
 * Adds mock polling station markers to the initialized map instance.
 */
function renderMockMarkers() {
  const sampleStations = [
    { lat: 28.6150, lng: 77.2100, title: "Polling Booth A - KV School" },
    { lat: 28.6110, lng: 77.2050, title: "Polling Booth B - Community Center" },
    { lat: 28.6200, lng: 77.2150, title: "Polling Booth C - Municipal Office" }
  ];

  sampleStations.forEach(station => {
    const marker = new google.maps.Marker({
      position: { lat: station.lat, lng: station.lng },
      map: mapInstance,
      title: station.title,
      animation: google.maps.Animation.DROP
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<strong>${station.title}</strong><br>Simulated Polling Station`
    });

    marker.addListener("click", () => {
      infoWindow.open(mapInstance, marker);
    });

    markersArray.push(marker);
  });
}
