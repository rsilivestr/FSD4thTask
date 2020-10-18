# FSD 4th task: range slider javascript library

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

Запуск тестов

```
npm test
```

## Использование плагина

### Создать слайдер

```javascript
const mySlider = $().RSlider.create(selector, options);
```

### Настройки по умолчанию

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

### Добавить панель управления

```javascript
const myPanel = $().RSlider.addPanel(mySlider);
```

### Добавить шкалу значений

```javascript
const myScale = $().RSlider.addScale(mySlider);
```

## Архитектура приложения

Слайдер разделён на слои модель, вид и контроллер. Модель (RSModel) содержит данные и логику, вид (RSView) управляет отображением слайдера, контроллер (RSController) обрабатывает события мыши. Слои связаны по шаблону наблюдатель (Observer): вид и контроллер (observers) подписываются на уведомления, которые модель (Subject) рассылает при изменении данных. Шкала значений (RScale) и панель управления (RSPanel) также являются наблюдателями и подписаны на изменения в модели.

нужно написать, как вы отвязываете ваши слои приложений от внешних зависимостей и осуществляете передачу данных по слоям
