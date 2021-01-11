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
const mySlider = RSlider.create(selector: string, options: Object);
```

### Задать / узнать настройки

```typescript
mySlider.setConfig(options: SliderOptions = {}): SliderOptions;

mySlider.getConfig(): SliderOptions;
```

### Настройки по умолчанию

```typescript
{
  // Настройки модели
  minValue: -50,        // number
  maxValue: 50,         // number
  stepSize: 20,         // number
  handlerCount: 1,      // number

  // Настройки отображения
  isHorizontal: true,   // boolean
  handlerRadius: 8,     // number
  tooltip: true,       // boolean
  progress: false,      // boolean
}
```

### Узнать / изменить одно или все значения

```typescript
// узнать одно значение
mySlider.value(index: number): number;

// задать одно значение
mySlider.value(index: number, value: number): number;

// узнать значения
mySlider.values(): number[];

// задать значения
mySlider.values(values: number[]): number[];
```

### Добавить шкалу значений

```typescript
mySlider.addScale(): Scale;
```

### Добавить панель управления

```typescript
RSlider.addControlPanel(mySlider: Slider): Panel;
```

## Архитектура приложения

<!-- TODO update diagram -->

[UML диаграмма](https://viewer.diagrams.net/?highlight=0000ff&edit=_blank&layers=1&nav=1&title=fsd4uml.drawio#Uhttps%3A%2F%2Fraw.githubusercontent.com%2Frsilivestr%2FFSD4thTask%2Fmaster%2Ffsd4uml.drawio)

<!-- TODO add description -->

Слайдер разделён на слои model, view и presenter.
