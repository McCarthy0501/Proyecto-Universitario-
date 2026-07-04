# AGENTS.md

## Rol
Eres un desarrollador web full-stack experto con 15 años de experiencia en:

- **Frontend:** React 19 (JavaScript, NO TypeScript), Vite, Tailwind CSS 4, Framer Motion, React Router 7 (HashRouter), Electron 38
- **Backend:** Django 4.2, Django REST Framework, SimpleJWT, PostgreSQL
- **Buenas prácticas:** testing (Playwright/pytest), CI/CD, Docker, seguridad web

## Reglas de trabajo
- El proyecto usa **JavaScript plano, sin TypeScript**. No introduzcas tipos, interfaces ni .ts/.tsx.
- Analiza el código existente antes de hacer cambios. Sigue las convenciones del proyecto.
- No introduzcas nuevas librerías sin verificar primero que el proyecto ya las usa.
- Prioriza la seguridad: nunca hardcodees secretos, credenciales ni tokens.
- Usa variables de entorno para configuración (Vite: `import.meta.env`, Django: `python-decouple`).
- Escribe código limpio, sin comentarios innecesarios.
- Cuando termines una tarea, verifica con lint si el proyecto tiene comandos para ello.
- No hagas commit a menos que el usuario lo pida explícitamente.

## Stack del proyecto
| Capa       | Tecnología                                      |
|------------|-------------------------------------------------|
| Frontend   | React 19 (JS), Vite 7, Tailwind 4, React Router 7 |
| Backend    | Django 4.2, DRF 3.15, SimpleJWT 5.3             |
| Base datos | PostgreSQL                                      |
| Desktop    | Electron 38 (solo panel admin)                  |
| Testing    | Playwright                                      |

## Estructura clave
- `tienda_salas_sanchez/src/` — Frontend React (JS, no TS)
- `BackEnd/proyectoIII/ecommerce-main/` — Proyecto Django
- `BackEnd/proyectoIII/ecommerce-main/api/` — API REST (DRF)
- `BackEnd/proyectoIII/ecommerce-main/store/` — Catálogo/productos
- `BackEnd/proyectoIII/ecommerce-main/accounts/` — Usuarios y auth
- `BackEnd/proyectoIII/ecommerce-main/orders/` — Pedidos
- `BackEnd/proyectoIII/ecommerce-main/carts/` — Carrito
- `BackEnd/proyectoIII/ecommerce-main/gestion/` — Panel admin (templates Django)

## Comandos útiles
- Frontend dev: `cd tienda_salas_sanchez && npm run dev`
- Frontend build: `cd tienda_salas_sanchez && npm run build`
- Frontend lint: `cd tienda_salas_sanchez && npm run lint`
- Backend: `cd BackEnd/proyectoIII/ecommerce-main && python manage.py runserver`

---

## Registro de cambios — 2026-07-04

### Alta prioridad — COMPLETADO

#### Backend
| Archivo | Cambio |
|---------|--------|
| `store/models.py` | +`is_new` (BooleanField, default=False), +`original_price` (IntegerField, null=True) |
| `store/serializers.py` | +`category_name` al ProductSerializer para exponer nombre de categoría en listados |
| `ecommerce/settings.py` | +`DEFAULT_PAGINATION_CLASS` (PageNumberPagination), +`PAGE_SIZE=12` |
| `api/views.py` | `Categorylist`: pagination_class=None. `ProductByCategory` y `ProductSearchView`: paginación manual. `ProductSearchView`: sort `rating` (Avg anotado), filtro `min_rating` |
| `store/migrations/0003_...` | Migración aplicada. +is_new, +original_price. Elimina tabla ExchangeRate huérfana |

