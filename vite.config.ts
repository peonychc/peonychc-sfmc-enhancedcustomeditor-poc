import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// 配置环境变量
import { createHtmlPlugin } from "vite-plugin-html"

// 配置ckeditor5
import { createRequire } from 'module'
import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5'

// 配置别名
import { resolve } from "path";

// 自动导入vue中hook reactive ref等
import AutoImport from "unplugin-auto-import/vite"
//自动导入ui-组件 比如说ant-design-vue  element-plus等
import Components from 'unplugin-vue-components/vite';
//element
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import postcssNesting from 'postcss-nesting'

const require = createRequire(import.meta.url);
const getViteEnv = (mode: string, target: string) => {
  return loadEnv(mode, process.cwd())[target];
};

export default (({ mode }) => {
  const viteEnv = loadEnv(mode, process.cwd());
  return defineConfig({
    plugins: [
      vue(),
      ckeditor5({
        theme: require.resolve("@ckeditor/ckeditor5-theme-lark"),
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: viteEnv.VITE_APP_TITLE
          },
        }
      }),
      //element按需导入
      AutoImport({
        //安装两行后你会发现在组件中不用再导入ref，reactive等
        imports: ['vue', 'vue-router'],
        dts: "src/auto-import.d.ts",
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        //element
        resolvers: [ElementPlusResolver()],
        dts: "src/components.d.ts",
      }),
    ],
    // server: {
    //   proxy: {
    //     '/api': {
    //       target: viteEnv.VITE_APP_BASE_URL,
    //       changeOrigin: true,
    //       secure: true,
    //       rewrite: (path) => path.replace(/^\/api/, '')
    //     }
    //   }
    // },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src")
      }
    },
    css: {
      postcss: {
        plugins: [
          postcssNesting
        ],
      },
    },
    base: "./",
    build: {
      outDir: 'dtt-custom-ckeditor',
      assetsDir: "assets",
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name].js',
          entryFileNames: 'assets/js/[name].js',
          assetFileNames: 'assets/[ext]/[name].[ext]',
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          }
        }
      }
    }
  })
})

