/// <reference types="vite/client" />

declare module 'virtual:uikit-props' {
  import type { PropsLibrary } from '../props-plugin';
  export const web: PropsLibrary;
  export const native: PropsLibrary;
}
