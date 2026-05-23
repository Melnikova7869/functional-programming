"use strict";
// ============================================================
// ЧИСТЫЕ ФУНКЦИИ ДЛЯ МАТЕМАТИЧЕСКИХ ОПЕРАЦИЙ
// ============================================================
// Чистые функции для бинарных операций
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => {
    if (b === 0) {
        throw new Error('Деление на ноль невозможно');
    }
    return a / b;
};
const power = (a, b) => Math.pow(a, b);
// Чистые функции для унарных операций
const squareRoot = (a) => {
    if (a < 0) {
        throw new Error('Квадратный корень из отрицательного числа не существует');
    }
    return Math.sqrt(a);
};
// ============================================================
// ФУНКЦИЯ ВЫСШЕГО ПОРЯДКА ДЛЯ ЛОГИРОВАНИЯ
// ============================================================
const withLogging = (fn, operationName) => {
    return (...args) => {
        try {
            console.log(`[LOG] Выполнение операции: ${operationName}`);
            console.log(`[LOG] Аргументы:`, args);
            const result = fn(...args);
            console.log(`[LOG] Результат: ${result}`);
            return result;
        }
        catch (error) {
            console.error(`[ERROR] ${error}`);
            return null;
        }
    };
};
// ============================================================
// ФУНКЦИЯ ВЫСШЕГО ПОРЯДКА ДЛЯ СОЗДАНИЯ ОПЕРАЦИЙ
// ============================================================
const createBinaryOperation = (operation, name) => {
    return withLogging(operation, name);
};
// Создание операций с логированием
const loggedAdd = createBinaryOperation(add, 'сложение');
const loggedSubtract = createBinaryOperation(subtract, 'вычитание');
const loggedMultiply = createBinaryOperation(multiply, 'умножение');
const loggedDivide = createBinaryOperation(divide, 'деление');
const loggedPower = createBinaryOperation(power, 'возведение в степень');
// ============================================================
// СОСТОЯНИЕ ПРИЛОЖЕНИЯ
// ============================================================
let currentInput = '';
let previousValue = null;
let currentOperator = null;
let waitingForNewInput = false;
// ============================================================
// ЧИСТЫЕ ФУНКЦИИ ДЛЯ ОБРАБОТКИ ВВОДА
// ============================================================
const appendNumber = (input, number) => {
    if (number === '.' && input.includes('.'))
        return input;
    if (input === '0' && number !== '.')
        return number;
    return input + number;
};
const clearInput = () => '0';
const calculateResult = (val1, val2, operator) => {
    const operations = {
        '+': add,
        '-': subtract,
        '*': multiply,
        '/': divide,
        '^': power
    };
    const operation = operations[operator];
    if (!operation)
        return null;
    try {
        return operation(val1, val2);
    }
    catch {
        return null;
    }
};
// ============================================================
// ФУНКЦИИ ДЛЯ РАБОТЫ С DOM
// ============================================================
const updateDisplay = (value) => {
    const display = document.getElementById('display');
    if (display) {
        display.value = value;
    }
};
const showError = (message) => {
    const display = document.getElementById('display');
    if (display) {
        display.value = message;
        setTimeout(() => {
            display.value = currentInput;
        }, 1500);
    }
};
// ============================================================
// ОСНОВНАЯ ЛОГИКА ПРИЛОЖЕНИЯ (ИММУТАБЕЛЬНОЕ ОБНОВЛЕНИЕ)
// ============================================================
const handleNumberClick = (number) => {
    if (waitingForNewInput) {
        currentInput = number;
        waitingForNewInput = false;
    }
    else {
        currentInput = appendNumber(currentInput, number);
    }
    updateDisplay(currentInput);
};
const handleOperatorClick = (operator) => {
    const currentValue = parseFloat(currentInput);
    if (isNaN(currentValue))
        return;
    if (previousValue !== null && currentOperator !== null && !waitingForNewInput) {
        const result = calculateResult(previousValue, currentValue, currentOperator);
        if (result !== null && !isNaN(result)) {
            previousValue = result;
            currentInput = result.toString();
            updateDisplay(currentInput);
        }
        else {
            showError('Ошибка');
            return;
        }
    }
    else {
        previousValue = currentValue;
    }
    currentOperator = operator;
    waitingForNewInput = true;
};
const handleEqualsClick = () => {
    const currentValue = parseFloat(currentInput);
    if (previousValue === null || currentOperator === null || isNaN(currentValue))
        return;
    const result = calculateResult(previousValue, currentValue, currentOperator);
    if (result !== null && !isNaN(result)) {
        currentInput = result.toString();
        previousValue = null;
        currentOperator = null;
        waitingForNewInput = true;
        updateDisplay(currentInput);
        // Логирование через функцию высшего порядка
        const operations = {
            '+': add, '-': subtract, '*': multiply, '/': divide, '^': power
        };
        const operation = operations[currentOperator || '+'];
        if (operation) {
            withLogging(operation, 'вычисление')(previousValue || 0, currentValue);
        }
    }
    else {
        showError('Ошибка');
    }
};
const handleSqrtClick = () => {
    const currentValue = parseFloat(currentInput);
    if (isNaN(currentValue))
        return;
    const result = squareRoot(currentValue);
    if (!isNaN(result)) {
        currentInput = result.toString();
        previousValue = null;
        currentOperator = null;
        waitingForNewInput = true;
        updateDisplay(currentInput);
        withLogging(squareRoot, 'квадратный корень')(currentValue);
    }
    else {
        showError('Корень из отрицательного');
    }
};
const handlePowClick = () => {
    if (currentOperator !== null && !waitingForNewInput) {
        handleEqualsClick();
    }
    currentOperator = '^';
    waitingForNewInput = true;
};
const handleClearClick = () => {
    currentInput = clearInput();
    previousValue = null;
    currentOperator = null;
    waitingForNewInput = false;
    updateDisplay(currentInput);
};
// ============================================================
// ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
// ============================================================
const init = () => {
    // Обработчики для цифр
    document.querySelectorAll('.number').forEach(btn => {
        btn.addEventListener('click', () => {
            const value = btn.getAttribute('data-value');
            if (value)
                handleNumberClick(value);
        });
    });
    // Обработчики для операторов
    document.querySelectorAll('.operator').forEach(btn => {
        btn.addEventListener('click', () => {
            const op = btn.getAttribute('data-op');
            if (op === '=') {
                handleEqualsClick();
            }
            else if (op) {
                handleOperatorClick(op);
            }
        });
    });
    // Квадратный корень
    const sqrtBtn = document.getElementById('sqrt');
    if (sqrtBtn) {
        sqrtBtn.addEventListener('click', handleSqrtClick);
    }
    // Возведение в степень
    const powBtn = document.getElementById('pow');
    if (powBtn) {
        powBtn.addEventListener('click', handlePowClick);
    }
    // Очистка
    const clearBtn = document.getElementById('clear');
    if (clearBtn) {
        clearBtn.addEventListener('click', handleClearClick);
    }
    updateDisplay('0');
};
// Запуск приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', init);