#### Frontend — Componentes nuevos
| Componente | Ruta | Función |
|-----------|------|---------|
| `Badge.jsx` | `src/components/complementos/` | Insignias: "Nuevo" (verde), "-X%" (rojo), "Agotado" (gris). Posición absoluta sobre imagen |
| `Breadcrumb.jsx` | `src/components/complementos/` | Navegación jerárquica con auto-detección de ruta. Soporta modo manual (items prop) y automático |
| `Pagination.jsx` | `src/components/complementos/` | Páginas numeradas con elipsis para 7+. Botones prev/next con disabled |
| `SortDropdown.jsx` | `src/components/complementos/` | Ordenar: Más nuevos. Menor/Mayor precio. A-Z. Mejor valorados |
| `WishlistContext.jsx` | `src/contexts/` | Contexto de favoritos con localStorage. Mismo patrón que CartContext.jsx |
| `WishlistButton.jsx` | `src/components/complementos/` | Botón corazón animado (framer-motion). Relleno/outline según estado |
| `wishlist.jsx` | `src/pages/ecomerce/` | Página de favoritos con grid, skeletons y empty state |

#### Frontend — Componentes modificados
| Archivo | Cambios |
|---------|---------|
| `useProducts.js` | +loading, error, page, sort, setPage, setSort, totalPages, totalCount. Maneja respuesta plana y paginada |
| `useProductSearch.js` | +page, totalPages, totalCount, changePage, minRating. lastFiltersRef para reutilizar filtros al paginar |
| `searchResults.jsx` | Migrado de filtrado cliente (useMemo) a API (useProductSearch). Panel de filtros intacto. Paginación + breadcrumbs |
| `productCard.jsx` | Badges sobre imagen. Precio tachado con original_price. WishlistButton. Eye ahora abre ProductPreviewModal |
| `products.jsx` | SortDropdown arriba. Pagination abajo. Conteo "Mostrando X de Y". Loading state vía hook |
| `productDetail.jsx` | Breadcrumb reemplaza "Volver". Alerta stock bajo (≤5). Sticky bar mobile con precio + botón agregar |
| `mostrarProductosPorCategorias.jsx` | Breadcrumb con nombre de categoría (useCategorys). Respuesta paginada de API |
| `mostrarProductos.jsx` | Breadcrumb: Inicio > Productos |
| `mostrarCategorias.jsx` | Breadcrumb: Inicio > Categorías |
| `barraBusqueda.jsx` | Autocomplete con debounce 300ms. Dropdown con imagen+nombre+precio. Click navega al producto |
| `cajaUers.jsx` | Icono Heart con badge numérico (wishlistCount). Link a /#/wishlist |
| `App.jsx` | WishlistProvider anidado. Ruta /wishlist |

---

## Plan pendiente — Media prioridad

| # | Elemento | Detalle |
|---|----------|---------|
| 1 | **Hover swap de imagen** | Mostrar segunda imagen al pasar mouse en product cards |
| 2 | **Swatches de color visuales** | Círculos en vez de texto para variaciones de color en detalle |
| 3 | **Lightbox / zoom de imagen** | Click para ampliar en galería de detalle de producto |
| 4 | **Carrusel de relacionados** | Slider en vez de grid estático en detalle de producto |
| 5 | **Scroll-to-top button** | Botón flotante para volver arriba en listados largos |
| 6 | **Confirm dialog** | Confirmación al eliminar del carrito / limpiar carrito |
| 7 | **Mega menú de categorías** | Dropdown de categorías en navbar |
| 8 | **Vistos recientemente** | Productos visitados guardados en localStorage |
| 9 | **Cupón de descuento** | Input de código promocional en resumen del carrito |
| 10 | **Timeline de pedido** | Visualización del estado del pedido con pasos en mis pedidos |

## Plan pendiente — Baja prioridad

| # | Elemento | Detalle |
|---|----------|---------|
| 11 | **Unificar iconos** | Consolidar Lucide + React Icons en una sola librería |
| 12 | **Unificar toasts** | Reemplazar `alert()` con `toast` (cajaUers.jsx, productPreviewModal.jsx, etc.) |
| 13 | **Modo oscuro** | Dark mode con Tailwind |
| 14 | **Lazy loading imágenes** | `loading="lazy"` en todos los `<img>` |
| 15 | **Focus indicators** | `focus-visible` rings para accesibilidad de teclado |
| 16 | **Skeleton component unificado** | Componente reutilizable en vez de skeletons inline |
| 17 | **WhatsApp flotante** | Botón de contacto rápido |

