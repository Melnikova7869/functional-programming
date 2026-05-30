// ============================================================
// ЛАБОРАТОРНАЯ РАБОТА №6
// Тема: Консольный калькулятор на F#
// ============================================================

open System

// ============================================================
// 1. ЧИСТЫЕ ФУНКЦИИ ДЛЯ МАТЕМАТИЧЕСКИХ ОПЕРАЦИЙ
// ============================================================

/// Сложение двух чисел
let add (a: float) (b: float) : float = a + b

/// Вычитание двух чисел
let subtract (a: float) (b: float) : float = a - b

/// Умножение двух чисел
let multiply (a: float) (b: float) : float = a * b

/// Деление двух чисел
let divide (a: float) (b: float) : float =
    if b = 0.0 then
        failwith "Ошибка: деление на ноль невозможно"
    else
        a / b

/// Возведение в степень
let power (a: float) (b: float) : float = Math.Pow(a, b)

/// Квадратный корень
let squareRoot (a: float) : float =
    if a < 0.0 then
        failwith "Ошибка: квадратный корень из отрицательного числа"
    else
        Math.Sqrt(a)

/// Синус угла (в градусах)
let sine (degrees: float) : float = Math.Sin(degrees * Math.PI / 180.0)

/// Косинус угла (в градусах)
let cosine (degrees: float) : float = Math.Cos(degrees * Math.PI / 180.0)

/// Тангенс угла (в градусах)
let tangent (degrees: float) : float =
    let rad = degrees * Math.PI / 180.0
    let cos = Math.Cos(rad)
    if abs(cos) < 0.0001 then
        failwith "Ошибка: тангенс не определён для данного угла"
    else
        Math.Tan(rad)

// ============================================================
// 2. ФУНКЦИЯ ВЫСШЕГО ПОРЯДКА ДЛЯ ЛОГИРОВАНИЯ
// ============================================================

/// Обёртка для логирования выполнения операции
let withLogging (operationName: string) (fn: float -> float -> float) (a: float) (b: float) : float =
    printfn "[ЛОГ] Выполнение операции: %s" operationName
    printfn "[ЛОГ] Аргументы: %.4f, %.4f" a b
    let result = fn a b
    printfn "[ЛОГ] Результат: %.4f" result
    printfn "---"
    result

/// Обёртка для логирования унарных операций
let withLoggingUnary (operationName: string) (fn: float -> float) (a: float) : float =
    printfn "[ЛОГ] Выполнение операции: %s" operationName
    printfn "[ЛОГ] Аргумент: %.4f" a
    let result = fn a
    printfn "[ЛОГ] Результат: %.4f" result
    printfn "---"
    result

// ============================================================
// 3. ФУНКЦИИ ВЫСШЕГО ПОРЯДКА ДЛЯ СОЗДАНИЯ ОПЕРАЦИЙ
// ============================================================

/// Создаёт бинарную операцию с логированием
let createBinaryOperation (name: string) (operation: float -> float -> float) : (float -> float -> float) =
    fun a b -> withLogging name operation a b

/// Создаёт унарную операцию с логированием
let createUnaryOperation (name: string) (operation: float -> float) : (float -> float) =
    fun a -> withLoggingUnary name operation a

// ============================================================
// 4. ОБРАБОТКА ПОЛЬЗОВАТЕЛЬСКОГО ВВОДА
// ============================================================

/// Чтение числа от пользователя
let readNumber (prompt: string) : float =
    let rec read () =
        printf "%s" prompt
        let input = Console.ReadLine()
        match Double.TryParse(input) with
        | (true, value) -> value
        | (false, _) ->
            printfn "Ошибка: введите корректное число"
            read ()
    read ()

/// Чтение угла для тригонометрических функций
let readAngle (prompt: string) : float =
    let rec read () =
        printf "%s" prompt
        let input = Console.ReadLine()
        match Double.TryParse(input) with
        | (true, value) -> value
        | (false, _) ->
            printfn "Ошибка: введите корректное число"
            read ()
    read ()

