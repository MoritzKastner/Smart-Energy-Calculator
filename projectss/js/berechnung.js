const openWeatherApiKey = 'b3719158a95e3489bb955088d3b4f1c2';  // OpenWeatherMap API key
const openCageApiKey = '7c9dba8263394ae3a25ec91d39a03076';  // OpenCage API key

document.getElementById('pageOne').addEventListener('submit', function(event) {
    event.preventDefault();
    calculateEnergy();
});

// Hauptfunktion zur Berechnung der Energieproduktion
async function calculateEnergy() {
    const moduleArea = parseFloat(document.getElementById('moduleArea').value);
    const country = document.getElementById('country').value;
    const city = document.getElementById('city').value;
    const postcode = document.getElementById('zipecode').value;
    const efficiency = parseFloat(document.getElementById('efficiency').value) / 100;
    const inverterEfficiency = parseFloat(document.getElementById('inverterEfficiency').value) / 100;
    const irradiance = parseFloat(document.getElementById('irradiance').value);
    const performanceRatio = parseFloat(document.getElementById('pr').value);
    const temperatureCoefficient = parseFloat(document.getElementById('temperatureCoefficient').value) / 100;
    const roofTilt = parseFloat(document.getElementById('roofTilt').value);
    const orientation = parseFloat(document.getElementById('orientation').value);
    const shading = parseFloat(document.getElementById('shading').value) / 100;

    try {
        const coords = await getCoordinatesFromAddress(country, city, postcode);
        const weatherData = await fetchWeatherData(coords.lat, coords.lon);
        const temperatur = weatherData.temperature;
        const wolkenbedeckung = weatherData.cloudCover;
        const sonnenstunden = (1 - wolkenbedeckung / 100) * 24;

        const energyProduction = berechnePVProduktion(moduleArea, efficiency, irradiance, performanceRatio, inverterEfficiency, sonnenstunden, temperatur, temperatureCoefficient, roofTilt, orientation, shading);
        document.getElementById('result').innerText = `Erwartete Energieproduktion: ${energyProduction.toFixed(2)} kWh`;
    } catch (error) {
        console.error('Fehler:', error);
        document.getElementById('result').innerText = `Fehler: ${error.message}`;
    }
}

// Funktion zur Koordinatenermittlung basierend auf Land, Stadt und Postleitzahl
async function getCoordinatesFromAddress(country, city, postcode) {
    const address = `${postcode}, ${city}, ${country}`;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${openCageApiKey}`;
    console.log(`URL für Koordinaten: ${url}`); // Debugging-Information

    const response = await fetch(url);
    const data = await response.json();
    console.log(`Antwortdaten für Koordinaten: ${JSON.stringify(data)}`);

    if (!response.ok || data.results.length === 0) {
        console.error(`Fehlerstatus: ${response.status}, Nachricht: ${data.message}`);
        throw new Error('Fehler beim Abrufen der Koordinaten');
    }

    if (data.results[0].geometry) {
        return {
            lat: data.results[0].geometry.lat,
            lon: data.results[0].geometry.lng
        };
    } else {
        throw new Error('Keine gültigen Koordinaten gefunden');
    }
}

// Funktion zum Abrufen der Wetterdaten basierend auf den Koordinaten
async function fetchWeatherData(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`;
    console.log(`URL für Wetterdaten: ${url}`);

    const response = await fetch(url);
    const data = await response.json();
    console.log(`Antwortdaten für Wetter: ${JSON.stringify(data)}`);

    if (!response.ok) {
        console.error(`Fehlerstatus: ${response.status}, Nachricht: ${data.message}`);
        throw new Error('Fehler beim Abrufen der Wetterdaten');
    }

    if (data.main && data.clouds) {
        return {
            temperature: data.main.temp,
            cloudCover: data.clouds.all
        };
    } else {
        console.error('Keine Wetterdaten gefunden oder ungültige Datenstruktur');
        console.log('Komplette Antwort:', JSON.stringify(data, null, 2)); // Detaillierte Antwort anzeigen
        throw new Error('Keine Wetterdaten gefunden oder ungültige Datenstruktur');
    }
}

// Funktion zur Berechnung der PV-Produktion
function berechnePVProduktion(flaeche, wirkungsgrad, globalstrahlung, performanceRatio, inverterEfficiency, sonnenstunden, temperatur, temperaturKoeffizient, neigung, ausrichtung, verschattung) {
    // Anpassung des Wirkungsgrads basierend auf der Temperatur
    const temperaturEinfluss = (temperatur > 25) ? (1 - temperaturKoeffizient * (temperatur - 25)) : 1;

    // Berechnung des Gesamtwirkungsgrads
    const wirkungsgradGesamt = wirkungsgrad * temperaturEinfluss * inverterEfficiency;

    // Berücksichtigung von Neigung und Ausrichtung
    const tiltFactor = Math.cos(neigung * Math.PI / 180);

    // Berücksichtigung der Ausrichtung mit Effizienzabnahme
    let orientationFactor;
    switch(ausrichtung) {
        case 0:   // Norden
            orientationFactor = 0.5;  // 50% Effizienz
            break;
        case 90:  // Osten
            orientationFactor = 0.8;  // 80% Effizienz
            break;
        case 180: // Süden
            orientationFactor = 1.0;  // 100% Effizienz
            break;
        case 270: // Westen
            orientationFactor = 0.8;  // 80% Effizienz
            break;
        default:
            orientationFactor = 0.8;  // Standardwert für suboptimale Ausrichtungen
    }

    // Anpassung der Globalstrahlung
    const adjustedIrradiance = globalstrahlung * tiltFactor * orientationFactor;

    // Berücksichtigung der Verschattung
    const verschattungsFaktor = 1 - verschattung;

    // Berechnung der Stromproduktion
    const produktion = flaeche * adjustedIrradiance * performanceRatio * wirkungsgradGesamt * sonnenstunden * verschattungsFaktor;
    return produktion;
}
