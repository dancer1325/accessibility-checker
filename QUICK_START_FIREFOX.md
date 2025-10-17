# 🚀 Guía Rápida: 2 Minutos para Firefox

## Paso 1: Abre Firefox

Cualquier versión moderna (109+)

## Paso 2: Ve a la página de debugging

En la barra de direcciones, escribe:

```
about:debugging#/runtime/this-firefox
```

## Paso 3: Carga la extensión

1. Click en **"Cargar complemento temporal"** (o "Load Temporary Add-on")
2. Navega a: `c:\devel\accessibility-checker`
3. Selecciona el archivo: **`manifest.json`**
4. Click **"Abrir"**

## Paso 4: ¡Usa la extensión!

- Verás el ícono de la extensión en la barra de herramientas
- Click en el ícono para abrir el popup
- Funciona exactamente igual que en Chrome

---

## 🎯 Atajos de Teclado (Firefox)

| Acción               | Atajo                                        |
| -------------------- | -------------------------------------------- |
| Abrir debugging      | `about:debugging`                            |
| Consola de extensión | Click en "Inspeccionar" junto a tu extensión |
| Recargar extensión   | Click en el botón "Recargar"                 |
| Ver errores          | Click en "Inspeccionar" → pestaña "Consola"  |

---

## 🔍 Verificar que Funciona

1. **Abre cualquier página web** (ej: https://example.com)
2. **Click en el ícono de la extensión**
3. **Ingresa un selector** (ej: `body` o `main`)
4. **Click "Run Analysis"**
5. **Verifica que aparezcan resultados**

Si ves resultados → ✅ **¡Funciona perfectamente!**

---

## 📦 Para Publicar en Firefox Add-ons

```powershell
# Instalar dependencias
npm install

# Crear paquete .xpi
npm run firefox:build

# El archivo estará en: web-ext-artifacts/
```

Luego sube el `.xpi` a: https://addons.mozilla.org/developers/

---

## ❓ Solución Rápida de Problemas

### No veo el ícono de la extensión

→ Busca en: Menú → Complementos → Extensiones

### Error "Service worker no soportado"

→ Actualiza Firefox a versión 109 o superior

### No funciona en una página

→ Algunas páginas bloquean extensiones (ej: about:\*, addons.mozilla.org)

---

## ✨ ¡Eso es todo!

Tu extensión ahora funciona en:

- ✅ Google Chrome
- ✅ Microsoft Edge
- ✅ Brave Browser
- ✅ Mozilla Firefox
- ✅ Cualquier navegador basado en Chromium

**Un solo código, múltiples navegadores.**
