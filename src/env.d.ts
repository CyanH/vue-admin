/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'jsencrypt/bin/jsencrypt.min' { const content: any; export = content; }

declare module 'js-cookie' { const content: any; export = content; }

declare module 'vue-image-crop-upload' { const content: any; export = content; }