# FSD 4th task: range slider javascript library

## Live preview

[Netlify](https://peaceful-joliot-362591.netlify.app/demo.html)

## Команды

Установка зависимостей

```
npm i
```

Запуск сервера

```
npm start
```

Сборка проекта

```
npm run build
```

Запуск линтера

```
npm run lint
```

Запуск тестов

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
mySlider.setOptions(options: Object = {}): Object;

mySlider.getOptions(): Object;
```

Настройки по умолчанию

```typescript
{
  minValue: -50, // number
  maxValue: 50, // number
  stepSize: 20, // number
  handlerCount: 1, // number
  isHorizontal: true, // boolean
  showTooltip: false, // boolean
}
```

### Узнать одно или все значения ползунков

```typescript
mySlider.getValue(index: number): number;

mySlider.getValues(): number[];
```

### Изменить значение ползунка

```typescript
mySlider.setValue(value: number, [index: number]): number;
```

### Добавить панель управления

```typescript
mySlider.addPanel(): Object;
```

### Добавить шкалу значений

```typescript
mySlider.addScale(): Object;
```

## Архитектура приложения

[UML диаграмма](https://viewer.diagrams.net/?highlight=0000ff&edit=_blank&layers=1&nav=1&title=fsd4uml.drawio#Uhttps%3A%2F%2Fraw.githubusercontent.com%2Frsilivestr%2FFSD4thTask%2Fmaster%2Ffsd4uml.drawio)

Слайдер разделён на слои модель, вид и контроллер. Модель (RSModel) содержит данные и логику, вид (RSView) управляет отображением слайдера, контроллер (RSController) обрабатывает события мыши. Слои связаны по шаблону наблюдатель (Observer): вид и контроллер (observers) подписываются на уведомления, которые модель (Subject) рассылает при изменении данных. Шкала значений (RScale) и панель управления (RSPanel) также являются наблюдателями и подписаны на изменения в модели.
