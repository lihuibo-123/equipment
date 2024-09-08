import process from 'node:process';
import { URL, fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import { setupVitePlugins } from './build/plugins';
import { createViteProxy, getBuildTime } from './build/config';

export default defineConfig(configEnv => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as unknown as Env.ImportMeta;

  const buildTime = getBuildTime();

  return {
    base: viteEnv.VITE_BASE_URL,
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "./src/styles/scss/global.scss" as *;`
        }
      }
    },
    plugins: setupVitePlugins(viteEnv, buildTime),
    define: {
      BUILD_TIME: JSON.stringify(buildTime)
    },
    server: {
      host: '0.0.0.0',
      port: 9527,
      open: true,
      // proxy: createViteProxy(viteEnv, configEnv.command === 'serve'),
      proxy: {
        '/iotapi': {
          //代理api
          target: 'http://43.138.140.98', //代理接口(注意只要域名就够了)
          secure: 'true',
          changeOrigin: true, //是否跨域
          ws: true, // proxy websockets
          // pathRewrite: {
          //   //重写路径
          //   '^/iotapi': '/iotapi'  //代理路径
          // }
        },
        '/dgiot_dashboard': {
          //代理api
          target: 'http://43.138.140.98', //代理接口(注意只要域名就够了)
          secure: 'true',
          changeOrigin: true, //是否跨域
          ws: true, // proxy websockets
          // pathRewrite: {
          //   //重写路径
          //   '^/dgiot_dashboard': '/dgiot_dashboard'  //代理路径
          // }
        },
        '/dgiot_file': {
          //代理api
          target: 'http://43.138.140.98', //代理接口(注意只要域名就够了)
          secure: 'true',
          changeOrigin: true, //是否跨域
          ws: true, // proxy websockets
          // pathRewrite: {
          //   //重写路径
          //   '^/dgiot_file': '/dgiot_file'  //代理路径
          // }
        },
        '/upload': {
          //代理api
          target: 'http://43.138.140.98', //代理接口(注意只要域名就够了)
          secure: 'true',
          changeOrigin: true, //是否跨域
          ws: true, // proxy websockets
          // pathRewrite: {
          //   //重写路径
          //   '^/upload': '/upload'  //代理路径
          // }
        }
      },
      fs: {
        cachedChecks: false
      }
    },
    preview: {
      port: 9725
    },
    build: {
      reportCompressedSize: false,
      sourcemap: viteEnv.VITE_SOURCE_MAP === 'Y',
      commonjsOptions: {
        ignoreTryCatch: false
      }
    }
  };
});
