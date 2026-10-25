// ==========================================================
// CINE AURORA - SIMULADOR DE TAQUILLA
// Pre-Entrega 3: Funciones e Integración de Lógica
// Pre-Entrega 4: Uso e interacción con Arrays
//
// Interacción: prompt (entrada), alert y console (salida)
//
// ARRAY DE LA PRE-ENTREGA 4:
//   cartelera -> títulos de las películas en cartelera (5 elementos
//   iniciales). Es el dato que usa la taquilla para vender boletas:
//     push / unshift    -> agregar una película al final / como estreno
//     pop / shift       -> retirar una película (se muestra la eliminada)
//     includes/indexOf  -> buscar una película y saber su posición
//     splice            -> reemplazar la película de una posición
//     for...of          -> listarCartelera(lista) muestra la cartelera
//
// ARQUITECTURA (algoritmo básico de todo programa):
//   FASE 1 · ENTRADA        -> pedirTexto, pedirEntero, confirmarSiNo
//   FASE 2 · PROCESAMIENTO  -> calcularPrecioBoleta, agregarAlPedido,
//                              calcularSubtotal, calcularTotales,
//                              validarCupon, elegirMetodoPago,
//                              obtenerPorcentajeGrupo, descontarSillas
//   FASE 3 · SALIDA         -> mostrarPedido, mostrarTiquete, listarCartelera
//
// TIPOS DE FUNCIÓN USADOS:
//   Declaradas (function)  -> la mayoría de las funciones
//   Expresada              -> obtenerPorcentajeGrupo
//   Flecha (=>)            -> formatoPesos, calcularImporte, calcularPorcentaje,
//                             calcularCambio, esEdadPermitida, contarPorTipo,
//                             contarBoletas, boletasEnFuncion, buscarPelicula,
//                             normalizarTexto
// ==========================================================

// ---------- CONSTANTES ----------

const IMPOCONSUMO = 8;       // % de impuesto al consumo
const SOBRECARGO_3D = 5000;  // valor extra por boleta en formato 3D
const MAX_POR_COMPRA = 10;   // máximo de unidades por ítem

const CUPONES = {
  AURORA10: 10,
  ESTRENO5: 5,
  CINEFILO15: 15,
};

const TIPOS_BOLETA = [
  { nombre: "General", descuento: 0 },
  { nombre: "Estudiante", descuento: 20 },
  { nombre: "Niño / Adulto mayor", descuento: 30 },
];

// ---------- DATOS ----------

// Crea los 3 horarios de una película con el mismo número de sillas
function crearHorarios(sillasPorFuncion) {
  return [
    { hora: "2:00 p. m.", sillas: sillasPorFuncion },
    { hora: "5:30 p. m.", sillas: sillasPorFuncion },
    { hora: "8:45 p. m.", sillas: sillasPorFuncion },
  ];
}

// Catálogo completo de películas (objetos con sus datos)
const catalogoPeliculas = [
  { id: 1, titulo: "La Última Función", genero: "Drama", clasificacion: "+12", edadMinima: 12, duracion: 128, formato: "2D", precio: 17000, horarios: crearHorarios(30) },
  { id: 2, titulo: "Noche de Estrellas", genero: "Romance", clasificacion: "Todo público", edadMinima: 0, duracion: 112, formato: "2D", precio: 17000, horarios: crearHorarios(30) },
  { id: 3, titulo: "Código Rojo 7", genero: "Acción", clasificacion: "+16", edadMinima: 16, duracion: 134, formato: "3D", precio: 17000, horarios: crearHorarios(24) },
  { id: 4, titulo: "Mundo Pixelado", genero: "Animación", clasificacion: "Todo público", edadMinima: 0, duracion: 98, formato: "3D", precio: 16000, horarios: crearHorarios(36) },
  { id: 5, titulo: "Ritmo Latino", genero: "Musical", clasificacion: "Todo público", edadMinima: 0, duracion: 109, formato: "2D", precio: 17000, horarios: crearHorarios(28) },
  { id: 6, titulo: "El Faro Escondido", genero: "Misterio", clasificacion: "+12", edadMinima: 12, duracion: 119, formato: "2D", precio: 17000, horarios: crearHorarios(26) },
  { id: 7, titulo: "Sombras del Bosque", genero: "Terror", clasificacion: "+16", edadMinima: 16, duracion: 105, formato: "2D", precio: 17000, horarios: crearHorarios(22) },
  { id: 8, titulo: "Atrapa el Tiempo", genero: "Ciencia ficción", clasificacion: "+12", edadMinima: 12, duracion: 141, formato: "3D", precio: 17000, horarios: crearHorarios(30) },
  { id: 9, titulo: "Corazones en Bogotá", genero: "Comedia romántica", clasificacion: "+7", edadMinima: 7, duracion: 101, formato: "2D", precio: 17000, horarios: crearHorarios(28) },
  { id: 10, titulo: "Risas en Familia", genero: "Comedia", clasificacion: "Todo público", edadMinima: 0, duracion: 95, formato: "2D", precio: 16000, horarios: crearHorarios(32) },
];

