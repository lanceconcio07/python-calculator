let currentInput = '';
let previousInput = '';
let operation = null;
let shouldResetScreen = false;

document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display');
    
    // Digit handlers
    document.querySelectorAll('.digit').forEach(button => {
        button.addEventListener('click', () => {
            if (shouldResetScreen) {
                currentInput = '';
                shouldResetScreen = false;
            }
            currentInput += button.textContent;
            updateDisplay();
        });
    });

    // Operator handlers
    document.querySelectorAll('.operator').forEach(button => {
        button.addEventListener('click', () => {
            if (currentInput !== '') {
                if (previousInput !== '') {
                    calculate();
                }
                operation = button.textContent;
                previousInput = currentInput;
                currentInput = '';
                updateDisplay();
            }
        });
    });

    // Equals handler
    document.querySelector('.equals').addEventListener('click', () => {
        if (currentInput !== '' && previousInput !== '' && operation) {
            calculate();
            operation = null;
            previousInput = '';
            updateDisplay();
        }
    });

    // Clear handler
    document.querySelector('.clear').addEventListener('click', () => {
        display.textContent = '';
        currentInput = '';
        previousInput = '';
        operation = null;
    });

    // Decimal handler
    document.querySelector('.decimal').addEventListener('click', () => {
        if (shouldResetScreen) {
            display.textContent = '0';
            shouldResetScreen = false;
        }
        if (!display.textContent.includes('.')) {
            if (display.textContent === '') {
                display.textContent = '0';
            }
            display.textContent += '.';
            currentInput = display.textContent;
        }
    });

    // Power function (x^y)
    document.querySelector('.power').addEventListener('click', () => {
        if (currentInput !== '' && previousInput !== '') {
            const base = parseFloat(previousInput);
            const exponent = parseFloat(currentInput);
            const result = Math.pow(base, exponent);
            display.textContent = result;
            currentInput = result.toString();
            previousInput = '';
            operation = null;
            shouldResetScreen = true;
        } else if (currentInput !== '') {
            previousInput = currentInput;
            operation = 'power';
            shouldResetScreen = true;
        }
    });

    // Factorial function (n!)
    document.querySelector('.factorial').addEventListener('click', () => {
        if (currentInput !== '') {
            const num = parseInt(currentInput);
            if (num >= 0) {
                let result = 1;
                for (let i = 2; i <= num; i++) {
                    result *= i;
                }
                display.textContent = result;
                currentInput = result.toString();
                previousInput = '';
                shouldResetScreen = true;
            }
        }
    });

    // Toggle function (T)
    document.querySelector('.toggle').addEventListener('click', () => {
        if (currentInput !== '') {
            const num = parseFloat(currentInput);
            const result = -num;
            display.textContent = result;
            currentInput = result.toString();
        }
    });

    function updateDisplay() {
        let displayText = '';
        if (previousInput) {
            displayText += previousInput + ' ' + operation + ' ';
        }
        displayText += currentInput;
        display.textContent = displayText;
    }

    function calculate() {
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        let result;

        switch (operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    display.textContent = 'Error';
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        currentInput = result.toString();
        previousInput = '';
        shouldResetScreen = true;

        // Send calculation to server
        fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                operation: operation,
                x: prev,
                y: current,
                result: result
            })
        });
    }
});

function generateSequence() {
    const start = parseInt(document.getElementById('x').value);
    const end = parseInt(document.getElementById('y').value);
    
    fetch('/generate-sequence', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ start, end })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            showError(data.error);
        } else {
            updateResult(data.sequence.join(', '));
            addToHistory(`Generated sequence from ${start} to ${end}`);
        }
    })
    .catch(error => showError(error));
}

function clearHistory() {
    fetch('/clear-history', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            document.getElementById('historyList').innerHTML = '';
            showMessage('History cleared');
        })
        .catch(error => showError(error));
}

function updateResult(result, counter) {
    document.getElementById('result').textContent = `Result: ${result}`;
    if (counter !== undefined) {
        document.getElementById('counter').textContent = `Operations: ${counter}`;
    }
}

function addToHistory(text) {
    const list = document.getElementById('historyList');
    const item = document.createElement('li');
    item.textContent = text;
    list.insertBefore(item, list.firstChild);
}

function showError(message) {
    document.getElementById('result').textContent = `Error: ${message}`;
}

function showMessage(message) {
    document.getElementById('result').textContent = message;
}

function getOperationSymbol(operation) {
    const symbols = {
        'add': '+',
        'subtract': '-',
        'multiply': '×',
        'divide': '÷'
    };
    return symbols[operation] || operation;
}