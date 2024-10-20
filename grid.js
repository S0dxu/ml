const grid = document.getElementById('grid');
const gridSize = 16;
let net;
const cellStates = new Array(gridSize * gridSize).fill(0);

for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    grid.appendChild(cell);

    cell.addEventListener('mousedown', (e) => {
        handleMouseEvent(e, i);
    });

    cell.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleTouchEvent(e, i);
    });

    cell.addEventListener('touchmove', (e) => {
        e.preventDefault();
        handleTouchEvent(e, i);
    });

    cell.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
}

let isDrawing = false;

document.addEventListener('mousedown', () => isDrawing = true);
document.addEventListener('mouseup', () => {
    isDrawing = false;
    checkPrediction();
});

document.addEventListener('touchstart', () => isDrawing = true);
document.addEventListener('touchend', () => {
    isDrawing = false;
    checkPrediction();
});

grid.addEventListener('mouseover', (e) => {
    if (isDrawing && e.target.classList.contains('cell')) {
        const index = Array.from(grid.children).indexOf(e.target);
        handleMouseEvent(e, index);
    }
});

function handleMouseEvent(e, index) {
    if (e.button === 0) {
        const cell = grid.children[index];
        cell.classList.add('active');
        cellStates[index] = 1;
    } else if (e.button === 2) {
        const cell = grid.children[index];
        cell.classList.remove('active');
        cellStates[index] = 0;
    }
}

function handleTouchEvent(e, index) {
    const touch = e.touches[0];
    const targetCell = document.elementFromPoint(touch.clientX, touch.clientY);
    if (targetCell && targetCell.classList.contains('cell')) {
        const targetIndex = Array.from(grid.children).indexOf(targetCell);
        targetCell.classList.add('active');
        cellStates[targetIndex] = 1;
    }
}

function checkPrediction() {
    const inputArray = cellStates.map(state => state);
    if (net) {
        let result = net.run(inputArray);
        let predictedClass = result.indexOf(Math.max(...result));
        const predicted = document.getElementById("predicted");
        predicted.textContent = `You drew: ${predictedClass}`;
    } else {
        console.warn("Error while loading the model.");
    }
}

window.onload = () => {
    fetch('model.json')
        .then(response => response.json())
        .then(model => {
            net = new brain.NeuralNetwork();
            net.fromJSON(model);
        })
        .catch(err => {
            console.error('Error while loading the model:', err);
        });
};

const divs = document.querySelectorAll('div'); // to remove a beautiful bug 
divs.forEach(image => {
    image.addEventListener('dragstart', (event) => {
        event.preventDefault();
    });
});