// ARRAY (Pre-Entrega 4): cartelera de la semana.
// Nombre semántico del simulador, inicializado con 5 elementos (strings).
const cartelera = [
  "La Última Función",
  "Noche de Estrellas",
  "Código Rojo 7",
  "Mundo Pixelado",
  "Ritmo Latino",
];

// Confitería
const combos = [
  { id: 1, nombre: "Combo Clásico (palomitas + gaseosa)", precio: 22000 },
  { id: 2, nombre: "Combo Pareja (2 gaseosas + palomitas grandes)", precio: 36000 },
  { id: 3, nombre: "Palomitas grandes", precio: 18000 },
  { id: 4, nombre: "Nachos con queso", precio: 16000 },
  { id: 5, nombre: "Gaseosa grande", precio: 9000 },
  { id: 6, nombre: "Perro caliente", precio: 14000 },
];

// ==========================================================
// FASE 2 · PROCESAMIENTO - Funciones flecha (ES6)
// Optimizan procesos simples y retornan un valor
// ==========================================================

// @param {number} valor -> @returns {string} texto en pesos colombianos
const formatoPesos = (valor) => "$" + Math.round(valor).toLocaleString("es-CO");

// @param {number} precio, {number} cantidad -> @returns {number} importe de la línea
const calcularImporte = (precio, cantidad) => precio * cantidad;

// @param {number} monto, {number} porcentaje -> @returns {number} valor del porcentaje
const calcularPorcentaje = (monto, porcentaje) => monto * (porcentaje / 100);

// @param {number} recibido, {number} total -> @returns {number} cambio a devolver
const calcularCambio = (recibido, total) => recibido - total;

// @param {number} edad, {number} edadMinima -> @returns {boolean} si puede ver la película
const esEdadPermitida = (edad, edadMinima) => edad >= edadMinima;

// @param {string} texto -> @returns {string} minúsculas y sin tildes (para buscar)
const normalizarTexto = (texto) =>
  texto.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// @param {Array} pedido, {string} tipo -> @returns {number} unidades de ese tipo de ítem
const contarPorTipo = (pedido, tipo) =>
  pedido.reduce((acumulado, item) => (item.tipo === tipo ? acumulado + item.cantidad : acumulado), 0);

// @param {Array} pedido -> @returns {number} total de boletas
const contarBoletas = (pedido) => contarPorTipo(pedido, "boleta");

// @param {Array} pedido, {number} idPelicula, {string} hora -> @returns {number} boletas de esa función
const boletasEnFuncion = (pedido, idPelicula, hora) =>
  pedido.reduce(
    (acumulado, item) =>
      item.tipo === "boleta" && item.idPelicula === idPelicula && item.hora === hora
        ? acumulado + item.cantidad
        : acumulado,
    0
  );

// @param {Array} catalogo, {string} titulo -> @returns {Object|undefined} película encontrada
const buscarPelicula = (catalogo, titulo) => catalogo.find((pelicula) => pelicula.titulo === titulo);

// ==========================================================
// FASE 2 · PROCESAMIENTO - Función expresada (condicionales)
// ==========================================================

// @param {number} cantidadBoletas -> @returns {number} % de descuento por grupo
const obtenerPorcentajeGrupo = function (cantidadBoletas) {
  if (cantidadBoletas >= 10) {
    return 15;
  } else if (cantidadBoletas >= 6) {
    return 10;
  } else if (cantidadBoletas >= 4) {
    return 5;
  } else {
    return 0;
  }
};

// ==========================================================
// FASE 1 · ENTRADA DE DATOS (prompt + validación con ciclos)
// ==========================================================

// Pide un texto no vacío. Retorna null si se cancela.
function pedirTexto(mensaje) {
  while (true) {
    const entrada = prompt(mensaje);

    if (entrada === null) {
      return null;
    }
    if (entrada.trim() !== "") {
      return entrada.trim();
    }
    alert("Este campo no puede estar vacío.");
  }
}

