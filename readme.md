canvas 实现 watermask 前端页面水印 (Dynamic Font)
支持多行文本、动态字体加载 (Multi Text)

<img width="477" alt="demo的副本" src="https://user-images.githubusercontent.com/63552419/175759847-1615624d-9a9e-4f99-af36-3c24ea3708ce.png">


## 使用
```js
npm i @zz/watermask
```

## 示例
```js
import WM from '@zz/watermask'
new WM({
        el: '#wsDom',
        container: ['Zhao XiaoFei(张小飞) 2022-12-31 23:59:59'],
      });
```

Dynamic Font
如果是本地字体，请确保项目正确引入了 font 资源。canvas 水印将在字体加载完成后绘制。加载不到对应的字体将会使用默认字体：'sans-serif'

```js
new WM({
        el: '#wsDom',
        container: ['Zhao XiaoFei(张小飞) 2022-12-31 23:59:59'],
        fontType: 'Roboto'
      });
```

Multi Text
多行显示
```js
new WM({
        el: '#wsDom',
        container: ['Zhao XiaoFei(张小飞) 2022-12-31 23:59:59', 'CONFIDENTIAL'],
        fontType: 'Roboto',
        textWidth: '332'
      });
```

Full options
```js
new VM({
   {
      container: [''],
      color: '#0A1F44',
      fontType: 'sans-serif',
      fontSize: 18,
      el: '',
      alpha: 0.6,
      rotate: 32,
      offsetTop: 40,
      offsetLeft: 40,
      xGap: 48,
      yGap: 48,
      zIndex: 9999,
      // 文本行间距
      lineHeight: 19,
      // 文本行高
      textWidth: 332,
      repeat: true,
      isResize: true
    };
})
```

## Options

| Key       | Type    | Default                              | Description                                          |
|-----------|---------|--------------------------------------|------------------------------------------------------|
| container | string[]  | ['']  |                                                      |
| color     | string  |  '#0A1F44'                     | Text color |
| fontType  | string  | 'sans-serif'                      |                                                      |
| fontSize      | number  | 18                                   |                                              |
| el     | Element  |                                      | Render maskwater background to cover area  |                               |                                                      |
| alpha     | number  | 0.06                                 | Global canvas transparency                           |
| rotate    | number  | 32                                  | Deg                                                  |
| repeat    | boolean | true                                 | background-repeat         |
| offsetTop    | number  | 40                                   | The startY of the  maskwater background  |
| offsetLeft    | number  | 40                                   | The startX of the  maskwater background   |
| xGap      | number  | 48   |  Watermask padding-left padding-right                                |                                                      |
| yGap      | number  | 48   | Watermask padding-top padding-bottom                              |                                                      |
| zIndex  | number  | 9999  | background z-index
| lineHeight  | number  | 19                                  |
| textWidth  | number  | 332                                  |
| repeat  | boolean  | true                                  |
| isResize  | boolean  | true                          | Observe (DOM) el position and size
| appendToBody  | boolean  | true                          | append watermask dom to body position is fixed 
| position  | string  | 'fixed'                          | 


