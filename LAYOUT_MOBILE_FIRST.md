# Layout Mobile-First - ACIDOME

## Resumen de cambios

Este documento describe la reestructuración completa del layout para soportar un header mobile-first responsive, manteniendo la compatibilidad con el sistema de posicionamiento absoluto original de ACIDOME.

## Problema identificado

El sistema original de ACIDOME utiliza un layout con posicionamiento absoluto:
- `.geodesic` con `position: relative`
- Canvas y formulario con `position: absolute` dentro de `.geodesic`
- Sistema no diseñado para headers fijos modernos

**Intentos fallidos:**
1. ❌ Agregar padding al `.geodesic` → Rompía el posicionamiento absoluto
2. ❌ Usar CSS Grid en desktop → Conflicto con JavaScript que dimensiona el canvas
3. ❌ Sobrescribir estilos del canvas → El JS restauraba los valores originales

## Solución implementada

### Cambio arquitectónico principal

**ANTES:**
```html
<body>
  <div class="geodesic">
    <canvas class="preview">
    <header class="acidome-header">  ← Dentro de geodesic
    <form class="options">
  </div>
</body>
```

**DESPUÉS:**
```html
<body>
  <header class="acidome-header">  ← FUERA de geodesic
  <div class="geodesic">
    <canvas class="preview">
    <form class="options">
  </div>
</body>
```

### Estrategia CSS

**Filosofía:** Mínima intervención en el sistema original

#### Mobile (< 768px)
- Header fijo: `position: fixed`, `z-index: 1000`
- Body: `padding-top: 60px` para compensar header fijo
- Formulario: `background: rgba(255,255,255,0.85)` con glassmorphism
- Canvas: Mantiene comportamiento original (controlado por JS)

#### Desktop (≥ 768px)
- Header relativo: `position: relative` (fluye naturalmente)
- Body: `padding-top: 0` (sin compensación)
- Formulario: `top: 4em` (valor original del CSS)
- Todo vuelve al comportamiento original

## Características del nuevo header

### Mobile
- ✅ Menú hamburguesa con drawer lateral
- ✅ Logo y título ocultos (solo ícono hamburguesa)
- ✅ Navegación en panel lateral deslizable
- ✅ Overlay oscuro al abrir menú
- ✅ Formulario con efecto glassmorphism (vidrio esmerilado)
- ✅ Canvas 3D visible difuminado detrás del formulario

### Desktop
- ✅ Header horizontal ultra compacto (~30-35px altura)
- ✅ Navegación en línea con 4 secciones: Compartir, Descargas, Comunidad, Idioma
- ✅ Iconos y textos miniaturizados
- ✅ Logo y título ocultos para máxima compactación
- ✅ Selector de idioma en última sección del menú

## Archivos modificados

### HTML
- `index.html`: Header movido fuera de `.geodesic`

### CSS
- `css/header-mobile-first.css`:
  - Layout mobile-first responsive
  - Glassmorphism en formulario mobile
  - Navegación hamburguesa
  - Header compacto desktop

### Recursos
- `assets/icons.svg`: Sprite SVG con 13 iconos (50KB → 3KB)

## Estilos clave aplicados

```css
/* Mobile: compensar header fijo */
body {
  padding-top: var(--header-height); /* 60px */
}

/* Mobile: glassmorphism en formulario */
.geodesic form.options {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(12px) !important;
  border-radius: 16px !important;
}

/* Desktop: header relativo */
@media (min-width: 768px) {
  body {
    padding-top: 0;
  }

  .acidome-header {
    position: relative;
  }

  .geodesic form.options {
    top: 4em !important; /* Valor original */
  }
}
```

## Mejoras de UX

### Mobile
- 📱 Canvas 3D visible de fondo
- 🎨 Formulario flotante con efecto glass
- 🍔 Menú hamburguesa intuitivo
- ✨ Transiciones suaves

### Desktop
- 💻 Header minimalista que no distrae
- 📏 Navegación compacta horizontal
- 🎯 Todo el espacio para el canvas 3D
- 🚀 Carga rápida (iconos SVG ligeros)

## Compatibilidad

- ✅ Mantiene 100% del sistema de posicionamiento original
- ✅ No interfiere con JavaScript del canvas
- ✅ Respeta dimensionamiento dinámico del canvas
- ✅ Compatible con todos los data-bindings de Knockout.js
- ✅ Funciona en mobile, tablet y desktop

## Notas técnicas

### Por qué usamos `!important`
Necesario para sobrescribir estilos del CSS original (`acidome.css`) que tiene:
```css
.geodesic .options {
  position: absolute;
  top: 4em;
  width: 23em;
}
```

### Por qué NO tocamos el canvas
El canvas tiene dimensiones controladas por JavaScript. Cualquier CSS que intente forzar tamaños será sobrescrito en cada render.

### Por qué el header está fuera de geodesic
El sistema `.geodesic` usa `position: relative` como contexto para todos sus hijos `absolute`. Meter un header fijo dentro rompía todo el sistema de coordenadas.

## Próximos pasos recomendados

1. Optimizar formulario responsive (mejorar grid en mobile)
2. Implementar panel de estadísticas responsive
3. Mejorar botones de modo de visualización
4. Considerar dark mode
5. Añadir más breakpoints para tablets específicos

---

**Autor:** Claude Code
**Fecha:** 2025
**Branch:** menues
