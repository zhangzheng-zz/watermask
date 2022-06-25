export function query(el: string | Element): Element | null {
  if (typeof el === 'string') {
    const selected = document.querySelector(el);
    if (!selected) {
      console.warn(`[WaterMask] Cannot find element: ${el}`);
    }
    return selected;
  }
  return el;
}

export function getOffsetHeight(height: number, lineHeight: number, length: number): number {
  const isOdd = length % 2 !== 0 && length !== 1;
  const diffHeight = Math.floor(length / 4);
  const startY = height / 2 - diffHeight * lineHeight - (isOdd ? lineHeight / 2 : 0);
  return startY;
}

export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string[],
  x: number,
  y: number,
  // maxWidth: number,
  lineHeight: number
): void {
  const context = ctx;

  for (let n = 0; n < text.length; n++) {
    const testLine = text[n];
    context.fillText(testLine, x, y);
    // eslint-disable-next-line no-param-reassign
    y += lineHeight;
  }
}

export function waitForWebfont(font: string): Promise<void> {
  return new Promise<void>((resolve, reject): void => {
    if (font === 'sans-serif') {
      resolve();
      return;
    }
    let fontFaceSet: any;
    if ('fonts' in window.document) {
      fontFaceSet = (window.document as any)?.fonts;
    }
    let count = 0;
    let node: HTMLSpanElement | null = document.createElement('span');
    node.innerHTML = 'giItT1WQy@!-/#';
    node.style.position = 'absolute';
    node.style.left = '-10000px';
    node.style.top = '-10000px';
    // 设置超大字体方便判断
    node.style.fontSize = '300px';
    node.style.fontFamily = 'sans-serif';
    node.style.fontVariant = 'normal';
    node.style.fontStyle = 'normal';
    node.style.fontWeight = 'normal';
    node.style.letterSpacing = '0';
    document.body.appendChild(node);

    // Remember width with no applied web font
    const width = node.offsetWidth;
    // 设置自定义字体
    node.style.fontFamily = font;

    let interval: number | undefined;
    function checkFont(): boolean {
      count += 1;
      // 超过 5s
      if (count >= 100) {
        reject(Error(`can not find font : ${font}`));
        console.warn(`[watermask]: can not find font : ${font}`);
        node = null;
        clearInterval(interval);
      }
      // fontFaceSet / 对比宽度
      if (fontFaceSet) {
        if (fontFaceSet?.check(`12px ${font}`)) {
          node?.parentNode?.removeChild(node);
          clearInterval(interval);
          node = null;
          resolve();
          return true;
        }
      } else if (node && node.offsetWidth !== width) {
        node?.parentNode?.removeChild(node);
        clearInterval(interval);
        // @ts-ignore
        node = null;
        resolve();
        return true;
      }
      return false;
    }

    // 50 ms 轮询判断
    if (!checkFont()) {
      interval = setInterval(checkFont, 50);
    }
  });
}
