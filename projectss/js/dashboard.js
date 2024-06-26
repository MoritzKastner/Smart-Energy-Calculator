document.addEventListener('DOMContentLoaded', function() {
    displayPVErtragChart();
});

function displayPVErtragChart() {
    const energyProduction = parseFloat(localStorage.getItem('energyProduction'));

    if (!energyProduction) {
        console.error('Kein gespeicherter Energieproduktionswert im lokalen Speicher gefunden');
        return;
    }

    // Parameter für die Normalverteilung
    const mean = 13; // Mittags um 13:00 Uhr
    const stdDev = 2.5; // Standardabweichung

    // Erstellung eines Arrays für die Stunden des Tages
    const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);

    // Funktion zur Berechnung der Normalverteilungswerte
    function normalDistribution(x, mean, stdDev) {
        return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
    }

    // Erstellung eines Arrays für die Energieproduktion pro Stunde basierend auf der Normalverteilung
    const data = labels.map((_, i) => normalDistribution(i, mean, stdDev));

    // Skalieren der Werte, so dass die Summe der Werte der gesamten Energieproduktion entspricht
    const sum = data.reduce((a, b) => a + b, 0);
    const scaledData = data.map(value => (value / sum) * energyProduction);

    // Chart.js Diagramm erstellen
    const ctx = document.getElementById('pvErtragChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Erzeugte Energie (kWh)',
                data: scaledData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'kWh'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Stunden des Tages'
                    }
                }
            }
        }
    });
}

