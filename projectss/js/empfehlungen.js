document.addEventListener('DOMContentLoaded', function () {
    // Daten der PV-Anlage: Array von Objekten mit Stunden und Ertragszahlen in kWh
    const pvDataString = localStorage.getItem('pvData');
    if (!pvDataString) {
        console.error('Kein gespeicherter PV-Daten im lokalen Speicher gefunden');
        return;
    }
    const pvData = JSON.parse(pvDataString);

    // Haushaltsgeräte: Array von Objekten mit Gerätenamen und Verbrauch in kWh
    const devices = [
        { name: 'Waschmaschine', consumption: 0.6, icon: 'waschmaschine.png' },
        { name: 'Trockner', consumption: 1, icon: 'trockner.png' },
        { name: 'Geschirrspüler', consumption: 0.7, icon: 'geschirrspüler.png' },
        { name: 'Klimaanlage', consumption: 0.3, icon: 'klimaanlage.png' },
        { name: 'Klimaanlage', consumption: 0.3, icon: 'klimaanlage.png' },
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
                        bestMatch = device;
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
        // Überspringe Stunden außerhalb des Bereichs von 8:00 bis 20:00 Uhr
        if (pvData[i].hour < 8 || pvData[i].hour >= 20) {
            continue;
        }

        const bestDevice = findBestDeviceForHours(i, devices, usedDevices);
        if (bestDevice) {
            // Füge das empfohlene Gerät für 3 Stunden zum Set hinzu
            for (let j = i; j < i + 3 && j < pvData.length - 1; j++) {
                usedDevices.add(bestDevice.name);
            }
            const recommendationText = `Nutzen Sie <b>${bestDevice.name}</b> von <b>${pvData[i].hour}:00</b> bis <b>${pvData[i + 2].hour}:00</b> Uhr.`;
            const recommendationItem = document.createElement('li');
            recommendationItem.innerHTML = recommendationText;

            // Icon hinzufügen
            const icon = document.createElement('img');
            icon.src = `/projectss/img/${bestDevice.icon}`;
            icon.alt = bestDevice.name;
            icon.style.width = '30px'; // Größe des Icons
            icon.style.height = '30px'; // Größe des Icons
            icon.style.float = 'right'; // Rechtsbündig

            recommendationItem.appendChild(icon);
            recommendationsList.appendChild(recommendationItem);
        }
    }
});
