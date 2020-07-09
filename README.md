# FSD 4th task: range slider javascript library

## CLI usage

Get files `git clone https://github.com/rsilivestr/FSD4thTask.git`

Install project dependencies: `npm i`

Run webpack-dev-server: `npm start`

Build project: `npm run build`

Build project with `--watch` option: `npm run watch`

Run tests `npm run build && npm test`

## Plugin usage

Create new slider: `const mySlider = RSlider.create(DOM selector, options object);`

Default options

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

Add control panel: `const myPanel = RSlider.addPanel(mySlider);`

Add scale: `const myScale = RSlider.addScale(mySlider);`
