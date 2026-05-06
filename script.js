const screen = document.querySelector('#screen');
const history = document.querySelector('#history');
const keys = document.querySelector('.keys');

let expression = '';
let justCalculated = false;

const operators = ['+', '-', '*', '/', '%'];

function render(value = expression) {
  screen.textContent = value || '0';
}

function clearAll() {
  expression = '';
  history.textContent = '';
  justCalculated = false;
  render();
}

function deleteLast() {
  if (justCalculated) {
    clearAll();
    return;
  }
  expression = expression.slice(0, -1);
  render();
}

function append(value) {
  if (justCalculated && !operators.includes(value)) {
    expression = '';
    history.textContent = '';
  }
  justCalculated = false;

  const last = expression.at(-1);
  if (operators.includes(value) && (!expression || operators.includes(last))) {
    if (value === '-' && expression !== '-') expression += value;
    else if (expression && operators.includes(last)) expression = expression.slice(0, -1) + value;
  } else if (value === '.') {
    const currentNumber = expression.split(/[+\-*/%]/).pop();
    if (!currentNumber.includes('.')) expression += value;
  } else {
    expression += value;
  }

  render();
}

function calculate() {
  if (!expression || operators.includes(expression.at(-1))) return;

  try {
    const result = Function(`'use strict'; return (${expression})`)();
    if (!Number.isFinite(result)) throw new Error('Invalid calculation');

    history.textContent = expression.replaceAll('*', '×').replaceAll('/', '÷') + ' =';
    expression = String(Number.parseFloat(result.toFixed(10)));
    render(expression);
    justCalculated = true;
  } catch {
    render('Error');
    expression = '';
    justCalculated = true;
  }
}

keys.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  if (button.dataset.action === 'clear') clearAll();
  else if (button.dataset.action === 'delete') deleteLast();
  else if (button.dataset.action === 'calculate') calculate();
  else append(button.dataset.value);
});

document.addEventListener('keydown', (event) => {
  if (/^[0-9.+\-*/%]$/.test(event.key)) append(event.key);
  if (event.key === 'Enter' || event.key === '=') calculate();
  if (event.key === 'Backspace') deleteLast();
  if (event.key === 'Escape') clearAll();
});
