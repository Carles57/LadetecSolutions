// @ts-check
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
//import AutoImport from "astro-auto-import";
import config from "./src/config/config.json";
import node from '@astrojs/node';
import { defineConfig } from 'astro/config';
import partytown from '@astrojs/partytown';

//import remarkCollapse from "remark-collapse";
//import remarkToc from "remark-toc";

// https://astro.build/config
export default defineConfig({
  //outDir: '../Ladetec/dist',
      //Define la URL base pública de mi sitio (para SEO y URLs absolutas).
  site: config.site.base_url ? config.site.base_url : "http://examplesite.com",
     // Para sitios desplegados en un subpath (útil si tu sitio está en una subcarpeta como https://
    //Ejemplo: base: '/mi-subcarpeta/'
  base: config.site.base_path ? config.site.base_path : "/",
     //Controla si las URLs terminan con barra (/).
     //Ejemplo: trailingSlash: 'always'
  trailingSlash: config.site.trailing_slash ? "always" : "never",
    server: {
      proxy: {
        '/links': {
          target: 'http://127.0.0.1:3000',
          changeOrigin: true,
        },
      },
    },
    output: 'server',
 
    adapter: node({
      mode: 'standalone',
      port: 4321,
    }),
    integrations: [
      
      mdx(),
      sitemap(),
      react(),
      tailwind(),
      partytown(),
      
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    extendDefaultPlugins: true,
});



