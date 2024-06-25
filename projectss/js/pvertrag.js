// Hier soll der stündliche Ertrag berechnet werden, interagiert mit der mockData im dashboard.js und soll den PV- Ertrag für jede Stunde hineinspeichern
// Userdaten über die Anlage
const nennleistung = parseFloat(document.getElementById('ratedPower').value);
const modulflaeche = parseFloat(document.getElementById('moduleArea').value);;
const wirkungsgrad = parseFloat(document.getElementById('efficiency').value);
const neigungswinkel= parseFloat(document.getElementById('roofTilt').value);
const ausrichtung= parseFloat(document.getElementById('orientation').value);

// Daten, die die API liefern soll 
const globalstrahlung = 800; // W/m², Global Horizontal Irradiance (GHI)
const direkteStrahlung = 600; // W/m², Direct Normal Irradiance (DNI)
const diffuseStrahlung = 200; // W/m², Diffuse Horizontal Irradiance (DHI)
const temperatur = 25; // °C, Umgebungstemperatur

function berechneErtragStunde(nennleistung, modulflaeche, wirkungsgrad, neigungswinkel, ausrichtung, globalstrahlung, direkteStrahlung, diffuseStrahlung, temperatur) {
    // Umrechnung der Ausrichtung und Neigungswinkel in Radianten
    const neigungswinkelRad = neigungswinkel * Math.PI / 180;
    const ausrichtungRad = ausrichtung * Math.PI / 180;

    // Berechnung des Einstrahlungswinkels
    const einstrahlungswinkel = Math.cos(neigungswinkelRad) * Math.cos(ausrichtungRad);

    // Berechnung der Sonnenenergie, die auf die geneigte Fläche der PV-Module fällt
    const solarEnergie = (direkteStrahlung * einstrahlungswinkel + diffuseStrahlung + globalstrahlung) * modulflaeche;

    // Temperaturkorrekturfaktor (angenommen)
    const temperaturKorrektur = 1 - 0.005 * (temperatur - 25);

    // Berechnung der theoretischen Ertragsleistung pro Stunde
    const theoretischeLeistung = (nennleistung * wirkungsgrad / 100) * solarEnergie * temperaturKorrektur;

    // Rückgabe der berechneten Leistung in kWh
    return parseFloat(theoretischeLeistung.toFixed(2));
  }

// Funktion zur Berechnung und Speicherung des stündlichen Ertrags in mockData
function calculateHourlyYield() {
    // Benutzerwerte abrufen
    const nennleistung = parseFloat(document.getElementById('ratedPower').value);
    const modulflaeche = parseFloat(document.getElementById('moduleArea').value);
    const wirkungsgrad = parseFloat(document.getElementById('efficiency').value);
    const neigungswinkel = parseFloat(document.getElementById('roofTilt').value);
    const ausrichtung = parseFloat(document.getElementById('orientation').value);

    // Berechnung für jede Stunde
    weatherData.forEach(data => {
      const ertrag = berechneErtragStunde(nennleistung, modulflaeche, wirkungsgrad, neigungswinkel, ausrichtung, data.globalstrahlung, data.direkteStrahlung, data.diffuseStrahlung, data.temperatur);
      mockData.push({ hour: data.hour, ertrag: ertrag });
    });
}//calculateHourlyYield
