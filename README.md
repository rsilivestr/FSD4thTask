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

```javascript
const mySlider = RSlider.create(selector, options);
```

### Задать настройки

```javascript
mySlider.setOptions(options);
```

Настройки по умолчанию

```javascript
{
  minValue: -50, // number
  maxValue: 50, // number
  stepSize: 20, // number
  handlerCount: 1, // number
  isHorizontal: true, // boolean
  showTooltip: false, // boolean
}
```

### Изменить значение ползунка

```javascript
mySlider.setValue(value, [index]);
```

### Добавить панель управления

```javascript
mySlider.addPanel();
```

### Добавить шкалу значений

```javascript
mySlider.addScale();
```

## Архитектура приложения

[UML диаграмма](https://viewer.diagrams.net/?highlight=0000ff&edit=_blank&layers=1&nav=1&title=fsd4uml.drawio#Uhttps%3A%2F%2Fraw.githubusercontent.com%2Frsilivestr%2FFSD4thTask%2Fmaster%2Ffsd4uml.drawio)

Слайдер разделён на слои модель, вид и контроллер. Модель (RSModel) содержит данные и логику, вид (RSView) управляет отображением слайдера, контроллер (RSController) обрабатывает события мыши. Слои связаны по шаблону наблюдатель (Observer): вид и контроллер (observers) подписываются на уведомления, которые модель (Subject) рассылает при изменении данных. Шкала значений (RScale) и панель управления (RSPanel) также являются наблюдателями и подписаны на изменения в модели.
