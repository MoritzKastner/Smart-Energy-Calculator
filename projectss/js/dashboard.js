document.addEventListener('DOMContentLoaded', function () {
    // Vorerst Mockdaten da das Berechnungsmodell nicht implementiert wurde
    const mockData = {
        labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
        datasets: [{
            label: 'Stromproduktion (kWh)',
            data: [0, 0, 0, 0, 0, 0, 1, 3, 5, 8, 12, 15, 20, 18, 15, 12, 8, 5, 3, 1, 0, 0, 0, 0], // Hier müssen wir die Stromerzeugung rein bekommen
            backgroundColor: '#144C68',
            borderColor: '#144C68',
            borderWidth: 1
        }]
    };

    // Konfiguration für das Balkendiagramm
    const config = {
        type: 'bar',
        data: mockData,
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
});


