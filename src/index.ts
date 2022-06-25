import type { WMOptions } from "./types";
import { query, wrapText, waitForWebfont, getOffsetHeight } from "./util";

export default class WaterMask {
  options: WMOptions;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  // 旋转弧度
  radians: number;
  // canvas 宽度
  width: number;
  // canvas 高度
  height: number;
  base64Url: string;
  wmDom: HTMLElement;

  constructor(
    options: Partial<WMOptions> & { el: string | Element; container: string[] }
  ) {
    const defaultOpts = {
      position: "fixed",
      container: [""],
      color: "#0A1F44",
      fontType: "sans-serif",
      fontSize: 18,
      el: "",
      alpha: 0.06,
      rotate: 32,
      offsetTop: 40,
      offsetLeft: 40,
      xGap: 48,
      yGap: 48,
      zIndex: 9999,
      // 文本行间距
      lineHeight: 19,
      // 文本最大宽度
      textWidth: 332,
      repeat: true,
      isResize: true,
      appendToBody: true,
    };
    this.options = Object.assign(defaultOpts, options) as WMOptions;
    this.radians = (Math.PI / 180) * this.options.rotate;
    this.width =
      Math.cos(this.radians) * this.options.textWidth + this.options.xGap * 2;
    // 兼容旋转角度为 0 的时候， 高度默认为三倍行高
    this.height = this.options.height
      ? this.options.height
      : Math.sin(this.radians) * this.options.textWidth +
          this.options.yGap * 2 ||
        this.options.lineHeight * 3 + this.options.yGap * 2;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas?.getContext("2d") as CanvasRenderingContext2D;
    this.wmDom = document.createElement("div");
    this.base64Url = "";
    this.initStyle();

    // 1、动态加载字体并根据元素占用的大小 / font api 判断是否加载成功
    waitForWebfont(this.options.fontType)
      .then(() => {
        this.render();
        this.drawImage();
        this.options.isResize && this.autoResize();
      })
      .catch(() => {
        this.options.fontType = "sans-serif";
        this.render();
        this.drawImage();
        this.options.isResize && this.autoResize();
      });
  }

  initStyle(): void {
    this.canvas.setAttribute("width", `${this.width}`);
    this.canvas.setAttribute("height", `${this.height}`);
    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = this.options.alpha;
  }

  render(): void {
    this.ctx.font = `${this.options.fontSize}px ${this.options.fontType}`;
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = `${this.options.color}`;
    const rectCenterPoint = { x: this.width / 2, y: this.height / 2 };
    this.ctx.translate(rectCenterPoint.x, rectCenterPoint.y);
    this.ctx.rotate(2 * Math.PI - this.radians);
    this.ctx.translate(-rectCenterPoint.x, -rectCenterPoint.y);
    wrapText(
      this.ctx,
      this.options.container,
      parseFloat(`${this.width}`) / 2,
      getOffsetHeight(
        this.height,
        this.options.lineHeight,
        this.options.container.length || 0
      ),
      this.options.lineHeight
    );
    this.base64Url = this.canvas.toDataURL();
  }

  drawImage(): void {
    const el = query(this.options.el);
    const { appendToBody } = this.options;
    const { width, height, top, left } = el?.getBoundingClientRect() || {};
    // 由于绘制 canvas 的时候将边距绘制进去，需要对背景图进行一定的偏移
    const offsetTop = this.options.offsetTop - this.options.yGap;
    const offsetLeft = this.options.offsetLeft - this.options.xGap;
    const styleStr = `
      position: ${appendToBody ? "fixed" : this.options.position || "absolute"};
      left: ${appendToBody ? left : 0}px;
      top: ${appendToBody ? top : 0}px;
      width: ${width}px;
      height: ${height}px;
      z-index:${this.options.zIndex};
      pointer-events:none;
      background-repeat:repeat;
      background-position: ${offsetLeft}px  ${offsetTop}px;
      background-image:url('${this.base64Url}');`;

    const sppWatermask = document?.getElementById("@zz-watermask") || null;
    if (sppWatermask) return;
    if (appendToBody) {
      document.body.appendChild(this.wmDom);
    } else {
      el?.appendChild(this.wmDom);
    }
    this.wmDom.setAttribute("style", styleStr);
    this.wmDom.setAttribute("id", "@zz-watermask");
  }

  autoResize(): void {
    const el = query(this.options.el);
    const { appendToBody } = this.options;
    const resizeObserver = new ResizeObserver((entries: any[]) => {
      for (let entry of entries) {
        const { left, top, width, height } =
          entry?.target?.getBoundingClientRect();
        this.wmDom.style.left = `${appendToBody ? left : 0}px`;
        this.wmDom.style.top = `${appendToBody ? top : 0}px`;
        this.wmDom.style.width = `${width}px`;
        this.wmDom.style.height = `${height}px`;
      }
    });
    el && resizeObserver.observe(el);
  }
}
