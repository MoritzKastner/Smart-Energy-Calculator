document.addEventListener('DOMContentLoaded', (event) => {
    const draggables = document.querySelectorAll('.draggable');
    const cells = document.querySelectorAll('td');
    const addActivityButton = document.getElementById('addActivityButton');
    const newActivityInput = document.getElementById('newActivityInput');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', handleDragStart);
    });

    cells.forEach(cell => {
        cell.addEventListener('dragover', handleDragOver);
        cell.addEventListener('drop', handleDrop);
    });

    addActivityButton.addEventListener('click', addNewActivity);

    loadSchedule();
});

function handleDragStart(e) {
    const clone = e.target.cloneNode(true);
    clone.id = `${e.target.id}-${new Date().getTime()}`;
    clone.addEventListener('dragstart', handleDragStart);
    document.body.appendChild(clone);
    e.dataTransfer.setData('text/plain', clone.id);
    e.dataTransfer.setDragImage(clone, 0, 0);
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const draggableElement = document.getElementById(id);
    const dropTarget = e.target;

    if (dropTarget.tagName === 'TD') {
        if (dropTarget.children.length === 0) {
            const elementClone = draggableElement.cloneNode(true);
            elementClone.removeAttribute('draggable');
            elementClone.id = `${draggableElement.id}-${new Date().getTime()}`;
            if (!elementClone.querySelector('.remove-button')) {
                addRemoveButton(elementClone);
            }
            dropTarget.appendChild(elementClone);
            saveSchedule();
        }
    }

    if (draggableElement.parentElement === document.body) {
        document.body.removeChild(draggableElement);
    }
}

function addRemoveButton(element) {
    const removeButton = document.createElement('span');
    removeButton.innerHTML = '&times;';
    removeButton.classList.add('remove-button');
    removeButton.addEventListener('click', () => {
        element.parentElement.innerHTML = '';
        saveSchedule();
    });
    element.appendChild(removeButton);
    element.classList.add('position-relative');
    removeButton.classList.add('position-absolute', 'top-0', 'start-100', 'translate-middle', 'badge', 'rounded-pill', 'bg-danger');
    return element;
}

function saveSchedule() {
    const schedule = {};
    document.querySelectorAll('td').forEach(cell => {
        if (cell.children.length > 0) {
            schedule[cell.id] = cell.children[0].id;
        }
    });
    localStorage.setItem('schedule', JSON.stringify(schedule));
}

function loadSchedule() {
    const schedule = JSON.parse(localStorage.getItem('schedule'));
    if (schedule) {
        for (const [key, value] of Object.entries(schedule)) {
            const cell = document.getElementById(key);
            const original = document.getElementById(value.split('-')[0]);
            const element = original.cloneNode(true);
            element.id = value;
            element.removeAttribute('draggable');
            if (!element.querySelector('.remove-button')) {
                addRemoveButton(element);
            }
            cell.appendChild(element);
        }
    }
}

function addNewActivity() {
    const activityName = newActivityInput.value.trim();
    if (activityName === '') return;

    const newButton = document.createElement('button');
    newButton.classList.add('btn', 'btn-info', 'draggable');
    newButton.draggable = true;
    newButton.id = `${activityName.replace(/\s+/g, '')}-${new Date().getTime()}`;
    newButton.textContent = activityName;
    newButton.addEventListener('dragstart', handleDragStart);

    document.querySelector('.mb-3').appendChild(newButton);
    newActivityInput.value = '';
}
