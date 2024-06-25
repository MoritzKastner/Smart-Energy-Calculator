    const weatherData = [
      { hour: 0, globalstrahlung: 0, direkteStrahlung: 0, diffuseStrahlung: 0, temperatur: 10 },
      { hour: 1, globalstrahlung: 0, direkteStrahlung: 0, diffuseStrahlung: 0, temperatur: 10 },
      { hour: 2, globalstrahlung: 0, direkteStrahlung: 0, diffuseStrahlung: 0, temperatur: 10 },
      { hour: 3, globalstrahlung: 0, direkteStrahlung: 0, diffuseStrahlung: 0, temperatur: 10 },
      { hour: 4, globalstrahlung: 0, direkteStrahlung: 0, diffuseStrahlung: 0, temperatur: 10 },
      { hour: 5, globalstrahlung: 0, direkteStrahlung: 0, diffuseStrahlung: 0, temperatur: 10 },
      { hour: 6, globalstrahlung: 0, direkteStrahlung: 0, diffuseStrahlung: 0, temperatur: 10 },
      { hour: 7, globalstrahlung: 0, direkteStrahlung: 0, diffuseStrahlung: 0, temperatur: 10 },
      { hour: 8, globalstrahlung: 0, direkteStrahlung: 0, diffuseStrahlung: 0, temperatur: 10 },
      { hour: 9, globalstrahlung: 200, direkteStrahlung: 150, diffuseStrahlung: 50, temperatur: 15 },
      { hour: 10, globalstrahlung: 400, direkteStrahlung: 300, diffuseStrahlung: 100, temperatur: 20 },
      { hour: 11, globalstrahlung: 600, direkteStrahlung: 450, diffuseStrahlung: 150, temperatur: 25 },
      { hour: 12, globalstrahlung: 800, direkteStrahlung: 600, diffuseStrahlung: 200, temperatur: 25 },
      { hour: 13, globalstrahlung: 800, direkteStrahlung: 600, diffuseStrahlung: 200, temperatur: 25 },
      { hour: 14, globalstrahlung: 600, direkteStrahlung: 450, diffuseStrahlung: 150, temperatur: 25 },
      { hour: 15, globalstrahlung: 400, direkteStrahlung: 300, diffuseStrahlung: 100, temperatur: 20 },
      { hour: 16, globalstrahlung: 200, direkteStrahlung: 150, diffuseStrahlung: 50, temperatur: 15 },
      { hour: 17, globalstrahlung: 100, direkteStrahlung: 75, diffuseStrahlung: 25, temperatur: 15 },
      { hour: 18, globalstrahlung: 50, direkteStrahlung: 35, diffuseStrahlung: 15, temperatur: 10 },
      { hour: 19, globalstrahlung: 0, direkteStrahlung: 0, diffuseStrahlung: 0, temperatur: 10 },
      { hour: 20, globalstrahlung: 0, direkteStrahlung: 0, diffuseStrahlung: 0, temperatur: 10 },
      { hour: 21, globalstrahlung: 0, direkteStrahlung: 0, diffuseStrahlung: 0, temperatur: 10 },
      { hour: 22, globalstrahlung: 0, direkteStrahlung: 0, diffuseStrahlung: 0, temperatur: 10 },
      { hour: 23, globalstrahlung: 0, direkteStrahlung: 0, diffuseStrahlung: 0, temperatur: 10 }
    ];

    document.addEventListener('DOMContentLoaded', function () {
        // Chart-Daten initialisieren
        const Data = {
            labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
            datasets: [{
                label: 'Stromproduktion (kWh)',
                data: [], // Hier kommen die berechneten Ertragswerte rein
                backgroundColor: '#144C68',
                borderColor: '#144C68',
                borderWidth: 1
            }]
        };
    
        // Konfiguration für das Balkendiagramm
        const config = {
            type: 'bar',
            data: Data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };
    
        // Rendering des Balkendiagramms
        const pvErtragChart = new Chart(
            document.getElementById('pvErtragChart'),
            config
        );
    
        // Funktion zur Berechnung des stündlichen Ertrags
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
    
        // Funktion zur Berechnung und Aktualisierung des stündlichen Ertrags
        window.calculateHourlyYield = function () {
            // Userdaten über die Anlage (zum Beispiel aus Formularfeldern, hier statische Werte)
            const nennleistung = 5; // parseFloat(document.getElementById('ratedPower').value);
            const modulflaeche = 20; // parseFloat(document.getElementById('moduleArea').value);
            const wirkungsgrad = 96; // parseFloat(document.getElementById('efficiency').value);
            const neigungswinkel = 30; // parseFloat(document.getElementById('roofTilt').value);
            const ausrichtung = 180; // parseFloat(document.getElementById('orientation').value);
    
            // Berechnung für jede Stunde
            Data.datasets[0].data = weatherData.map(data =>
                berechneErtragStunde(nennleistung, modulflaeche, wirkungsgrad, neigungswinkel, ausrichtung, data.globalstrahlung, data.direkteStrahlung, data.diffuseStrahlung, data.temperatur)
            );
    
            // Aktualisieren des Diagramms mit den berechneten Ertragswerten
            pvErtragChart.update();
        }
    
        // Initiale Berechnung aufrufen
        calculateHourlyYield();
    });