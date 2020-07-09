# FSD 4th task: range slider javascript library

## CLI usage

Get files `git clone https://github.com/rsilivestr/FSD4thTask.git`

Install project dependencies: `npm i`

Run webpack-dev-server: `npm start`

Build project: `npm run build`

Build project with `--watch` option: `npm run watch`

Run tests `npm run build && npm test`

## Plugin usage

Create new slider
```typescript
const mySlider = RSlider.create(selector: String, options: Object);
```

Default options
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

Add a control panel to `mySlider`
```typescript
const myPanel = RSlider.addPanel(mySlider: Object);
```

Add a scale to `mySlider`
```typescript
const myScale = RSlider.addScale(mySlider: Object);
```
