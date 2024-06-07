async function fetchPrices() {
    try {
        const response = await fetch('https://api.awattar.at/v1/marketdata');
        const data = await response.json();
        displayPrices(data.data);
        createChart(data.data);
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
    }
}

function displayPrices(prices) {
    const pricesTable = document.getElementById('prices');
    let previousPrice = null;

    prices.forEach(price => {
        const row = document.createElement('tr');
        const startTime = new Date(price.start_timestamp).toLocaleString();
        const endTime = new Date(price.end_timestamp).toLocaleString();
        const currentPrice = price.marketprice;
        let change = '';
        let changeClass = '';

        if (previousPrice !== null) {
            const difference = currentPrice - previousPrice;
            change = `${difference >= 0 ? '+' : ''}${difference.toFixed(2)} €/MWh`;
            changeClass = difference >= 0 ? 'price-up' : 'price-down';
        }

        row.innerHTML = `
                <td>${startTime}</td>
                <td>${endTime}</td>
                <td>${currentPrice.toFixed(2)}</td>
                <td class="${changeClass}">${change}</td>
            `;
        pricesTable.appendChild(row);
        previousPrice = currentPrice;
    });
}

function createChart(prices) {
    const ctx = document.getElementById('priceChart').getContext('2d');
    const labels = prices.map(price => new Date(price.start_timestamp));
    const data = prices.map(price => price.marketprice);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Strompreis (€/MWh)',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'hour'
                    }
                },
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw.toFixed(2)} €/MWh`;
                        }
                    }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', fetchPrices);