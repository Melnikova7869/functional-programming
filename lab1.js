// 1. Четные числа
const getEvenNumbers = (arr) => arr.filter(n => n % 2 === 0);

// 2. Квадраты чисел
const getSquares = (arr) => arr.map(n => n ** 2);

// 3. Объекты с определенным свойством
const filterByProperty = (arr, prop) => arr.filter(obj => obj.hasOwnProperty(prop));

// 4. Сумма чисел
const getSum = (arr) => arr.reduce((sum, n) => sum + n, 0);

// 5. Функция высшего порядка (аналог map)
const mapArray = (fn, arr) => arr.map(fn);

// 6. Сумма квадратов четных чисел
const sumSquaresOfEvens = (arr) => getSum(getSquares(getEvenNumbers(arr)));

// 7. Среднее чисел больше заданного значения из массива объектов
const averageGreaterThan = (arr, prop, threshold) => {
    const valid = arr
        .filter(obj => obj.hasOwnProperty(prop) && obj[prop] > threshold)
        .map(obj => obj[prop]);
    
    return valid.length ? getSum(valid) / valid.length : null;
};

// Данные для тестов
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const objects = [
    { id: 1, value: 10 },
    { id: 2, value: 25 },
    { id: 3, name: 'no value' }
];

// Вывод результатов
console.log('1. Четные числа:', getEvenNumbers(numbers));
console.log('2. Квадраты:', getSquares(numbers));
console.log('3. Объекты со свойством value:', filterByProperty(objects, 'value'));
console.log('4. Сумма чисел:', getSum(numbers));
console.log('5. Функция высшего порядка (x2):', mapArray(x => x * 2, numbers.slice(0, 5)));
console.log('6. Сумма квадратов четных:', sumSquaresOfEvens(numbers));
console.log('7. Среднее > 20:', averageGreaterThan(objects, 'value', 20));