// Pide un número entero dentro de un rango. Retorna null si se cancela.
function pedirEntero(mensaje, minimo, maximo) {
  while (true) {
    const entrada = prompt(mensaje);

    if (entrada === null) {
      return null;
    }

    const numero = Number(entrada.trim());

    if (entrada.trim() !== "" && Number.isInteger(numero) && numero >= minimo && numero <= maximo) {
      return numero;
    }
    alert(`Entrada inválida. Ingresa un número entero entre ${minimo} y ${maximo}.`);
  }
}

// Pregunta sí/no. Retorna true o false.
function confirmarSiNo(mensaje) {
  while (true) {
    const entrada = prompt(`${mensaje} (si / no)`);

    if (entrada === null) {
      return false;
    }

    const respuesta = normalizarTexto(entrada);

    if (respuesta === "si") {
      return true;
    }
    if (respuesta === "no") {
      return false;
    }
    alert('Responde únicamente "si" o "no".');
  }
}

// ==========================================================
// APOYO - Construcción de mensajes (retornan strings)
// ==========================================================

function construirMenuPrincipal(nombre, pedido, cupon) {
  const estadoCupon = cupon ? `${cupon.codigo} (${cupon.porcentaje}%)` : "ninguno";

  return (
    `CINE AURORA - Taquilla | Cliente: ${nombre}\n` +
    `Pedido: ${contarBoletas(pedido)} boleta(s), ${contarPorTipo(pedido, "combo")} combo(s) | Cupón: ${estadoCupon}\n\n` +
    `1. Comprar boletas\n` +
    `2. Agregar confitería\n` +
    `3. Ver pedido\n` +
    `4. Quitar un ítem del pedido\n` +
    `5. Aplicar cupón\n` +
    `6. Gestionar cartelera\n` +
    `7. Finalizar compra\n\n` +
    `Escribe el número de la opción (Cancelar para salir)`
  );
}

// Menú de cartelera para la venta: una línea por película
function construirMenuCartelera(lista, catalogo) {
  let menu = "CARTELERA - CINE AURORA\n";

  for (let i = 0; i < lista.length; i++) {
    const pelicula = buscarPelicula(catalogo, lista[i]);
    menu += `${i + 1}. ${pelicula.titulo} | ${pelicula.genero} | ${pelicula.clasificacion} | ${pelicula.duracion} min | ${pelicula.formato} | ${formatoPesos(pelicula.precio)}\n`;
  }

  menu += `Escribe el número de la película (1-${lista.length})`;
  return menu;
}

function construirMenuHorarios(pelicula, pedido) {
  let menu = `${pelicula.titulo} (${pelicula.formato})\nHorarios de hoy:\n`;

  for (let i = 0; i < pelicula.horarios.length; i++) {
    const horario = pelicula.horarios[i];
    const disponibles = horario.sillas - boletasEnFuncion(pedido, pelicula.id, horario.hora);
    const estado = disponibles > 0 ? `${disponibles} sillas` : "agotada";
    menu += `${i + 1}. ${horario.hora} (${estado})\n`;
  }

  menu += "Escribe el número del horario";
  return menu;
}

function construirMenuTiposBoleta(pelicula) {
  let menu = "TIPO DE BOLETA\n";

  for (let i = 0; i < TIPOS_BOLETA.length; i++) {
    const tipo = TIPOS_BOLETA[i];
    menu += `${i + 1}. ${tipo.nombre} - ${formatoPesos(calcularPrecioBoleta(pelicula, tipo))}\n`;
  }

  menu += "Escribe el número del tipo de boleta";
  return menu;
}

function construirDescripcionItem(item) {
  const importe = formatoPesos(calcularImporte(item.precio, item.cantidad));

  if (item.tipo === "boleta") {
    return `Boleta ${item.tipoBoleta} - ${item.titulo} (${item.hora}) x${item.cantidad} = ${importe}`;
  }

  return `${item.nombre} x${item.cantidad} = ${importe}`;
}

function construirListadoPedido(pedido) {
  let texto = "";

  for (let i = 0; i < pedido.length; i++) {
    texto += `${i + 1}. ${construirDescripcionItem(pedido[i])}\n`;
  }

  return texto;
}

// ==========================================================
// FASE 2 · PROCESAMIENTO - Funciones declaradas
// ==========================================================

// @param {Object} pelicula, {Object} tipoBoleta -> @returns {number} precio de una boleta
function calcularPrecioBoleta(pelicula, tipoBoleta) {
  const base = pelicula.formato === "3D" ? pelicula.precio + SOBRECARGO_3D : pelicula.precio;
  return base - calcularPorcentaje(base, tipoBoleta.descuento);
}

