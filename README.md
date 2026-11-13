# Sockbuster Video & Socks

Prototipo web de una tienda de calcetines temáticos de películas, series y cultura pop.
Evaluación Sumativa 03 · Modelamiento de soluciones informáticas (TI3025) · Ingeniería en Informática · INACAP.

## 🌐 Sitio web publicado

**https://TU-USUARIO.github.io/sockbuster/**

(Reemplaza `TU-USUARIO` por tu usuario de GitHub y el nombre del repositorio si es distinto.)

## Autores

- Alondra Ulloa Diaz
- Joaquin Mendez Garcia

## Páginas

| Archivo | Contenido |
| --- | --- |
| `index.html` | Presentación de la marca, banner y autores |
| `catalogo.html` | Catálogo con filtros, carrito, checkout, reseñas y panel de administración |
| `diagramas.html` | Arquitectura UML con las 5 vistas del paradigma 4+1 |
| `style.css` / `app.js` | Estilos y lógica del catálogo |

## Requerimientos cubiertos

RF01 catálogo por colecciones · RF02 carrito y pedidos con ID único · RF03 administración de inventario · RF04 reseñas de 1 a 5 estrellas · RNF01 despliegue en la nube (GitHub Pages) · RNF02 HTTPS y sesión con JWT.
La tabla de trazabilidad está en `diagramas.html#req`.

## Probar la sesión

Cliente: `cliente` / `1234` · Administrador: `admin` / `admin123`.
El JWT se genera en el navegador de forma simulada porque el prototipo no tiene backend. Los datos se guardan en `localStorage`.

## Tecnologías

HTML5, CSS3, JavaScript, Mermaid.js (diagramas), GitHub Pages (hosting).
