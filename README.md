# Cine Aurora · Simulador de Taquilla

Proyecto de Coderhouse · JavaScript. Simulador de la taquilla de un cine que integra:

- **Pre-Entrega 3:** funciones (declaradas, expresada y flecha), parámetros, `return`, ciclos y condicionales.
- **Pre-Entrega 4:** uso e interacción con **arrays** (cartelera).

La interacción es solo con **`prompt`**, **`alert`** y **consola**. `index.html` únicamente carga el script (`<script src="main.js" defer></script>`).

## Cómo ejecutarlo

1. Clona o descarga el repositorio.
2. Abre `index.html` en un navegador real (Chrome, Safari o Firefox). La vista previa integrada de VS Code no soporta `prompt()`.
3. El simulador inicia al cargar la página. Para reiniciarlo, recarga con `Cmd/Ctrl + R`.
4. Abre la consola (`F12`) para ver los mensajes y el tiquete.

## Estructura

```
├── index.html   # Carga main.js con defer y muestra la cartelera informativa
├── main.js      # Lógica del simulador (funciones + arrays)
└── README.md
```

## Qué hace el simulador

- Menú principal: comprar boletas, agregar confitería, ver pedido, quitar ítems, aplicar cupón, **gestionar cartelera** y finalizar compra.
- Selección de película, horario, tipo de boleta (General, Estudiante, Niño / Adulto mayor) y cantidad, con control de sillas por función.
- Restricción de edad en películas +7, +12 y +16.
- Descuento por grupo (5 %, 10 %, 15 %), cupones (`AURORA10`, `ESTRENO5`, `CINEFILO15`), sobrecargo 3D e impoconsumo del 8 %.
- Pago en efectivo (con cambio), tarjeta débito o crédito (hasta 3 cuotas).
- **Gestión de cartelera:** un array de películas que se puede agregar, retirar, buscar y reemplazar. Lo que está en la cartelera es lo que se puede vender.

## Pre-Entrega 4 · Cumplimiento de los criterios

El array `cartelera` (nombre semántico, 5 elementos iniciales) es el dato sobre el que opera la taquilla. Se accede desde la opción **6. Gestionar cartelera**.

| Criterio | Dónde se cumple en `main.js` |
|---|---|
| Array con nombre semántico y 5 elementos | `const cartelera = [...]` (5 títulos) |
| 2 o más métodos de extremos | `push` y `unshift` en `flujoAgregarPelicula`; `pop` y `shift` en `flujoRetirarPelicula` |
| Elemento eliminado en un mensaje | `"Se ha eliminado el elemento: [título]"` en `flujoRetirarPelicula` (alert y consola) |
| Búsqueda con `includes` + `indexOf` | `flujoBuscarPelicula` (valor pedido por `prompt`); también `includes` en `elegirTituloNuevo` para evitar duplicados |
| `splice` que reemplaza por índice | `flujoReemplazarPelicula`: `lista.splice(indice, 1, nueva)` |
| Función con `for...of` y formato claro | `listarCartelera(lista)` imprime `Película: [título]` y el total |
| Consola sin errores | Todas las entradas se validan con ciclos y condicionales |
| Dentro del mismo simulador | La venta de boletas usa la cartelera: lo que se agrega o retira cambia lo que se puede vender |

## Pre-Entrega 3 · Funciones

| Criterio | Dónde se cumple |
|---|---|
| Funciones por fases (entrada, procesamiento, salida) | Entrada: `pedirTexto`, `pedirEntero`, `confirmarSiNo`. Procesamiento: `calcularPrecioBoleta`, `calcularTotales`, `validarCupon`, `agregarAlPedido`, `elegirMetodoPago`. Salida: `mostrarPedido`, `mostrarTiquete`, `listarCartelera` |
| Parámetros y argumentos | Todas las funciones reciben datos por parámetros |
| `return` | `pedirEntero`, `calcularTotales`, `calcularPrecioBoleta`, `validarCupon`, `elegirMetodoPago`, entre otras |
| Función flecha | `formatoPesos`, `calcularImporte`, `calcularPorcentaje`, `calcularCambio`, `esEdadPermitida`, `contarBoletas`, `buscarPelicula`, entre otras |
| Función expresada | `obtenerPorcentajeGrupo` |
| Ciclos y condicionales | `while`, `for`, `for...of`, `if / else if / else`, `switch` |