// Agrega un ítem al pedido (o suma la cantidad si ya existe)
function agregarAlPedido(pedido, nuevoItem) {
  const existente = pedido.find((item) => item.clave === nuevoItem.clave);

  if (existente) {
    existente.cantidad += nuevoItem.cantidad;
  } else {
    pedido.push(nuevoItem);
  }
}

// @param {Array} pedido -> @returns {number} suma de los importes
function calcularSubtotal(pedido) {
  let subtotal = 0;

  for (const item of pedido) {
    subtotal += calcularImporte(item.precio, item.cantidad);
  }

  return subtotal;
}

// @param {string} codigo -> @returns {number} % del cupón (0 si no existe)
function validarCupon(codigo) {
  const clave = codigo.toUpperCase();
  return CUPONES[clave] || 0;
}

// @param {Array} pedido, {Object|null} cupon -> @returns {Object} desglose completo
function calcularTotales(pedido, cupon) {
  const subtotal = calcularSubtotal(pedido);

  const porcentajeGrupo = obtenerPorcentajeGrupo(contarBoletas(pedido));
  const descuentoGrupo = calcularPorcentaje(subtotal, porcentajeGrupo);
  const tras1 = subtotal - descuentoGrupo;

  const porcentajeCupon = cupon ? cupon.porcentaje : 0;
  const descuentoCupon = calcularPorcentaje(tras1, porcentajeCupon);
  const base = tras1 - descuentoCupon;

  const impuesto = calcularPorcentaje(base, IMPOCONSUMO);
  const total = Math.round(base + impuesto);

  return {
    subtotal: subtotal,
    porcentajeGrupo: porcentajeGrupo,
    descuentoGrupo: descuentoGrupo,
    porcentajeCupon: porcentajeCupon,
    descuentoCupon: descuentoCupon,
    base: base,
    impuesto: impuesto,
    total: total,
  };
}

// Pide el método de pago y retorna un objeto con el resultado
function elegirMetodoPago(total) {
  const opcion = pedirEntero(
    "MÉTODO DE PAGO\n" +
    "1. Efectivo\n" +
    "2. Tarjeta débito\n" +
    "3. Tarjeta de crédito (hasta 3 cuotas sin interés)\n" +
    `Total a pagar: ${formatoPesos(total)}`,
    1,
    3
  );

  if (opcion === null) {
    return null;
  }

  if (opcion === 1) {
    const recibido = pedirEntero(
      `Total a pagar: ${formatoPesos(total)}\n¿Con cuánto paga el cliente? (mínimo ${total})`,
      total,
      10000000
    );

    if (recibido === null) {
      return null;
    }

    return { metodo: "Efectivo", cuotas: 1, valorCuota: total, recibido: recibido, cambio: calcularCambio(recibido, total) };
  }

  if (opcion === 2) {
    return { metodo: "Tarjeta débito", cuotas: 1, valorCuota: total, recibido: total, cambio: 0 };
  }

  const cuotas = pedirEntero("¿En cuántas cuotas? (1 a 3, sin interés)", 1, 3);

  if (cuotas === null) {
    return null;
  }

  return { metodo: "Tarjeta de crédito", cuotas: cuotas, valorCuota: total / cuotas, recibido: total, cambio: 0 };
}

// Descuenta del catálogo las sillas vendidas
function descontarSillas(catalogo, pedido) {
  for (const item of pedido) {
    if (item.tipo === "boleta") {
      const pelicula = catalogo.find((p) => p.id === item.idPelicula);
      const horario = pelicula.horarios.find((h) => h.hora === item.hora);
      horario.sillas -= item.cantidad;
    }
  }
}

// ==========================================================
// FASE 3 · SALIDA DE RESULTADOS (consola + alert)
// ==========================================================

function mostrarPedido(pedido) {
  if (pedido.length === 0) {
    alert("Tu pedido está vacío.");
    return;
  }

  console.log("---------- PEDIDO ACTUAL ----------");
  console.table(
    pedido.map((item) => ({
      Ítem: item.tipo === "boleta" ? `Boleta ${item.tipoBoleta} - ${item.titulo} (${item.hora})` : item.nombre,
      Cantidad: item.cantidad,
      "Precio unitario": formatoPesos(item.precio),
      Importe: formatoPesos(calcularImporte(item.precio, item.cantidad)),
    }))
  );

  alert(`PEDIDO ACTUAL\n\n${construirListadoPedido(pedido)}\nSubtotal: ${formatoPesos(calcularSubtotal(pedido))}`);
}

