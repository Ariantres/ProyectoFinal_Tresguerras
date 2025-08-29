# Descripción del proyecto

Este proyecto consiste en un catálogo interactivo desarrollado en JavaScript, que permite al usuario explorar y filtrar productos de manera dinámica. El simulador refleja de manera funcional la lógica de negocio de un Ecommerce, desde la visualización de productos hasta la simulación de procesos de selección y cotización, ofreciendo una experiencia interactiva y visual directamente en el navegador.

# Objetivos

* Crear un catálogo interactivo 100% funcional que represente un flujo real de consulta y selección de productos.

* Utilizar datos simulados en JSON para poblar el catálogo.

* Generar HTML dinámico mediante JavaScript según los datos disponibles.

* Aplicar las principales herramientas de JavaScript y librerías externas para mejorar la interactividad (por ejemplo, reemplazando alertas nativas por notificaciones visuales).

* Permitir filtrado, búsqueda y selección de productos de forma intuitiva.

* Funcionalidades principales

* Visualización dinámica de productos con información relevante (nombre, descripción, precio e imagen).

* Filtrado de productos por categoría o características.

* Búsqueda de productos por nombre.

* Selección de productos con simulación de carrito o cotización.

* Precarga de datos en formularios o campos según corresponda.

* Uso de objetos y arrays para manejar productos de manera escalable.

* Funciones parametrizadas que permiten modularidad y reutilización del código.

* Carga de información desde JSON simulando datos remotos.

# Tecnologías utilizadas

* HTML5: Estructura y presentación del catálogo.

* CSS3: Estilos, diseño responsive y presentación visual de productos.

* JavaScript (ES6+): Lógica de negocio, manipulación del DOM, eventos y funciones.

* JSON: Simulación de datos remotos para el catálogo.

* Librerías externas: Para notificaciones o alertas personalizadas (ej. SweetAlert, Toastify).

# Estructura del proyecto
ProyectoFinal+Apellido/
│
├── index.html
├── style.css
├── script.js
├── data/
│   └── productos.json
├── assets/
│   ├── images/
│   └── icons/
└── README.md

index.html: Página principal del catálogo interactivo.

style.css: Estilos del catálogo y componentes visuales.

script.js: Código JavaScript con toda la lógica del catálogo y funcionalidades interactivas.

data/productos.json: Datos simulados de productos.

assets/: Carpeta con imágenes e íconos de los productos.

# Buenas prácticas implementadas

* Código limpio, legible y comentado.

* Eliminación de console.log y alertas nativas.

* Funciones y objetos con nombres significativos y contexto claro.

* Escalabilidad mediante arrays, objetos y funciones parametrizadas.

* Interactividad y actualización de la vista de manera asíncrona según las acciones del usuario.
