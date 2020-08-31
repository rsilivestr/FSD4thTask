# FSD 4th task: range slider javascript library

## Commands

Install project dependencies

```
npm i
```

Run webpack-dev-server

```
npm start
```

Build project

```
npm run build
```

Build project with `--watch` option

```
npm run watch
```

Run tests

```
npm run build && npm test
```

## Plugin usage

### Create new slider

```javascript
const mySlider = RSlider.create(selector, options);
```

### Default options

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

### Add a control panel to `mySlider`

```javascript
const myPanel = RSlider.addPanel(mySlider);
```

### Add a scale to `mySlider`

```javascript
const myScale = RSlider.addScale(mySlider);
```