function mostrarTiquete(tiquete) {
  const { codigo, cliente, pedido, totales, pago } = tiquete;

  console.log("==================================================");
  console.log(`TIQUETE ${codigo} - CINE AURORA`);
  console.log(`Cliente: ${cliente}`);
  console.log("==================================================");

  console.table(
    pedido.map((item) => ({
      Ítem: item.tipo === "boleta" ? `Boleta ${item.tipoBoleta} - ${item.titulo} (${item.hora})` : item.nombre,
      Cantidad: item.cantidad,
      Importe: formatoPesos(calcularImporte(item.precio, item.cantidad)),
    }))
  );

  console.log(`Subtotal: ${formatoPesos(totales.subtotal)}`);
  console.log(`Descuento por grupo (${totales.porcentajeGrupo}%): -${formatoPesos(totales.descuentoGrupo)}`);
  console.log(`Descuento por cupón (${totales.porcentajeCupon}%): -${formatoPesos(totales.descuentoCupon)}`);
  console.log(`Impoconsumo (${IMPOCONSUMO}%): +${formatoPesos(totales.impuesto)}`);
  console.log(`TOTAL: ${formatoPesos(totales.total)}`);
  console.log(`Pago: ${pago.metodo} - ${pago.cuotas} cuota(s) de ${formatoPesos(pago.valorCuota)}`);

  if (pago.metodo === "Efectivo") {
    console.log(`Recibido: ${formatoPesos(pago.recibido)} | Cambio: ${formatoPesos(pago.cambio)}`);
  }

  alert(
    `TIQUETE ${codigo}\n` +
    `Cliente: ${cliente}\n\n` +
    `${construirListadoPedido(pedido)}\n` +
    `Subtotal: ${formatoPesos(totales.subtotal)}\n` +
    `Desc. grupo (${totales.porcentajeGrupo}%): -${formatoPesos(totales.descuentoGrupo)}\n` +
    `Desc. cupón (${totales.porcentajeCupon}%): -${formatoPesos(totales.descuentoCupon)}\n` +
    `Impoconsumo (${IMPOCONSUMO}%): +${formatoPesos(totales.impuesto)}\n\n` +
    `TOTAL: ${formatoPesos(totales.total)}\n` +
    `${pago.metodo} - ${pago.cuotas} cuota(s) de ${formatoPesos(pago.valorCuota)}\n` +
    (pago.metodo === "Efectivo" ? `Cambio: ${formatoPesos(pago.cambio)}\n` : "") +
    `\n¡Disfruta la función!`
  );
}

// ==========================================================
// CONTROL DE FLUJO - VENTA DE BOLETAS Y CONFITERÍA
// ==========================================================

// Pide el horario de una película. Retorna el horario o null.
function elegirHorario(pelicula, pedido) {
  const opcion = pedirEntero(construirMenuHorarios(pelicula, pedido), 1, pelicula.horarios.length);

  if (opcion === null) {
    return null;
  }

  const horario = pelicula.horarios[opcion - 1];
  const disponibles = horario.sillas - boletasEnFuncion(pedido, pelicula.id, horario.hora);

  if (disponibles <= 0) {
    alert(`La función de las ${horario.hora} está agotada.`);
    return null;
  }

  return horario;
}

// Pide el tipo de boleta. Retorna el tipo o null.
function elegirTipoBoleta(pelicula) {
  const opcion = pedirEntero(construirMenuTiposBoleta(pelicula), 1, TIPOS_BOLETA.length);

  if (opcion === null) {
    return null;
  }

  return TIPOS_BOLETA[opcion - 1];
}

function flujoComprarBoletas(lista, catalogo, pedido) {
  if (lista.length === 0) {
    alert("No hay películas en cartelera. Agrega una desde la opción 6.");
    return;
  }

  const opcion = pedirEntero(construirMenuCartelera(lista, catalogo), 1, lista.length);

  if (opcion === null) {
    return;
  }

  const pelicula = buscarPelicula(catalogo, lista[opcion - 1]);

  // CONDICIONAL: las películas con restricción piden la edad del espectador
  if (pelicula.edadMinima > 0) {
    const edad = pedirEntero(`"${pelicula.titulo}" es ${pelicula.clasificacion}.\n¿Cuál es la edad del espectador?`, 0, 120);

    if (edad === null) {
      return;
    }

    if (!esEdadPermitida(edad, pelicula.edadMinima)) {
      alert(`Lo sentimos, "${pelicula.titulo}" es ${pelicula.clasificacion}. El espectador no puede ingresar.`);
      console.log(`Venta rechazada: edad ${edad} no permitida para ${pelicula.titulo} (${pelicula.clasificacion})`);
      return;
    }
  }

  const horario = elegirHorario(pelicula, pedido);

  if (horario === null) {
    return;
  }

  const tipo = elegirTipoBoleta(pelicula);

  if (tipo === null) {
    return;
  }

  const disponibles = horario.sillas - boletasEnFuncion(pedido, pelicula.id, horario.hora);
  const cantidad = pedirEntero(
    `¿Cuántas boletas ${tipo.nombre}?\nSillas disponibles: ${disponibles}`,
    1,
    Math.min(disponibles, MAX_POR_COMPRA)
  );

  if (cantidad === null) {
    return;
  }

  agregarAlPedido(pedido, {
    clave: `boleta-${pelicula.id}-${horario.hora}-${tipo.nombre}`,
    tipo: "boleta",
    idPelicula: pelicula.id,
    titulo: pelicula.titulo,
    hora: horario.hora,
    tipoBoleta: tipo.nombre,
    cantidad: cantidad,
    precio: calcularPrecioBoleta(pelicula, tipo),
  });

  console.log(`Agregado: ${cantidad} boleta(s) ${tipo.nombre} - ${pelicula.titulo} (${horario.hora})`);
  alert(`${cantidad} boleta(s) ${tipo.nombre} para "${pelicula.titulo}" (${horario.hora}) agregadas al pedido.`);
}

