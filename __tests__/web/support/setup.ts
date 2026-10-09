// jsdom не знает части API, на которые опирается Radix: заглушки, чтобы окна и списки открывались

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as { ResizeObserver?: unknown }).ResizeObserver ??=
  ResizeObserverStub;

const proto = Element.prototype as unknown as Record<string, unknown>;
proto.hasPointerCapture ??= () => false;
proto.setPointerCapture ??= () => {};
proto.releasePointerCapture ??= () => {};
proto.scrollIntoView ??= () => {};

// PointerEvent в jsdom нет, а меню Radix открываются по pointerdown: MouseEvent с теми же полями
if (typeof PointerEvent === 'undefined') {
  class PointerEventStub extends MouseEvent {
    pointerId: number;
    pointerType: string;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 1;
      this.pointerType = init.pointerType ?? 'mouse';
    }
  }
  (globalThis as { PointerEvent?: unknown }).PointerEvent = PointerEventStub;
}
