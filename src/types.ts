export type Position = 'relative' | 'absolute' | 'fixed' | 'sticky'
export interface WMOptions {
  position: Position;
  container: string[];
  color: string;
  fontType: string;
  fontSize: number;
  el: string | Element;
  alpha: number;
  rotate: number;
  offsetTop: number;
  offsetLeft: number;
  xGap: number;
  yGap: number;
  zIndex: number;
  lineHeight: number;
  textWidth: number;
  height: number;
  repeat: boolean;
  isResize: boolean;
  appendToBody: boolean;
}

export interface ResizeObserverType {
  observe(target: Element): void;
  unobserve(target: Element): void;
  disconnect(): void;
}
