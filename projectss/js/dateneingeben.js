document.addEventListener('DOMContentLoaded', (event) => {
    // Event Listener für das erste Formular
    const formPageOne = document.getElementById('formPageOne');
    if (formPageOne) {
        formPageOne.addEventListener('submit', savePageOneData);
    }

    // Event Listener für das zweite Formular
    const formPageTwo = document.getElementById('formPageTwo');
    if (formPageTwo) {
        formPageTwo.addEventListener('submit', savePageTwoData);
    }

    // Aufrufen der Ladefunktionen, um gespeicherte Daten beim Laden der Seite anzuzeigen
    loadPageOneData();
    loadPageTwoData();
});

// Funktion zum Speichern von Daten aus dem ersten Formular
function savePageOneData(event) {
    event.preventDefault(); // Verhindert das Absenden des Formulars
    const anlagenname = document.getElementById('anlagenname').value;
    const leistung = document.getElementById('leistung').value;
    const speicherleistung = document.getElementById('speicherleistung').value;

    const userData = {
        anlagenname: anlagenname,
        leistung: leistung,
        speicherleistung: speicherleistung
    };

    localStorage.setItem('userDataPageOne', JSON.stringify(userData));
    // Weiterleiten zur nächsten Seite (wenn benötigt)
    // window.location.href = 'pageTwo.html';
}

// Funktion zum Speichern von Daten aus dem zweiten Formular
function savePageTwoData(event) {
    event.preventDefault(); // Verhindert das Absenden des Formulars
    const maxLeistung = document.getElementById('maxLeistung').value;
    const wechselrichter = document.getElementById('wechselrichter').value;
    const ausrichtung = document.getElementById('ausrichtung').value;
    const neigung = document.getElementById('neigung').value;

    const userData = {
        maxLeistung: maxLeistung,
        wechselrichter: wechselrichter,
        ausrichtung: ausrichtung,
        neigung: neigung
    };

    localStorage.setItem('userDataPageTwo', JSON.stringify(userData));
    // Weiterleiten zur nächsten Seite (wenn benötigt)
    // window.location.href = 'pageThree.html';
}

// Optional: Daten aus LocalStorage laden und in die Formularfelder einfügen
function loadPageOneData() {
    const storedData = JSON.parse(localStorage.getItem('userDataPageOne'));
    if (storedData) {
        document.getElementById('anlagenname').value = storedData.anlagenname;
        document.getElementById('leistung').value = storedData.leistung;
        document.getElementById('speicherleistung').value = storedData.speicherleistung;
    }
}

function loadPageTwoData() {
    const storedData = JSON.parse(localStorage.getItem('userDataPageTwo'));
    if (storedData) {
        document.getElementById('maxLeistung').value = storedData.maxLeistung;
        document.getElementById('wechselrichter').value = storedData.wechselrichter;
        document.getElementById('ausrichtung').value = storedData.ausrichtung;
        document.getElementById('neigung').value = storedData.neigung;
    }
}
