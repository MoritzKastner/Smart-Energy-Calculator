document.addEventListener('DOMContentLoaded', function () {
    // Daten der PV-Anlage: Array von Objekten mit Stunden und Ertragszahlen in kWh
    const pvData = [
        { hour: 8, production: 0.4 },
        { hour: 9, production: 0.4 },
        { hour: 10, production: 0.4 },
        { hour: 11, production: 0.6 },
        { hour: 12, production: 1.2 },
        { hour: 13, production: 1.5 },
        { hour: 14, production: 1.5 },
        { hour: 15, production: 0.8 },
        { hour: 16, production: 1.5 },
        { hour: 17, production: 0.8 },
        { hour: 18, production: 0.8 },
        { hour: 19, production: 0.2 }
    ];

    // Haushaltsgeräte: Array von Objekten mit Gerätenamen und Verbrauch in kWh
    const devices = [
        { name: 'Waschmaschine', consumption: 0.6 },
        { name: 'Trockner', consumption: 1 },
        { name: 'Geschirrspüler', consumption: 0.7 },
        { name: 'Klimaanlage', consumption: 0.3 },
    ];

    // Funktion zum Finden des besten Gerätes für eine bestimmte Stunde
    function findBestDeviceForHours(startIndex, devices, usedDevices) {
        let bestMatch = null;
        let minDifference = Infinity;
        const grundverbrauch = 0.44; // Grundverbrauch, kann später aus einem Formular erhoben werden.

        for (let i = startIndex; i < startIndex + 3 && i < pvData.length - 1; i++) {
            const combinedProduction = pvData[i].production + pvData[i + 1].production;
            devices.forEach(device => {
                if (!usedDevices.has(device.name)) {
                    const adjustedProduction = combinedProduction - grundverbrauch;
                    const difference = Math.abs(adjustedProduction - device.consumption);
                    if (difference < minDifference) {
                        minDifference = difference;
                        bestMatch = device.name;
                    }
                }
            });
        }

        return bestMatch;
    }

    // Empfehlungen für jede 3-Stunden-Periode finden und in die HTML-Liste einfügen
    const recommendationsList = document.getElementById('recommendations');
    recommendationsList.innerHTML = ''; // Löscht vorhandene Empfehlungen
    const usedDevices = new Set(); // Set zum Verfolgen der bereits empfohlenen Geräte

    for (let i = 0; i < pvData.length - 1; i += 3) {
        const bestDevice = findBestDeviceForHours(i, devices, usedDevices);
        if (bestDevice) {
            // Füge das empfohlene Gerät für 3 Stunden zum Set hinzu
            for (let j = i; j < i + 3 && j < pvData.length - 1; j++) {
                usedDevices.add(bestDevice);
            }
            const recommendationText = `Nutzen Sie Ihr ${bestDevice} von ${pvData[i].hour} bis ${pvData[i + 2].hour} Uhr.`;
            const recommendationItem = document.createElement('li');
            recommendationItem.textContent = recommendationText;
            recommendationsList.appendChild(recommendationItem);
        }
    }
});