function flujoAgregarCombo(listaCombos, pedido) {
  let menu = "CONFITERÍA\n";

  for (let i = 0; i < listaCombos.length; i++) {
    menu += `${i + 1}. ${listaCombos[i].nombre} - ${formatoPesos(listaCombos[i].precio)}\n`;
  }

  menu += `Escribe el número del producto (1-${listaCombos.length})`;

  const opcion = pedirEntero(menu, 1, listaCombos.length);

  if (opcion === null) {
    return;
  }

  const combo = listaCombos[opcion - 1];
  const cantidad = pedirEntero(`¿Cuántas unidades de "${combo.nombre}"? (1 a ${MAX_POR_COMPRA})`, 1, MAX_POR_COMPRA);

  if (cantidad === null) {
    return;
  }

  agregarAlPedido(pedido, {
    clave: `combo-${combo.id}`,
    tipo: "combo",
    nombre: combo.nombre,
    cantidad: cantidad,
    precio: combo.precio,
  });

  console.log(`Agregado: ${combo.nombre} x${cantidad}`);
  alert(`${combo.nombre} x${cantidad} agregado al pedido.`);
}

function flujoQuitarItem(pedido) {
  if (pedido.length === 0) {
    alert("Tu pedido está vacío, no hay nada que quitar.");
    return;
  }

  const opcion = pedirEntero(
    `¿Qué ítem deseas quitar?\n\n${construirListadoPedido(pedido)}\nEscribe el número (Cancelar para volver)`,
    1,
    pedido.length
  );

  if (opcion === null) {
    return;
  }

  const eliminado = pedido.splice(opcion - 1, 1)[0];
  console.log(`Ítem eliminado del pedido: ${construirDescripcionItem(eliminado)}`);
  alert("Ítem eliminado del pedido.");
}

// Retorna el cupón aplicado (o el que ya había si el código es inválido)
function flujoAplicarCupon(cuponActual) {
  const codigo = pedirTexto("Escribe el código del cupón:");

  if (codigo === null) {
    return cuponActual;
  }

  const porcentaje = validarCupon(codigo);

  if (porcentaje === 0) {
    alert(`El cupón "${codigo}" no es válido.`);
    return cuponActual;
  }

  alert(`Cupón ${codigo.toUpperCase()} aplicado: ${porcentaje}% de descuento extra.`);
  console.log(`Cupón aplicado: ${codigo.toUpperCase()} (${porcentaje}%)`);
  return { codigo: codigo.toUpperCase(), porcentaje: porcentaje };
}

// Retorna true si la compra se completó
function flujoFinalizarCompra(catalogo, pedido, cupon, nombre) {
  if (contarBoletas(pedido) === 0) {
    alert("Agrega al menos una boleta antes de finalizar la compra.");
    return false;
  }

  const totales = calcularTotales(pedido, cupon);

  const confirmar = confirmarSiNo(
    `RESUMEN\n${construirListadoPedido(pedido)}` +
    `Subtotal: ${formatoPesos(totales.subtotal)}\n` +
    `Desc. grupo (${totales.porcentajeGrupo}%): -${formatoPesos(totales.descuentoGrupo)}\n` +
    `Desc. cupón (${totales.porcentajeCupon}%): -${formatoPesos(totales.descuentoCupon)}\n` +
    `Impoconsumo (${IMPOCONSUMO}%): +${formatoPesos(totales.impuesto)}\n` +
    `Total: ${formatoPesos(totales.total)}\n` +
    `¿Deseas continuar con el pago?`
  );

  if (!confirmar) {
    return false;
  }

  const pago = elegirMetodoPago(totales.total);

  if (pago === null) {
    return false;
  }

  const tiquete = {
    codigo: `CA-${Date.now().toString().slice(-6)}`,
    cliente: nombre,
    pedido: pedido,
    totales: totales,
    pago: pago,
  };

  mostrarTiquete(tiquete);
  descontarSillas(catalogo, pedido);
  return true;
}

