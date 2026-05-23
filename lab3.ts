// ============================================================
// 1. Функция для получения чисел, кратных заданному числу
// ============================================================

const getMultiples = (numbers: number[], divisor: number): number[] => {
    if (divisor === 0) {
        return [];
    }
    return numbers.filter(num => num % divisor === 0);
};

// ============================================================
// 2. Функция для объединения строк с разделителем
// ============================================================

const joinStrings = (strings: string[], separator: string): string => {
    return strings.join(separator);
};

// ============================================================
// 3. Функция для сортировки объектов по свойству
// ============================================================

const sortByProperty = <T extends object, K extends keyof T>(
    objects: T[],
    property: K
): T[] => {
    return [...objects].sort((a, b) => {
        const valueA = a[property];
        const valueB = b[property];
        
        if (valueA < valueB) return -1;
        if (valueA > valueB) return 1;
        return 0;
    });
};

// ============================================================
// 4. Функция высшего порядка с логированием
// ============================================================

const withLogging = <T extends (...args: any[]) => any>(
    fn: T,
    functionName: string
): ((...args: Parameters<T>) => ReturnType<T>) => {
    return (...args: Parameters<T>): ReturnType<T> => {
        console.log(`[LOG] Вызов функции: ${functionName}`);
        console.log(`[LOG] Аргументы:`, args);
        
        const result = fn(...args);
        
        console.log(`[LOG] Результат:`, result);
        console.log(`[LOG] Завершение функции: ${functionName}`);
        console.log(`---`);
        
        return result;
    };
};

// ============================================================
// Тестирование функций
// ============================================================

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18, 20];

const multiplesOf3 = getMultiples(numbers, 3);
console.log('Числа, кратные 3:', multiplesOf3);

const words = ['Привет', 'мир', 'TypeScript'];
const sentence = joinStrings(words, ' ');
console.log('Объединённая строка:', sentence);

const users = [
    { id: 3, name: 'Анна', age: 25 },
    { id: 1, name: 'Иван', age: 30 },
    { id: 2, name: 'Борис', age: 22 }
];

const sortedById = sortByProperty(users, 'id');
console.log('Сортировка по id:', sortedById);

const addNumbers = (a: number, b: number): number => a + b;
const loggedAdd = withLogging(addNumbers, 'сложение');
const sum = loggedAdd(5, 3);
console.log('Результат сложения:', sum);