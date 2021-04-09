# FSD 4th task: range slider javascript library

## Live preview

[Netlify](https://peaceful-joliot-362591.netlify.app/demo.html)

## Команды

### Установка зависимостей

```
npm ci
```

### Запуск dev-сервера

```
npm start
```

### Сборка плагина

```
npm run build
```

### Запуск линтера

```
npm run lint
```

### Запуск тестов

```
npm test
```

## Использование плагина

### Создать слайдер

```typescript
const $mySlider: RSlider = $(selector: string).rslider(options: SliderOptions);
```

### Узнать родительский элемент слайдера

```typescript
const container = $mySlider.rslider('getContainer');
```

### Узнать настройки

```typescript
$mySlider.rslider('getConfig'): SliderOptions;
```

### Задать настройки

в объекте конфигурации можно передать одно, несколько или все свойства

```typescript
$mySlider.rslider('setConfig', config: SliderOptions): SliderOptions;
```

### Настройки по умолчанию

```typescript
{
  // Настройки модели
  minValue: -50,                // number
  maxValue: 50,                 // number
  stepSize: 20,                 // number
  handlerCount: 1,              // number
  // Allow minValue to be greater than maxValue (reverse slider direction)
  allowReversedValues: false    // boolean
  handlerInteraction: 'block',  // 'block' | 'pass' | 'move'

  // Настройки отображения
  isHorizontal: true,           // boolean
  handlerRadius: 8,             // number
  showProgress: false,          // boolean
  showScale: true,              // boolean
  showTooltip: true,            // boolean
}
```

### Узнать / изменить одно или все значения

```typescript
// Узнать одно значение
$mySlider.rslider('getValue', index: number): number;

// Задать одно значение
$mySlider.rslider('setValue', { index: number, value: number }): number;

// Узнать значения
$mySlider.rslider('getValues'): number[];

// Задать значения
$mySlider.rslider('setValues' values: number[]): number[];
```

### Добавить панель управления

```typescript
const myPanel = $().rspanel(mySlider: RSlider): RSPanel;
```

## Архитектура приложения

<details>
<summary>UML диаграмма</summary>

![UML диаграмма](/diagram.svg)

</details>

Слайдер разделён на слои `Model`, `View` и `Presenter`. Для уменьшения связанности `Presenter` подписан на обновления `View` и `Model` с помощью шаблона "Наблюдатель". При изменении значений и настроек `Presenter` получает оповещение и вызывает соответствующие методы `Model` и `View`. `Model` ничего не знает о `View`, который знает о её настройках и значениях ползунков, но не может напрямую обратиться к её методам. `View` помимо основного класса имеет дочерние: `Handler` - для каждого ползунка и `Scale` - опциональная шкала значений.