// ==========================================================
// PRE-ENTREGA 4 · ARRAYS - Gestión de la cartelera
// ==========================================================

function construirMenuGestion(lista) {
  return (
    `GESTIÓN DE CARTELERA (${lista.length} película(s))\n\n` +
    `1. Ver cartelera\n` +
    `2. Agregar película al final\n` +
    `3. Agregar como estreno (al inicio)\n` +
    `4. Retirar la última película\n` +
    `5. Retirar la primera película\n` +
    `6. Buscar una película\n` +
    `7. Reemplazar una película por posición\n` +
    `8. Volver al menú principal\n\n` +
    `Escribe el número de la opción`
  );
}

// Lista numerada de los elementos (usa for...of)
function construirListadoCartelera(lista) {
  let texto = "";
  let numero = 1;

  for (const titulo of lista) {
    texto += `${numero}. ${titulo}\n`;
    numero++;
  }

  return texto;
}

// FASE 3 · SALIDA - Reporte iterativo con for...of (consola + alert)
// @param {Array} lista -> muestra cada elemento con formato claro
function listarCartelera(lista) {
  if (lista.length === 0) {
    console.log("--- Cartelera: vacía ---");
    alert("La cartelera está vacía.");
    return;
  }

  console.log("--- Cartelera actual ---");
  for (const titulo of lista) {
    console.log(`Película: ${titulo}`);
  }
  console.log(`Total: ${lista.length} película(s)`);

  alert(`CARTELERA ACTUAL\n\n${construirListadoCartelera(lista)}\nTotal: ${lista.length} película(s)`);
}

// Elige una película del catálogo que NO esté en cartelera (valida con includes).
// Retorna el título o null.
function elegirTituloNuevo(lista, catalogo) {
  const disponibles = catalogo.filter((pelicula) => !lista.includes(pelicula.titulo));

  if (disponibles.length === 0) {
    alert("Todas las películas del catálogo ya están en cartelera.");
    return null;
  }

  let menu = "PELÍCULAS DISPONIBLES\n";

  for (let i = 0; i < disponibles.length; i++) {
    menu += `${i + 1}. ${disponibles[i].titulo} | ${disponibles[i].genero} | ${disponibles[i].clasificacion}\n`;
  }

  menu += "Escribe el número de la película";

  const opcion = pedirEntero(menu, 1, disponibles.length);

  if (opcion === null) {
    return null;
  }

  return disponibles[opcion - 1].titulo;
}

// push (al final) o unshift (al inicio, como estreno)
function flujoAgregarPelicula(lista, catalogo, alInicio) {
  const titulo = elegirTituloNuevo(lista, catalogo);

  if (titulo === null) {
    return;
  }

  if (alInicio) {
    lista.unshift(titulo);
    console.log(`Estreno agregado al inicio: ${titulo}`);
    alert(`"${titulo}" se agregó al inicio de la cartelera (estreno).`);
  } else {
    lista.push(titulo);
    console.log(`Película agregada al final: ${titulo}`);
    alert(`"${titulo}" se agregó al final de la cartelera.`);
  }
}

// pop (última) o shift (primera): el elemento eliminado se muestra en un mensaje
function flujoRetirarPelicula(lista, ultima) {
  if (lista.length === 0) {
    alert("La cartelera está vacía, no hay nada que retirar.");
    return;
  }

  const eliminada = ultima ? lista.pop() : lista.shift();

  console.log(`Se ha eliminado el elemento: ${eliminada}`);
  alert(`Se ha eliminado el elemento: ${eliminada}`);
}

// includes (¿existe?) + indexOf (¿en qué posición?)
function flujoBuscarPelicula(lista) {
  const entrada = pedirTexto("¿Qué película quieres buscar en la cartelera?");

  if (entrada === null) {
    return;
  }

  const buscado = normalizarTexto(entrada);
  const normalizada = lista.map((titulo) => normalizarTexto(titulo));

  if (normalizada.includes(buscado)) {
    const posicion = normalizada.indexOf(buscado);
    console.log(`"${lista[posicion]}" está en cartelera, en el índice ${posicion}`);
    alert(`"${lista[posicion]}" está en cartelera.\nPosición: ${posicion + 1} (índice ${posicion}).`);
  } else {
    console.log(`"${entrada}" no está en cartelera`);
    alert(`"${entrada}" no está en cartelera.`);
  }
}

