document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#pageOne1, #pageThree3, #pageFour4').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            navigateForm(true, this.id);
        });
    });

    document.querySelectorAll('#backPageOne, #backPageThree').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            navigateForm(false, this.id);
        });
    });

    function navigateForm(forward, id) {
        const pages = ['pageOne', 'pageThree', 'pageFour'];
        let currentPageIndex = pages.findIndex(page => document.getElementById(page).style.display !== 'none');

        if (forward) {
            currentPageIndex += 1;
        } else {
            currentPageIndex -= 1;
        }

        if (currentPageIndex < 0) currentPageIndex = 0;
        if (currentPageIndex >= pages.length) currentPageIndex = pages.length - 1;

        pages.forEach((page, index) => {
            document.getElementById(page).style.display = (index === currentPageIndex) ? 'block' : 'none';
        });
    }

    // Initial setup: Show only the first page
    document.getElementById('pageOne').style.display = 'block';
    document.getElementById('pageThree').style.display = 'none';
    document.getElementById('pageFour').style.display = 'none';
});

//Verlinkung zur Dashboard Page nach Abschließen des Anmeldevorgangs
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("pageFour4").addEventListener("click", function() {
        window.location.href = "/projectss/html/Dashboard.html"; 
    });
});
