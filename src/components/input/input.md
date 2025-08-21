# Документация компонента Input

## Обзор
Компонент `Input` реализует поле ввода с поддержкой различных типов (text, search, number), кнопками действий, валидацией и адаптивной стилизацией через CSS-переменные. Включает JavaScript-логику для работы с числовыми значениями, очисткой полей и реакций на изменение размеров.

## Использование

### Базовый текстовый ввод
```pug
+input({ type: 'text', placeholder: 'Имя' })
```

**Результирующий HTML:**

```html
<label class="ns-input">
    <div class="ns-input__field">
        <input type="text" placeholder=" " />
    </div>
</label>
```

### Поиск с кнопками
```pug
+input({ 
    type: 'search', 
    placeholder: 'Поиск...', 
    value: 'test',
    error: 'Ошибка ввода'
})
```

**Результирующий HTML:**

```html
<label class="ns-input">
    <div class="ns-input__field">
        <svg class="ns-input__icon"></svg>
        <input type="search" placeholder="Поиск..." value="test" />
        <div class="ns-input__actions">
            <button class="ns-input__actions--clear"></button>
            <button class="ns-input__actions--submit">Искать</button>
        </div>
    </div>
    <div class="ns-input__error">Ошибка ввода</div>
</label>
```


### Числовой ввод

```pug
+input({ 
    type: 'number', 
    min: 0, 
    max: 100,
    value: 50
})
```

**Результирующий HTML:**

```html
<label class="ns-input">
    <div class="ns-input__field ns-input__number">
        <button class="ns-input__number-button--dec"></button>
        <input type="number" min="0" max="100" value="50" />
        <button class="ns-input__number-button--inc"></button>
    </div>
</label>
```

## Параметры
| Параметр | Тип | Описание |
|----------|-----|----------|
| `type` | `string` | Тип поля (`text`/`search`/`number`). Поддерживает только перечисленные значения |
| `isFullWidth` | `boolean` | Занимает всю ширину контейнера |
| `className` | `string` | Дополнительные CSS-классы |
| `placeholder` | `string` | Плейсхолдер (заменяется на пробел для стилизации) |
| `value` | `string`/`number` | Значение поля |
| `min` | `number` | Минимальное значение (только для `number`) |
| `max` | `number` | Максимальное значение (только для `number`) |
| `readOnly` | `boolean` | Режим только для чтения |
| `error` | `string` | Сообщение об ошибке |


## CSS-переменные

### Основные стили
| Переменная | Значение по умолчанию | Описание |
|------------|-----------------------|----------|
| `--ns-input-height` | `44px` | Высота поля |
| `--ns-input-border-radius` | `12px` | Радиус скругления углов |
| `--ns-input-padding-left` | `12px` | Левый отступ |
| `--ns-input-padding-right` | `4px` | Правый отступ |
| `--ns-input-font-size` | `14px` | Размер шрифта |
| `--ns-input-color` | `#072626` | Цвет текста |
| `--ns-input-background-color` | `rgba(#072626, .05)` | Фон поля |
| `--ns-input-outline-color` | `rgba(#072626, .9)` | Цвет контура фокуса |

### Для числовых полей
| Переменная | Значение по умолчанию | Описание |
|------------|-----------------------|----------|
| `--ns-input-number-padding-left` | `12px` | Левый отступ |
| `--ns-input-number-padding-right` | `12px` | Правый отступ |

### Для действий
| Переменная | Значение по умолчанию | Описание |
|------------|-----------------------|----------|
| `--ns-input-actions-gap` | `8px` | Пространство между кнопками |
| `--ns-input-actions-offset-right` | `4px` | Отступ от правого края |

### Состояния
| Класс состояния | Применяется к |
|-----------------|---------------|
| `.ns-input--focus` | При фокусе поля |
| `.ns-input--full-width` | Занимает всю ширину |
| `.ns-input__actions` | Контейнер действий (кнопки) |
| `.ns-input__error` | Сообщение об ошибке |

## JavaScript-функциональность

### Автоматическое управление
- `ResizeObserver`: автоматически вычисляет ширину кнопок действий и обновляет `--ns-input-actions-button-size`.
- `MutationObserver`: отслеживает динамически добавленные элементы `.ns-input`.
- Обработка кликов:
    - Кнопка очистки (`ns-input__actions--clear`) сбрасывает значение поля.
    - Кнопки **+/-** для числовых полей изменяют значение с учетом `step`, `min`, `max`.

### Доступность
- Поддерживает стандартные атрибуты доступности (aria-label, tabindex).
- Кнопки действий фокусируются клавиатурой.
- Поле числа корректно работает с клавиатурными навигаторами.

## Примечания
- Для числовых полей необходимо указывать `value` (`min` и `max` опционально) для корректной работы кнопок **+/-**.
- Анимация кнопок действий активируется при заполнении поля (`:not(:placeholder-shown)`).
- Иконки и кнопки должны быть реализованы отдельно (через `+icon` и `+button` миксины).
- При использовании кастомных стилей учитывайте переопределение `--ns-input-*` переменных.