// splice: reemplaza el elemento de un índice concreto sin afectar al resto
function flujoReemplazarPelicula(lista, catalogo) {
  if (lista.length === 0) {
    alert("La cartelera está vacía, no hay nada que reemplazar.");
    return;
  }

  const posicion = pedirEntero(
    `¿Qué posición deseas reemplazar?\n\n${construirListadoCartelera(lista)}\nEscribe el número de la posición`,
    1,
    lista.length
  );

  if (posicion === null) {
    return;
  }

  const nueva = elegirTituloNuevo(lista, catalogo);

  if (nueva === null) {
    return;
  }

  const indice = posicion - 1;
  const anterior = lista[indice];
  lista.splice(indice, 1, nueva);

  console.log(`Posición ${posicion}: "${anterior}" fue reemplazada por "${nueva}"`);
  alert(`Posición ${posicion} actualizada:\n"${anterior}" ahora es "${nueva}".`);
}

// Submenú de gestión de cartelera (ciclo + switch)
function gestionarCartelera(lista, catalogo) {
  let continuar = true;

  while (continuar) {
    const opcion = pedirEntero(construirMenuGestion(lista), 1, 8);

    if (opcion === null) {
      continuar = false;
    } else {
      switch (opcion) {
        case 1:
          listarCartelera(lista);
          break;
        case 2:
          flujoAgregarPelicula(lista, catalogo, false);
          break;
        case 3:
          flujoAgregarPelicula(lista, catalogo, true);
          break;
        case 4:
          flujoRetirarPelicula(lista, true);
          break;
        case 5:
          flujoRetirarPelicula(lista, false);
          break;
        case 6:
          flujoBuscarPelicula(lista);
          break;
        case 7:
          flujoReemplazarPelicula(lista, catalogo);
          break;
        case 8:
          continuar = false;
          break;
      }
    }
  }
}

// ==========================================================
// FUNCIÓN PRINCIPAL
// ==========================================================

function iniciarSimulador(catalogo, lista, listaCombos) {
  const pedido = [];
  let cupon = null;
  let compraFinalizada = false;
  let continuar = true;

  alert(
    "¡Bienvenido a Cine Aurora!\n\n" +
    "- Descuento por grupo: 5% desde 4 boletas, 10% desde 6, 15% desde 10\n" +
    "- Boleta Estudiante: 20% menos | Niño / Adulto mayor: 30% menos\n" +
    "- Formato 3D: +$5.000 por boleta\n" +
    "- Cupones: AURORA10, ESTRENO5, CINEFILO15"
  );

  const nombre = pedirTexto("¿Cómo se llama el cliente?");

  if (nombre === null) {
    alert("Simulador cancelado. ¡Hasta pronto!");
    return;
  }

  // CICLO PRINCIPAL: se repite hasta finalizar la compra o salir
  while (continuar) {
    const opcion = pedirEntero(construirMenuPrincipal(nombre, pedido, cupon), 1, 7);

    if (opcion === null) {
      continuar = !confirmarSiNo("¿Seguro que deseas salir del simulador?");
    } else {
      switch (opcion) {
        case 1:
          flujoComprarBoletas(lista, catalogo, pedido);
          break;
        case 2:
          flujoAgregarCombo(listaCombos, pedido);
          break;
        case 3:
          mostrarPedido(pedido);
          break;
        case 4:
          flujoQuitarItem(pedido);
          break;
        case 5:
          cupon = flujoAplicarCupon(cupon);
          break;
        case 6:
          gestionarCartelera(lista, catalogo);
          break;
        case 7:
          compraFinalizada = flujoFinalizarCompra(catalogo, pedido, cupon, nombre);
          continuar = !compraFinalizada;
          break;
      }
    }
  }

  if (!compraFinalizada) {
    console.log("Simulador finalizado sin completar la compra.");
    alert("Gracias por visitarnos, vuelve pronto.");
  }
}

// ==========================================================
// INVOCACIÓN DEL SIMULADOR
// El script se enlaza con defer, así que se ejecuta con el HTML ya
// cargado. Para reiniciar la simulación, recarga la página.
// ==========================================================

try {
  iniciarSimulador(catalogoPeliculas, cartelera, combos);
} catch (error) {
  console.error("Error en el simulador:", error);
  alert(`Ocurrió un error: ${error.message}\nRevisa la consola para más detalles.`);
}