import { UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { resolve } from 'path'

const pathResolve = (dir: string): any => {
  return resolve(__dirname, ".", dir)
}

const alias: Record<string, string> = {
  '@': pathResolve("src")
}

// https://vitejs.dev/config/
export default (): UserConfigExport => {
  return {
    base: './',
    resolve: {
      alias
    },
    server: {
      port: 3004,
      host: '0.0.0.0',
      open: true,
    },
    plugins: [
      vue(),
      createSvgIconsPlugin({
        //配置svg存放路径
        iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]'
      })
    ]
  };
}