---

## Registro de cambios — 2026-07-04 (Sesión 2) — COMPLETADO

### Backend
| Archivo | Cambio |
|---------|--------|
| `api/views.py` | +`CouponValidateView`: endpoint POST `/api/coupons/validate/`. Cupones: BIENVENIDO10, VERANO2026, SALAS20. Devuelve `discount_amount` o error |
| `api/urls.py` | +ruta `coupons/validate/` |

### Frontend — Componentes nuevos
| Componente | Ruta | Función |
|-----------|------|---------|
| `Lightbox.jsx` | `src/components/complementos/` | Zoom/galería fullscreen. Click en imagen principal abre modal con navegación prev/next (mouse + teclado), toggle zoom. Fondo negro semitransparente |
| `ScrollToTop.jsx` | `src/components/complementos/` | Botón flotante `fixed bottom-6 right-6`. Aparece al hacer scroll >300px. Animación framer-motion. Navega al top con `behavior: smooth` |
| `ConfirmDialog.jsx` | `src/components/complementos/` | Modal de confirmación con ícono, título, mensaje, botones Confirmar/Cancelar. Soporta variantes de color (`danger`, `warning`, `info`) |
| `CategoriesDropdown.jsx` | `src/components/header/` | Mega menú de categorías. Fetch a `/api/categorias/`. Dropdown con lista de categorías + link "Ver todas". Click cierra y navega |
| `RecentlyViewedContext.jsx` | `src/contexts/` | Contexto de productos vistos. Guarda máx. 8 en localStorage (`recently_viewed`). `addProduct()` registra al visitar detalle |
| `RecentlyViewedSection.jsx` | `src/components/complementos/` | Sección horizontal "Vistos Recientemente" con cards de productos. Se oculta si no hay items. Usada en `home.jsx` |
| `ThemeContext.jsx` | `src/contexts/` | Contexto de modo oscuro. Toggle `darkMode` persiste en localStorage. Agrega/quita clase `dark` en `<html>` |
| `WhatsAppButton.jsx` | `src/components/complementos/` | Botón flotante `fixed bottom-6 left-6`. Verde (#22c55e). Abre `wa.me` con número configurable (`VITE_WHATSAPP_NUMBER`) y mensaje predefinido |
| `Skeleton.jsx` | `src/components/complementos/` | Componente reutilizable con props: `width`, `height`, `rounded`, `className`. `animate-pulse bg-gray-200` |

### Frontend — Componentes modificados
| Archivo | Cambios |
|---------|---------|
| `App.jsx` | +`RecentlyViewedProvider`, `ThemeProvider`, `ScrollToTop`, `WhatsAppButton` |
| **`productCard.jsx`** | **Hover swap** — estado `isHovered` + `onMouseEnter/Leave`. Muestra `product.gallery[0].image` con transición `opacity` 500ms. Imagen principal y secundaria en capas superpuestas. `loading="lazy"` en todas las `<img>` |
| **`productDetail.jsx`** | **Swatches color** — 27 colores mapeados (rojo, azul, verde, negro, etc.). Círculos `w-8 h-8` con `ring-2 ring-blue-600` al seleccionar. Muestra nombre del color actual. **Lightbox** — import + estado + handlers + componente. Imagen principal con `cursor-zoom-in` abre Lightbox. **Carrusel relacionados** — grid reemplazado por `overflow-x-auto` con botones de flecha. Cards de 280px de ancho. **Vistos recientemente** — `useEffect` llama `addProduct()` al cargar producto. `loading="lazy"` en todas las `<img>` |
| `cartpage.jsx` | **ConfirmDialog** en `clearCart` y `removeFromCart`. **Cupón descuento** — input + botón "Aplicar" en sidebar. POST a `/api/coupons/validate/`. Muestra descuento aplicado y `Total Final` recalculado. Estado: `couponCode`, `couponDiscount`, `couponApplied` |
| `misPedidos.jsx` | **Timeline** — barra visual de 3 pasos (Pedido → Aceptado → Completado). Círculos numerados con colores: completado (verde), actual (azul), cancelado (rojo). Línea conectora entre pasos. Maneja estado `Cancelled` |
| `home.jsx` | +`RecentlyViewedSection` entre BrandStatement y Newsletter |
| `wishlist.jsx` | Refactor: skeletons inline reemplazados por componente `<Skeleton>` unificado |
| `narbar.jsx` | +`CategoriesDropdown` junto al logo. +Toggle dark mode (Sol/Luna) entre barra de búsqueda y user box |
| `cajaUers.jsx` | `alert("Sesion Cerrada")` → `toast.success()` |
| `productPreviewModal.jsx` | 6 `alert()` reemplazados por `toast.error()`/`toast.success()`. +`import toast` |
| `Recomendacion.jsx` | `react-icons/fi` → `lucide-react`: FiTruck→Truck, FiShield→Shield, FiAward→Award, FiHeart→Heart, FiPackage→Package, FiDollarSign→DollarSign |
| `menuAdmin.jsx` | `react-icons/fa` → `lucide-react`: FaBoxes→Package, FaUsers→Users, FaSignOutAlt→LogOut, FaChevronDown→ChevronDown, FaChevronRight→ChevronRight, FaBoxOpen→PackageOpen, FaClipboardList→ClipboardList, FaChartBar→BarChart3, FaHome→Home, FaDollarSign→DollarSign |
| `FooterAdmin.jsx` | `react-icons/fa` → `lucide-react`: FaFacebook→Globe, FaTwitter→AtSign, FaInstagram→Camera, FaLinkedin→ExternalLink |
| `footer.jsx` | `react-icons/fa` → `lucide-react`: FaFacebook→Globe, FaTwitter→AtSign, FaInstagram→Camera, FaLinkedin→ExternalLink |
| `index.css` | +regla global `*:focus-visible { outline: none; box-shadow: 0 0 0 2px #3b82f6; border-radius: 4px; }` |
| ~20 archivos | `loading="lazy"` agregado a todas las etiquetas `<img>` |
| `productCard.jsx`, `RecentlyViewedSection.jsx` | +clases `dark:` para modo oscuro (`dark:bg-gray-800`, `dark:text-white`, `dark:text-gray-300`) |

### Bugs corregidos esta sesión
| Archivo | Fix |
|---------|-----|
| `productPreviewModal.jsx` | `alert()` → `toast` (6 ocurrencias) |
| `cajaUers.jsx` | `alert()` → `toast.success()` |

---

## Registro de cambios — 2026-07-04 (Sesión 1) — COMPLETADO

### Alta prioridad — COMPLETADO

#### Backend
| Archivo | Cambio |
|---------|--------|
| `store/models.py` | +`is_new` (BooleanField, default=False), +`original_price` (IntegerField, null=True) |
| `store/serializers.py` | +`category_name` al ProductSerializer para exponer nombre de categoría en listados |
| `ecommerce/settings.py` | +`DEFAULT_PAGINATION_CLASS` (PageNumberPagination), +`PAGE_SIZE=12` |
| `api/views.py` | `Categorylist`: pagination_class=None. `ProductByCategory` y `ProductSearchView`: paginación manual. `ProductSearchView`: sort `rating` (Avg anotado), filtro `min_rating` |
| `store/migrations/0003_...` | Migración aplicada. +is_new, +original_price. Elimina tabla ExchangeRate huérfana |

#### Frontend — Componentes nuevos
| Componente | Ruta | Función |
|-----------|------|---------|
| `Badge.jsx` | `src/components/complementos/` | Insignias: "Nuevo" (verde), "-X%" (rojo), "Agotado" (gris). Posición absoluta sobre imagen |
| `Breadcrumb.jsx` | `src/components/complementos/` | Navegación jerárquica con auto-detección de ruta. Soporta modo manual (items prop) y automático |
| `Pagination.jsx` | `src/components/complementos/` | Páginas numeradas con elipsis para 7+. Botones prev/next con disabled |
| `SortDropdown.jsx` | `src/components/complementos/` | Ordenar: Más nuevos. Menor/Mayor precio. A-Z. Mejor valorados |
| `WishlistContext.jsx` | `src/contexts/` | Contexto de favoritos con localStorage. Mismo patrón que CartContext.jsx |
| `WishlistButton.jsx` | `src/components/complementos/` | Botón corazón animado (framer-motion). Relleno/outline según estado |
| `wishlist.jsx` | `src/pages/ecomerce/` | Página de favoritos con grid, skeletons y empty state |

#### Frontend — Componentes modificados
| Archivo | Cambios |
|---------|---------|
| `useProducts.js` | +loading, error, page, sort, setPage, setSort, totalPages, totalCount. Maneja respuesta plana y paginada |
| `useProductSearch.js` | +page, totalPages, totalCount, changePage, minRating. lastFiltersRef para reutilizar filtros al paginar |
| `searchResults.jsx` | Migrado de filtrado cliente (useMemo) a API (useProductSearch). Panel de filtros intacto. Paginación + breadcrumbs |
| `productCard.jsx` | Badges sobre imagen. Precio tachado con original_price. WishlistButton. Eye ahora abre ProductPreviewModal |
| `products.jsx` | SortDropdown arriba. Pagination abajo. Conteo "Mostrando X de Y". Loading state vía hook |
| `productDetail.jsx` | Breadcrumb reemplaza "Volver". Alerta stock bajo (≤5). Sticky bar mobile con precio + botón agregar |
| `mostrarProductosPorCategorias.jsx` | Breadcrumb con nombre de categoría (useCategorys). Respuesta paginada de API |
| `mostrarProductos.jsx` | Breadcrumb: Inicio > Productos |
| `mostrarCategorias.jsx` | Breadcrumb: Inicio > Categorías |
| `barraBusqueda.jsx` | Autocomplete con debounce 300ms. Dropdown con imagen+nombre+precio. Click navega al producto |
| `cajaUers.jsx` | Icono Heart con badge numérico (wishlistCount). Link a /#/wishlist |
| `App.jsx` | WishlistProvider anidado. Ruta /wishlist |

---

## Plan pendiente

### Completado — Sesión 2 (2026-07-04)
| # | Elemento | Estado |
|---|----------|--------|
| 1 | Hover swap de imagen | ✓ |
| 2 | Swatches de color visuales | ✓ |
| 3 | Lightbox / zoom de imagen | ✓ |
| 4 | Carrusel de relacionados | ✓ |
| 5 | Scroll-to-top button | ✓ |
| 6 | Confirm dialog | ✓ |
| 7 | Mega menú de categorías | ✓ |
| 8 | Vistos recientemente | ✓ |
| 9 | Cupón de descuento | ✓ |
| 10 | Timeline de pedido | ✓ |
| 11 | Unificar iconos | ✓ |
| 12 | Unificar toasts | ✓ |
| 13 | Modo oscuro | ✓ |
| 14 | Lazy loading imágenes | ✓ |
| 15 | Focus indicators | ✓ |
| 16 | Skeleton component unificado | ✓ |
| 17 | WhatsApp flotante | ✓ |

---

## Bugs conocidos

### Nuevos (introducidos sesión 2 — ninguno)

### Pre-existentes (sesión 1)
| Archivo | Bug |
|---------|-----|
| `productPreviewModal.jsx` | `calculateAverageRating()` lee estado antes de que `fetchReviews()` lo actualice (race condition). ~~Usa `alert()` en vez de `toast`~~ — CORREGIDO |
| ~~`cajaUers.jsx`~~ | ~~Usa `alert()` para logout en vez de `toast`~~ — CORREGIDO |
| ESLint global | `'motion' is defined but never used` en múltiples archivos — falso positivo: framer-motion usa proxy dinámico para `motion.div`, `motion.span`, etc. |
| `CartContext.jsx`, `AuthContext.jsx`, `WishlistContext.jsx`, `AdminAuthContext.jsx` | `react-refresh/only-export-components` — patrón de exportar hook + provider del mismo archivo |
