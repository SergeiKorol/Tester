/**
 * Вопросы темы «Типы данных в Python» – 100 вопросов для собеседования.
 * Редактируйте window.QUIZ_DATA — логику приложения (app/js) не меняйте.
 * id вопросов уникальны (101–200), диапазон 100–201 соблюдён.
 */
window.QUIZ_DATA = {
  "questions": [    
    {
      "id": 101,
      "question": "Какие из перечисленных типов данных в Python являются неизменяемыми (immutable)?",
      "options": ["int, str, tuple", "list, dict, set", "int, list, tuple", "str, list, dict"],
      "correct": 0,
      "explanation": "Неизменяемые: int, float, bool, str, tuple, frozenset, bytes. Изменяемые: list, dict, set, bytearray."
    },
    {
      "id": 102,
      "question": "Какой тип данных предназначен для упорядоченной изменяемой коллекции?",
      "options": ["tuple", "list", "set", "dict"],
      "correct": 1,
      "explanation": "list — упорядоченная изменяемая; tuple — упорядоченная неизменяемая; set — неупорядоченная; dict — пары ключ-значение."
    },
    {
      "id": 103,
      "question": "Как создать пустой словарь?",
      "options": ["{}", "set()", "dict{}", "[]"],
      "correct": 0,
      "explanation": "{} создаёт пустой словарь, set() — пустое множество."
    },
    {
      "id": 104,
      "question": "Что выведет код?\na = [1,2,3]; b = a; b.append(4); print(a)",
      "options": ["[1,2,3]", "[1,2,3,4]", "Ошибка", "None"],
      "correct": 1,
      "explanation": "b ссылается на тот же список, изменение отражается на a."
    },
    {
      "id": 105,
      "question": "Как получить первый элемент кортежа t = (10,20,30)?",
      "options": ["t[0]", "t{0}", "t.first()", "t.get(0)"],
      "correct": 0,
      "explanation": "Доступ по индексу в квадратных скобках."
    },
    {
      "id": 106,
      "question": "Основное отличие list от tuple?",
      "options": ["list быстрее", "list изменяемый, tuple нет", "tuple только числа", "list отсортирован"],
      "correct": 1,
      "explanation": "list изменяемый, tuple неизменяемый."
    },
    {
      "id": 107,
      "question": "Как проверить наличие ключа 'name' в словаре d?",
      "options": ["d.contains('name')", "'name' in d", "d.has_key('name')", "d.key_exists('name')"],
      "correct": 1,
      "explanation": "in — стандартный оператор для проверки ключа."
    },
    {
      "id": 108,
      "question": "Для чего используется set?",
      "options": ["упорядоченные данные", "уникальные элементы и операции множеств", "пары ключ-значение", "доступ по индексу"],
      "correct": 1,
      "explanation": "set хранит уникальные элементы, поддерживает пересечение, объединение и т.д."
    },
    {
      "id": 109,
      "question": "Как преобразовать строку 'abc' в список ['a','b','c']?",
      "options": ["list('abc')", "split('abc')", "str('abc').to_list()", "['abc']"],
      "correct": 0,
      "explanation": "list() разбивает строку на символы."
    },
    {
      "id": 110,
      "question": "Что будет при попытке s[0]='H' для s='hello'?",
      "options": ["строка изменится", "TypeError", "IndexError", "ничего"],
      "correct": 1,
      "explanation": "Строки неизменяемы, попытка присвоить по индексу вызывает TypeError."
    },
    {
      "id": 111,
      "question": "Как создать копию списка lst = [1,2,3]?",
      "options": ["lst.copy()", "list(lst)", "lst[:]", "все варианты"],
      "correct": 3,
      "explanation": "Все три создают поверхностную копию."
    },
    {
      "id": 112,
      "question": "Какие типы могут быть ключами dict?",
      "options": ["только строки", "только числа", "любые неизменяемые", "любые изменяемые"],
      "correct": 2,
      "explanation": "Ключи должны быть хешируемыми (неизменяемыми)."
    },
    {
      "id": 113,
      "question": "Что такое распаковка (unpacking)?",
      "options": ["упаковка в список", "присвоение элементов переменным", "преобразование типов", "удаление элементов"],
      "correct": 1,
      "explanation": "Распаковка — присвоение элементов итерируемого объекта отдельным переменным."
    },
    {
      "id": 114,
      "question": "Как объединить list1=[1,2] и list2=[3,4] в [1,2,3,4]?",
      "options": ["list1+list2", "list1.extend(list2)", "list1.append(list2)", "оба первых варианта"],
      "correct": 3,
      "explanation": "+ создаёт новый список, extend изменяет существующий."
    },
    {
      "id": 115,
      "question": "Какой тип у значения None?",
      "options": ["NoneType", "None", "NullType", "undefined"],
      "correct": 0,
      "explanation": "None — единственный объект типа NoneType."
    },

    // === 16–30: Числа и арифметика (id 116–130) ===
    {
      "id": 116,
      "question": "Какая точность у float в Python?",
      "options": ["зависит от платформы (53 бита)", "всегда 64 бита", "неограниченная", "32 бита"],
      "correct": 0,
      "explanation": "float обычно соответствует double в C, 53 бита мантиссы (~15-17 цифр)."
    },
    {
      "id": 117,
      "question": "Как создать комплексное число 3+4j?",
      "options": ["complex(3,4)", "3+4j", "complex('3+4j')", "все варианты"],
      "correct": 3,
      "explanation": "Можно литералом, функцией complex() или из строки."
    },
    {
      "id": 118,
      "question": "Что вернёт 10 / 3 в Python 3?",
      "options": ["3", "3.333...", "3.0", "ошибка"],
      "correct": 1,
      "explanation": "/ возвращает float, точное деление."
    },
    {
      "id": 119,
      "question": "Чем отличаются // и /?",
      "options": ["// округление вниз, / точное деление", "одинаковы", "// возвращает int, / float", "// целочисленное, / с остатком"],
      "correct": 0,
      "explanation": "// — floor division, / — обычное деление с плавающей точкой."
    },
    {
      "id": 120,
      "question": "Что будет при int('12.5')?",
      "options": ["12", "ValueError", "13", "12.5"],
      "correct": 1,
      "explanation": "int() требует целочисленную строку, для '12.5' нужен float()."
    },
    {
      "id": 121,
      "question": "Как получить двоичную строку числа 42?",
      "options": ["bin(42)", "format(42,'b')", "f'{42:b}'", "все варианты"],
      "correct": 3,
      "explanation": "bin() возвращает с префиксом '0b', остальные — без."
    },
    {
      "id": 122,
      "question": "Чему равно 2 ** 3 ** 2?",
      "options": ["64", "512", "36", "ошибка"],
      "correct": 1,
      "explanation": "Оператор ** правоассоциативный, => 2 ** (3**2) = 2**9 = 512."
    },
    {
      "id": 123,
      "question": "Какой тип для целых произвольной точности?",
      "options": ["int", "long", "bigint", "decimal"],
      "correct": 0,
      "explanation": "В Python 3 int — произвольной точности."
    },
    {
      "id": 124,
      "question": "Как проверить, что число — бесконечность?",
      "options": ["math.isinf(x)", "x == float('inf')", "x is inf", "math.isinf или сравнение"],
      "correct": 3,
      "explanation": "math.isinf — надёжнее, но сравнение тоже работает."
    },
    {
      "id": 125,
      "question": "Что вернёт round(2.675, 2)? (из-за неточностей двоичного представления)",
      "options": ["2.68", "2.67", "2.675", "ошибка"],
      "correct": 1,
      "explanation": "Из-за представления float round(2.675,2) часто даёт 2.67, а не 2.68."
    },
    {
      "id": 126,
      "question": "Как получить целую часть от деления 7 на 3?",
      "options": ["7 // 3", "int(7/3)", "math.floor(7/3)", "все варианты"],
      "correct": 3,
      "explanation": "Все три способа дадут 2."
    },
    {
      "id": 127,
      "question": "Что вернёт bool(0)?",
      "options": ["False", "True", "0", "ошибка"],
      "correct": 0,
      "explanation": "Число 0, пустые коллекции, None преобразуются в False."
    },
    {
      "id": 128,
      "question": "Как преобразовать float 3.14 в int с отбрасыванием дробной части?",
      "options": ["int(3.14)", "math.floor(3.14)", "math.trunc(3.14)", "все варианты"],
      "correct": 3,
      "explanation": "int(), math.floor(), math.trunc() — все дают 3 (для положительных)."
    },
    {
      "id": 129,
      "question": "Что вернёт 5 % 2?",
      "options": ["1", "2", "0", "ошибка"],
      "correct": 0,
      "explanation": "% — остаток от деления, 5 % 2 = 1."
    },
    {
      "id": 130,
      "question": "Как получить модуль числа -5?",
      "options": ["abs(-5)", "math.abs(-5)", "|-5|", "mod(-5)"],
      "correct": 0,
      "explanation": "abs() — встроенная функция для модуля."     
    },	    
    {
      "id": 131,
      "question": "Как получить длину строки s = 'hello'?",
      "options": ["s.length()", "len(s)", "s.size", "length(s)"],
      "correct": 1,
      "explanation": "Встроенная функция len() возвращает длину строки (и любой коллекции)."
    },
    {
      "id": 132,
      "question": "Что вернёт s.upper() для s = 'Hello'?",
      "options": ["'HELLO'", "'hello'", "'Hello'", "ошибка"],
      "correct": 0,
      "explanation": "upper() возвращает копию строки в верхнем регистре."
    },
    {
      "id": 133,
      "question": "Как проверить, начинается ли строка с подстроки 'Py'?",
      "options": ["s.startswith('Py')", "s[0:2] == 'Py'", "s.find('Py') == 0", "все варианты"],
      "correct": 3,
      "explanation": "startswith() — самый читаемый, но и срез с сравнением или find тоже работают."
    },
    {
      "id": 134,
      "question": "Как объединить список строк ['a','b','c'] в строку 'a-b-c'?",
      "options": ["'-'.join(['a','b','c'])", "'+'.join(['a','b','c'])", "'.'.join(['a','b','c'])", "все варианты дадут разный результат, правильный с '-'"],
      "correct": 0,
      "explanation": "Метод join вызывается от разделителя: '-'.join(list) → 'a-b-c'."
    },
    {
      "id": 135,
      "question": "Что вернёт 'abc'.find('b')?",
      "options": ["1", "2", "0", "-1"],
      "correct": 0,
      "explanation": "find возвращает индекс первого вхождения, для 'b' это 1."
    },
    {
      "id": 136,
      "question": "Как заменить все 'a' на 'o' в строке 'banana'?",
      "options": ["'banana'.replace('a','o')", "'banana'.translate('a','o')", "'banana'.sub('a','o')", "замена не поддерживается"],
      "correct": 0,
      "explanation": "replace(old, new) возвращает новую строку с заменами."
    },
    {
      "id": 137,
      "question": "Что делает метод strip() для строки?",
      "options": ["удаляет пробелы в начале и конце", "удаляет все пробелы", "разбивает строку", "объединяет строки"],
      "correct": 0,
      "explanation": "strip() удаляет пробельные символы (и указанные) с обоих концов."
    },
    {
      "id": 138,
      "question": "Как разбить строку 'a,b,c' по запятой в список?",
      "options": ["'a,b,c'.split(',')", "'a,b,c'.split()", "'a,b,c'.partition(',')", "все варианты"],
      "correct": 0,
      "explanation": "split(separator) разбивает строку на части по разделителю."
    },
    {
      "id": 139,
      "question": "Что вернёт 'hello'[::-1]?",
      "options": ["'olleh'", "'hello'", "ошибка", "None"],
      "correct": 0,
      "explanation": "Срез с шагом -1 переворачивает строку."
    },
    {
      "id": 140,
      "question": "Как проверить, состоит ли строка только из цифр?",
      "options": ["s.isdigit()", "s.isnumeric()", "s.isdecimal()", "все три подходят"],
      "correct": 3,
      "explanation": "isdigit(), isnumeric(), isdecimal() — все проверяют на цифры, но с нюансами (unicode). Для простых строк подходят."
    },
    {
      "id": 141,
      "question": "Что вернёт 'abc'.center(5, '-')?",
      "options": ["'-abc-'", "'abc--'", "'--abc'", "'-abc-'?"],
      "correct": 0,
      "explanation": "center(ширина, заполнитель) центрирует строку, добавляя символы по краям."
    },
    {
      "id": 142,
      "question": "Как получить подстроку с 2-го по 4-й символ (индексы 1:4) из 'python'?",
      "options": ["'python'[1:4]", "'python'[1:5]", "'python'[2:4]", "'python'[1:3]"],
      "correct": 0,
      "explanation": "Срез [1:4] даёт символы с индекса 1 до 3 (не включая 4): 'yth'."
    },
    {
      "id": 143,
      "question": "Каким методом можно выровнять строку по правому краю до ширины 10?",
      "options": ["s.rjust(10)", "s.ljust(10)", "s.center(10)", "s.zfill(10)"],
      "correct": 0,
      "explanation": "rjust(ширина) добавляет пробелы слева. zfill добавляет нули."
    },
    {
      "id": 144,
      "question": "Что вернёт 'hello world'.title()?",
      "options": ["'Hello World'", "'hello world'", "'HELLO WORLD'", "'Hello world'"],
      "correct": 0,
      "explanation": "title() делает первую букву каждого слова заглавной."
    },
    {
      "id": 145,
      "question": "Как проверить, что строка содержит только буквы?",
      "options": ["s.isalpha()", "s.isalnum()", "s.isletter()", "s.ischar()"],
      "correct": 0,
      "explanation": "isalpha() возвращает True, если все символы — буквы (не цифры, не пробелы)."

      // === 46–60: Списки (list) (id 146–160) ===
    },
    {
      "id": 146,
      "question": "Как добавить элемент 'x' в конец списка lst?",
      "options": ["lst.append('x')", "lst.insert(len(lst),'x')", "lst.extend(['x'])", "все варианты"],
      "correct": 3,
      "explanation": "append добавляет один элемент, insert по индексу, extend с другим списком — все работают."
    },
    {
      "id": 147,
      "question": "Как вставить элемент 'x' на позицию 2 в списке lst?",
      "options": ["lst.insert(2, 'x')", "lst[2:2] = ['x']", "lst.append('x')", "lst.insert('x', 2)"],
      "correct": 0,
      "explanation": "insert(index, element) вставляет перед указанным индексом."
    },
    {
      "id": 148,
      "question": "Как удалить последний элемент списка и вернуть его?",
      "options": ["lst.pop()", "lst.pop(-1)", "del lst[-1]", "lst.remove(lst[-1])"],
      "correct": 0,
      "explanation": "pop() без аргумента удаляет и возвращает последний элемент."
    },
    {
      "id": 149,
      "question": "Как удалить элемент 'x' из списка по значению?",
      "options": ["lst.remove('x')", "del lst[lst.index('x')]", "lst.pop(lst.index('x'))", "все варианты"],
      "correct": 3,
      "explanation": "remove удаляет первое вхождение, del и pop по индексу — тоже работают."
    },
    {
      "id": 150,
      "question": "Что вернёт [1,2,3] + [4,5]?",
      "options": ["[1,2,3,4,5]", "[1,2,3, [4,5]]", "ошибка", "None"],
      "correct": 0,
      "explanation": "Оператор + конкатенирует списки."
    },
    {
      "id": 151,
      "question": "Как получить индекс первого вхождения элемента 5 в списке?",
      "options": ["lst.index(5)", "lst.find(5)", "lst.search(5)", "lst.index[5]"],
      "correct": 0,
      "explanation": "index(value) возвращает первый индекс."
    },
    {
      "id": 152,
      "question": "Что вернёт [1,2,3] * 2?",
      "options": ["[1,2,3,1,2,3]", "[2,4,6]", "ошибка", "None"],
      "correct": 0,
      "explanation": "Умножение списка на число повторяет его элементы."
    },
    {
      "id": 153,
      "question": "Как отсортировать список чисел по возрастанию на месте?",
      "options": ["lst.sort()", "sorted(lst)", "lst = lst.sorted()", "lst.order()"],
      "correct": 0,
      "explanation": "sort() изменяет исходный список, sorted() возвращает новый."
    },
    {
      "id": 154,
      "question": "Как получить отсортированную копию списка без изменения исходного?",
      "options": ["sorted(lst)", "lst.copy().sort()", "list(lst).sort()", "все варианты"],
      "correct": 0,
      "explanation": "sorted(lst) возвращает новый отсортированный список. Остальные тоже создают копию и сортируют её, но это чуть сложнее."
    },
    {
      "id": 155,
      "question": "Как развернуть список на месте?",
      "options": ["lst.reverse()", "lst[::-1]", "reversed(lst)", "lst = lst[::-1]"],
      "correct": 0,
      "explanation": "reverse() изменяет список. reversed() возвращает итератор, а срез создаёт копию."
    },
    {
      "id": 156,
      "question": "Как получить последние 3 элемента списка?",
      "options": ["lst[-3:]", "lst[len(lst)-3:]", "lst[3:]", "lst[:3]"],
      "correct": 0,
      "explanation": "lst[-3:] берёт последние три элемента."
    },
    {
      "id": 157,
      "question": "Как удалить элемент по индексу 2?",
      "options": ["del lst[2]", "lst.pop(2)", "lst.remove(2)", "del и pop подходят"],
      "correct": 3,
      "explanation": "del lst[2] и lst.pop(2) удаляют по индексу. remove ищет по значению."
    },
    {
      "id": 158,
      "question": "Как проверить, есть ли значение 3 в списке?",
      "options": ["3 in lst", "lst.contains(3)", "lst.find(3) != -1", "все варианты"],
      "correct": 0,
      "explanation": "in — стандартный оператор проверки наличия."
    },
    {
      "id": 159,
      "question": "Что вернёт max([1,5,3])?",
      "options": ["5", "1", "3", "ошибка"],
      "correct": 0,
      "explanation": "max() возвращает максимальный элемент."
    },
    {
      "id": 160,
      "question": "Как получить количество элементов в списке?",
      "options": ["len(lst)", "lst.count()", "lst.length", "size(lst)"],
      "correct": 0,
      "explanation": "len() — универсальная функция для получения длины."

      // === 61–70: Кортежи и распаковка (id 161–170) ===
    },
    {
      "id": 161,
      "question": "Можно ли изменить элемент кортежа?",
      "options": ["Да", "Нет", "Только если он содержит изменяемые объекты", "Только с помощью метода set"],
      "correct": 1,
      "explanation": "Кортеж неизменяем, но если внутри есть список, его можно изменить, но сам кортеж не меняется."
    },
    {
      "id": 162,
      "question": "Как создать кортеж из одного элемента со значением 5?",
      "options": ["(5,)", "(5)", "[5]", "tuple(5)"],
      "correct": 0,
      "explanation": "Для кортежа из одного элемента нужна запятая: (5,)."
    },
    {
      "id": 163,
      "question": "Что вернёт a,b = (1,2)?",
      "options": ["a=1, b=2", "a=(1,2), b=None", "ошибка", "a=1, b=1"],
      "correct": 0,
      "explanation": "Это распаковка кортежа в переменные."
    },
    {
      "id": 164,
      "question": "Как получить элементы кортежа t = (10,20,30) в обратном порядке?",
      "options": ["t[::-1]", "reversed(t)", "t.reverse()", "t[::-1] или tuple(reversed(t))"],
      "correct": 3,
      "explanation": "Кортеж неизменяем, но можно создать новый перевёрнутый через срез или reversed()."
    },
    {
      "id": 165,
      "question": "Что произойдёт при попытке t[0] = 100 для кортежа t = (1,2,3)?",
      "options": ["значение изменится", "TypeError", "IndexError", "ничего"],
      "correct": 1,
      "explanation": "Кортеж не поддерживает присваивание по индексу (TypeError)."
    },
    {
      "id": 166,
      "question": "Как объединить два кортежа (1,2) и (3,4)?",
      "options": ["(1,2) + (3,4)", "tuple(list((1,2)) + list((3,4)))", "оба варианта", "только первый"],
      "correct": 2,
      "explanation": "Конкатенация кортежей через + работает, а также можно через списки."
    },
    {
      "id": 167,
      "question": "Что такое распаковка с * (звёздочкой) в Python?",
      "options": ["позволяет собрать оставшиеся элементы в список", "умножает элементы", "используется для указателей", "ошибка"],
      "correct": 0,
      "explanation": "Например, a,*b = (1,2,3) → a=1, b=[2,3]."
    },
    {
      "id": 168,
      "question": "Как получить количество элементов кортежа?",
      "options": ["len(t)", "t.count()", "t.size", "length(t)"],
      "correct": 0,
      "explanation": "len() работает для всех коллекций."
    },
    {
      "id": 169,
      "question": "Может ли кортеж быть ключом словаря?",
      "options": ["Да, если все его элементы хешируемы", "Нет", "Только если он из двух элементов", "Да, всегда"],
      "correct": 0,
      "explanation": "Кортеж хешируем, если все его элементы хешируемы (неизменяемы)."
    },
    {
      "id": 170,
      "question": "Как преобразовать список [1,2,3] в кортеж?",
      "options": ["tuple([1,2,3])", "([1,2,3])", "list((1,2,3))", "кортеж нельзя создать из списка"],
      "correct": 0,
      "explanation": "Функция tuple() преобразует итерируемый объект в кортеж."

      // === 71–85: Словари (dict) (id 171–185) ===
    },
    {
      "id": 171,
      "question": "Как получить значение по ключу 'name' из словаря d = {'name':'Alice', 'age':25}?",
      "options": ["d['name']", "d.get('name')", "d.name", "d['name'] или d.get('name')"],
      "correct": 3,
      "explanation": "d['name'] вызовет ошибку при отсутствии ключа, d.get() вернёт None."
    },
    {
      "id": 172,
      "question": "Как добавить новую пару ключ-значение в словарь d?",
      "options": ["d['new_key'] = value", "d.add('new_key', value)", "d.insert('new_key', value)", "d.update('new_key', value)"],
      "correct": 0,
      "explanation": "Простое присваивание по новому ключу добавляет пару."
    },
    {
      "id": 173,
      "question": "Как удалить ключ 'age' из словаря d?",
      "options": ["del d['age']", "d.pop('age')", "d.remove('age')", "del или pop"],
      "correct": 3,
      "explanation": "del удаляет, pop удаляет и возвращает значение."
    },
    {
      "id": 174,
      "question": "Как получить все ключи словаря?",
      "options": ["d.keys()", "d.values()", "d.items()", "list(d)"],
      "correct": 0,
      "explanation": "keys() возвращает представление ключей. list(d) тоже даёт список ключей."
    },
    {
      "id": 175,
      "question": "Как получить все значения словаря?",
      "options": ["d.values()", "d.keys()", "d.items()", "list(d.values())"],
      "correct": 0,
      "explanation": "values() возвращает представление значений."
    },
    {
      "id": 176,
      "question": "Как проверить наличие ключа 'city' в словаре?",
      "options": ["'city' in d", "d.has_key('city')", "d.contains('city')", "d.exists('city')"],
      "correct": 0,
      "explanation": "in — стандартный способ."
    },
    {
      "id": 177,
      "question": "Что вернёт d.get('country', 'Unknown') если ключа нет?",
      "options": ["Unknown", "None", "ошибка", "пустую строку"],
      "correct": 0,
      "explanation": "get возвращает значение по умолчанию, если ключ отсутствует."
    },
    {
      "id": 178,
      "question": "Как объединить два словаря d1 и d2 в Python 3.9+?",
      "options": ["d1 | d2", "d1.update(d2)", "{**d1, **d2}", "все варианты"],
      "correct": 3,
      "explanation": "В Python 3.9+ можно использовать |, update изменяет d1, распаковка создаёт новый."
    },
    {
      "id": 179,
      "question": "Как создать словарь из двух списков: ключи = ['a','b'], значения = [1,2]?",
      "options": ["dict(zip(['a','b'], [1,2]))", "{'a':1, 'b':2}", "dict(('a',1),('b',2))", "все варианты"],
      "correct": 0,
      "explanation": "zip объединяет пары, dict создаёт словарь."
    },
    {
      "id": 180,
      "question": "Что произойдёт, если использовать изменяемый тип (например, список) в качестве ключа словаря?",
      "options": ["будет работать", "TypeError: unhashable type", "KeyError", "ничего"],
      "correct": 1,
      "explanation": "Списки не хешируемы, поэтому не могут быть ключами."
    },
    {
      "id": 181,
      "question": "Как итерироваться по парам (ключ, значение) в словаре?",
      "options": ["for k,v in d.items():", "for k in d:", "for v in d.values():", "for k,v in d:"],
      "correct": 0,
      "explanation": "items() возвращает пары (ключ, значение)."
    },
    {
      "id": 182,
      "question": "Как очистить словарь от всех элементов?",
      "options": ["d.clear()", "d = {}", "del d", "d.clear() или d = {}"],
      "correct": 3,
      "explanation": "clear() изменяет существующий словарь, d = {} создаёт новый."
    },
    {
      "id": 183,
      "question": "Как получить длину словаря (количество ключей)?",
      "options": ["len(d)", "d.count()", "d.size", "d.length"],
      "correct": 0,
      "explanation": "len() возвращает количество пар."
    },
    {
      "id": 184,
      "question": "Как создать словарь с значениями по умолчанию для отсутствующих ключей?",
      "options": ["collections.defaultdict", "d.get()", "d.setdefault()", "все варианты"],
      "correct": 0,
      "explanation": "defaultdict из модуля collections автоматически создаёт значения для отсутствующих ключей."
    },
    {
      "id": 185,
      "question": "Как преобразовать словарь в список кортежей (ключ, значение)?",
      "options": ["list(d.items())", "d.to_list()", "d.iteritems()", "все варианты"],
      "correct": 0,
      "explanation": "items() возвращает представление, list() преобразует его в список кортежей."

      // === 86–95: Множества (set) и frozenset (id 186–195) ===
    },
    {
      "id": 186,
      "question": "Как создать пустое множество?",
      "options": ["set()", "{}", "()", "[]"],
      "correct": 0,
      "explanation": "{} — пустой словарь, set() — пустое множество."
    },
    {
      "id": 187,
      "question": "Как добавить элемент в множество s?",
      "options": ["s.add(5)", "s.append(5)", "s.insert(5)", "s.update([5])"],
      "correct": 0,
      "explanation": "add() добавляет один элемент, update() добавляет несколько."
    },
    {
      "id": 188,
      "question": "Как удалить элемент из множества, если он существует, без ошибки?",
      "options": ["s.discard(5)", "s.remove(5)", "del s[5]", "s.pop(5)"],
      "correct": 0,
      "explanation": "discard() не вызывает ошибку, если элемент отсутствует; remove() — вызывает KeyError."
    },
    {
      "id": 189,
      "question": "Что вернёт {1,2,3} & {2,3,4}?",
      "options": ["{2,3}", "{1,2,3,4}", "{1,4}", "ошибка"],
      "correct": 0,
      "explanation": "& — пересечение множеств."
    },
    {
      "id": 190,
      "question": "Что вернёт {1,2,3} | {3,4,5}?",
      "options": ["{1,2,3,4,5}", "{3}", "{1,2,3,4,5} (объединение)", "ошибка"],
      "correct": 0,
      "explanation": "| — объединение множеств."
    },
    {
      "id": 191,
      "question": "Как проверить, является ли множество A подмножеством B?",
      "options": ["A.issubset(B)", "A <= B", "A.issuperset(B)", "A.issubset(B) или A <= B"],
      "correct": 3,
      "explanation": "issubset() и оператор <= проверяют подмножество."
    },
    {
      "id": 192,
      "question": "В чём отличие frozenset от set?",
      "options": ["frozenset неизменяемый", "frozenset хранит только числа", "frozenset не поддерживает операции", "отличий нет"],
      "correct": 0,
      "explanation": "frozenset — неизменяемая версия множества, может быть ключом словаря."
    },
    {
      "id": 193,
      "question": "Как удалить все элементы из множества?",
      "options": ["s.clear()", "s = set()", "del s", "s.clear() или s = set()"],
      "correct": 3,
      "explanation": "clear() очищает множество, присваивание создаёт новое."
    },
    {
      "id": 194,
      "question": "Как получить длину множества?",
      "options": ["len(s)", "s.count()", "s.size", "length(s)"],
      "correct": 0,
      "explanation": "len() возвращает количество уникальных элементов."
    },
    {
      "id": 195,
      "question": "Что произойдёт при попытке добавить список в множество?",
      "options": ["TypeError", "список добавится как элемент", "преобразуется в кортеж", "ничего"],
      "correct": 0,
      "explanation": "Список не хешируем, поэтому не может быть элементом множества."

      // === 96–100: Преобразования, сравнения, общие вопросы (id 196–200) ===
    },
    {
      "id": 196,
      "question": "Как преобразовать строку '123' в int?",
      "options": ["int('123')", "str('123')", "float('123')", "eval('123')"],
      "correct": 0,
      "explanation": "int() преобразует строку в целое число."
    },
    {
      "id": 197,
      "question": "Как преобразовать число 456 в строку?",
      "options": ["str(456)", "repr(456)", "format(456)", "все варианты"],
      "correct": 3,
      "explanation": "str() и repr() дают строковое представление, format() тоже."
    },
    {
      "id": 198,
      "question": "Что вернёт сравнение [1,2] == [1,2]?",
      "options": ["True", "False", "ошибка", "None"],
      "correct": 0,
      "explanation": "Списки сравниваются поэлементно, значения равны -> True."
    },
    {
      "id": 199,
      "question": "Что вернёт сравнение (1,2) == [1,2]?",
      "options": ["True", "False", "ошибка", "TypeError"],
      "correct": 1,
      "explanation": "Разные типы (кортеж и список) считаются неравными."
    },
    {
      "id": 200,
      "question": "Как проверить тип переменной x?",
      "options": ["type(x)", "isinstance(x, type)", "x.__class__", "все варианты"],
      "correct": 3,
      "explanation": "type() и isinstance() — основные способы проверки типа."
    }

  ]
};

QuizTopicRegistry.register("types", window.QUIZ_DATA.questions);