// ============================================================
// 5. МЕНЮ И ОСНОВНАЯ ЛОГИКА ПРИЛОЖЕНИЯ
// ============================================================

/// Вывод главного меню
let showMenu () =
    printfn "\n========================================"
    printfn "           КАЛЬКУЛЯТОР"
    printfn "========================================"
    printfn "1. Сложение (+)"
    printfn "2. Вычитание (-)"
    printfn "3. Умножение (*)"
    printfn "4. Деление (/)"
    printfn "5. Возведение в степень (^)"
    printfn "6. Квадратный корень (√)"
    printfn "7. Синус (sin)"
    printfn "8. Косинус (cos)"
    printfn "9. Тангенс (tan)"
    printfn "0. Выход"
    printfn "========================================"
    printf "Выберите операцию: "

/// Обработка выбора пользователя
let processChoice (choice: string) : bool =
    match choice with
    | "1" ->
        let a = readNumber "Введите первое число: "
        let b = readNumber "Введите второе число: "
        let result = createBinaryOperation "Сложение" add a b
        printfn "Результат: %.4f\n" result
        true
    | "2" ->
        let a = readNumber "Введите первое число: "
        let b = readNumber "Введите второе число: "
        let result = createBinaryOperation "Вычитание" subtract a b
        printfn "Результат: %.4f\n" result
        true
    | "3" ->
        let a = readNumber "Введите первое число: "
        let b = readNumber "Введите второе число: "
        let result = createBinaryOperation "Умножение" multiply a b
        printfn "Результат: %.4f\n" result
        true
    | "4" ->
        let a = readNumber "Введите первое число: "
        let b = readNumber "Введите второе число: "
        try
            let result = createBinaryOperation "Деление" divide a b
            printfn "Результат: %.4f\n" result
        with
        | ex -> printfn "%s\n" ex.Message
        true
    | "5" ->
        let a = readNumber "Введите основание: "
        let b = readNumber "Введите степень: "
        let result = createBinaryOperation "Возведение в степень" power a b
        printfn "Результат: %.4f\n" result
        true
    | "6" ->
        let a = readNumber "Введите число: "
        try
            let result = createUnaryOperation "Квадратный корень" squareRoot a
            printfn "Результат: %.4f\n" result
        with
        | ex -> printfn "%s\n" ex.Message
        true
    | "7" ->
        let angle = readAngle "Введите угол (в градусах): "
        let result = createUnaryOperation "Синус" sine angle
        printfn "sin(%.2f°) = %.4f\n" angle result
        true
    | "8" ->
        let angle = readAngle "Введите угол (в градусах): "
        let result = createUnaryOperation "Косинус" cosine angle
        printfn "cos(%.2f°) = %.4f\n" angle result
        true
    | "9" ->
        let angle = readAngle "Введите угол (в градусах): "
        try
            let result = createUnaryOperation "Тангенс" tangent angle
            printfn "tan(%.2f°) = %.4f\n" angle result
        with
        | ex -> printfn "%s\n" ex.Message
        true
    | "0" ->
        printfn "До свидания!"
        false
    | _ ->
        printfn "Неверный выбор. Попробуйте снова.\n"
        true

// ============================================================
// 6. ГЛАВНАЯ ФУНКЦИЯ (РЕКУРСИВНЫЙ ЦИКЛ)
// ============================================================

/// Основной цикл приложения
let rec mainLoop () : unit =
    showMenu ()
    let choice = Console.ReadLine()
    if processChoice choice then
        mainLoop ()

// ============================================================
// 7. ТОЧКА ВХОДА В ПРОГРАММУ
// ============================================================

[<EntryPoint>]
let main argv =
    printfn "\n========================================"
    printfn "  Добро пожаловать в калькулятор!"
    printfn "  Функциональное программирование на F#"
    printfn "========================================"
    mainLoop ()
    0