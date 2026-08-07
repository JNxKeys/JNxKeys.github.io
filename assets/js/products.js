// Registro central de productos del hub.
// Para activar/desactivar un producto en el hub: cambia "active" aqui y sube el cambio.
// No borra nada del HTML - solo oculta/muestra la tarjeta (y su categoria si queda vacia).
// Nota: esto solo controla la visibilidad en el hub (index.html). No genera sitemap.xml
// ni agrega/quita "noindex" en la pagina del producto - eso sigue siendo manual (ver README).
window.JNX_PRODUCTS = {
  "windows":    { active: true },
  "office":     { active: true },
  "google-one": { active: true },
  "chatgpt":    { active: true },
  "canva":      { active: true },
  "capcut":     { active: true },
  "eset":       { active: true },
  "kaspersky":  { active: true },
  "apple-one":  { active: false }
};
