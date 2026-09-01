# 0. Configuración Original - JNxKeys

Este documento detalla la configuración base y el entorno de despliegue del proyecto JNxKeys.

## Entorno y Despliegue
- **Hosting:** GitHub Pages.
- **Repositorio:** `jnxkeys.github.io` (Público/Privado).
- **Dominio:** Actualmente operando bajo el subdominio de GitHub Pages `https://jnxkeys.github.io/`.
- **Certificado SSL:** Provisto automáticamente por GitHub Pages (HTTPS forzado).

## Estructura Base del Proyecto
El proyecto es un sitio web estático (HTML/CSS/JS) sin frameworks ni dependencias de Node.js/NPM.

```text
/
├── assets/
│   ├── css/ (Si aplica)
│   ├── js/
│   │   └── products.js (Control de estado de productos)
│   └── img/ (Imágenes, logos y favicons)
├── docs/ (Documentación interna del proyecto)
├── [producto]/ (Ej. windows/, office/, canva/)
│   └── index.html (Página de producto SPA)
├── index.html (Hub principal y catálogo)
├── robots.txt
└── sitemap.xml
```
