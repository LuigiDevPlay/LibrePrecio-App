let modoActual = "producto";

function cambiarModo(modo) {
  modoActual = modo;
  const btnProd = document.getElementById("btnModoProducto");
  const btnServ = document.getElementById("btnModoServicio");
  const secProd = document.getElementById("seccionProducto");
  const secServ = document.getElementById("seccionServicio");
  const contTransporte = document.getElementById("contenedorTransporte");

  if (modo === "producto") {
    btnProd.className =
      "flex-1 py-3 rounded-xl font-bold transition-all bg-white dark:bg-blue-600 shadow text-blue-600 dark:text-white text-sm md:text-base cursor-pointer";
    btnServ.className =
      "flex-1 py-3 rounded-xl font-bold transition-all text-gray-500 dark:text-gray-400 text-sm md:text-base cursor-pointer";
    secProd.classList.remove("hidden");
    secServ.classList.add("hidden");
    contTransporte.classList.remove("hidden");
  } else {
    btnServ.className =
      "flex-1 py-3 rounded-xl font-bold transition-all bg-white dark:bg-blue-600 shadow text-blue-600 dark:text-white text-sm md:text-base cursor-pointer";
    btnProd.className =
      "flex-1 py-3 rounded-xl font-bold transition-all text-gray-500 dark:text-gray-400 text-sm md:text-base cursor-pointer";
    secServ.classList.remove("hidden");
    secProd.classList.add("hidden");

    contTransporte.classList.add("hidden");
  }
}

function agregarFila() {
  const div = document.createElement("div");
  div.className =
    "grid grid-cols-12 gap-2 items-center bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border dark:border-gray-700 animate-fade mt-3 shadow-sm";
  div.innerHTML = `
    <div class="col-span-10 md:col-span-4">
       <label class="block text-[8px] md:text-[10px] uppercase text-gray-400 font-bold mb-1">Insumo / Concepto</label>
       <input type="text" placeholder="Ej. Harina de Trigo" class="w-full p-2 bg-transparent outline-none text-xs md:text-sm font-medium dark:text-white">
    </div>
    
    <button onclick="this.parentElement.remove()" class="col-span-2 md:col-span-1 text-red-400 text-2xl hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg md:order-last self-end pb-1 cursor-pointer">×</button>
    
    <div class="col-span-4 md:col-span-2">
      <label class="block text-[8px] md:text-[10px] uppercase text-gray-400 font-bold mb-1">
        <span class="md:hidden">Cant.</span><span class="hidden md:inline">Cantidad</span>
      </label>
      <input type="number" placeholder="0" oninput="actualizarSubtotal(this)" class="w-full p-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg text-center item-cant text-xs md:text-sm dark:text-white">
    </div>

    <div class="col-span-4 md:col-span-2">
      <label class="block text-[8px] md:text-[10px] uppercase text-gray-400 font-bold mb-1">
        <span class="md:hidden">Precio</span><span class="hidden md:inline">Precio Product.</span>
      </label>
      <input type="number" placeholder="0.00" oninput="actualizarSubtotal(this)" class="w-full p-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg text-center item-precio text-xs md:text-sm dark:text-white">
    </div>

    <div class="col-span-4 md:col-span-3">
      <label class="block text-[8px] md:text-[10px] uppercase text-gray-400 font-bold mb-1 text-right">
        <span class="md:hidden">Total</span><span class="hidden md:inline">Total SubFila</span>
      </label>
      <input type="text" value="0.00" class="w-full p-2 text-right font-black item-subtotal text-blue-600 dark:text-blue-400 text-xs md:text-sm bg-blue-50/50 dark:bg-blue-900/20 border border-blue-400 dark:border-blue-800 rounded-lg" readonly>
    </div>
  `;
  document.getElementById("listaInsumos").appendChild(div);
}

function actualizarSubtotal(el) {
  const fila = el.closest(".grid");
  const cant = parseFloat(fila.querySelector(".item-cant").value || 0);
  const precio = parseFloat(fila.querySelector(".item-precio").value || 0);
  const subtotal = cant * precio;
  fila.querySelector(".item-subtotal").value = subtotal.toFixed(2);
}

function toggleTransporte() {
  document
    .getElementById("divTransporte")
    .classList.toggle(
      "hidden",
      document.getElementById("modalidadServicio").value !== "presencial",
    );
}

function toggleDarkMode() {
  document.getElementById("mainHtml").classList.toggle("dark");
}

function iniciarProceso() {
  const terminos = document.getElementById("checkTerminos");

  // VALIDACIÓN CON MODAL PERSONALIZADO
  if (!terminos.checked) {
    // En lugar del alert, mostramos el modal que añadimos al index.html
    const modalAviso = document.getElementById("modalTerminos");
    modalAviso.classList.remove("hidden");
    return; // Detenemos la ejecución
  }

  // SI LOS TÉRMINOS ESTÁN MARCADOS, PROCEDEMOS CON LA CARGA
  const modalCarga = document.getElementById("modalCarga");
  const barra = document.getElementById("barraCarga");

  // Reiniciamos la barra por si se usa varias veces
  barra.style.width = "0%";
  modalCarga.classList.remove("hidden");

  let progreso = 0;
  const t = setInterval(() => {
    progreso += 10;
    barra.style.width = progreso + "%";

    if (progreso >= 100) {
      clearInterval(t);
      modalCarga.classList.add("hidden");

      // Llamamos a la función de cálculos que ya tiene la lógica de inflación
      ejecutarCalculosFinancieros();
    }
  }, 150); // 1.5 segundos de carga total
}

function agregarFilaAdicional() {
  const div = document.createElement("div");
  div.className = "grid grid-cols-12 gap-2 items-center animate-fade";
  div.innerHTML = `
    <input type="text" placeholder="Ej: Gas o Publicidad" class="col-span-7 p-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg text-xs dark:text-white">
    <input type="number" placeholder="0.00" class="col-span-4 p-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg text-center text-xs dark:text-white item-extra-valor">
    <button onclick="this.parentElement.remove()" class="col-span-1 text-red-400 text-xl cursor-pointer">×</button>
  `;
  document.getElementById("listaAdicionales").appendChild(div);
}

function ejecutarCalculosFinancieros() {
  // --- VARIABLES DE CONTROL INICIAL ---
  let costoBaseInsumos = 0;
  let inversionTotalBruta = 0;
  let precioFinalCalculado = 0;

  // 1. CAPTURA DE VALORES COMUNES
  const gananciaPct = parseFloat(document.getElementById("ganancia").value || 30) / 100;
  const inflacionPct = parseFloat(document.getElementById("inflacion").value || 5) / 100;

  // Gastos Fijos
  const luz = parseFloat(document.getElementById("luz").value || 0);
  const agua = parseFloat(document.getElementById("agua").value || 0);
  const internet = parseFloat(document.getElementById("internet").value || 0);
  const telefono = parseFloat(document.getElementById("telefono").value || 0);

  // Gastos Adicionales (Check)
  let totalAdicionales = 0;
  const checkAdi = document.getElementById("checkAdicionales");
  if (checkAdi && checkAdi.checked) {
    document.querySelectorAll(".item-extra-valor").forEach((input) => {
      totalAdicionales += parseFloat(input.value || 0);
    });
  }

  // Referencias UI
  const res = ["resCol1", "resCol2", "resCol3", "resCol4"].map((id) => document.getElementById(id));
  const labels = ["labelCol1", "labelCol2", "labelCol3", "labelCol4"].map((id) =>
    document.getElementById(id),
  );
  const cuerpoTablaPdf = document.getElementById("pdfListaItems");

  // Limpiamos la tabla del PDF antes de empezar
  cuerpoTablaPdf.innerHTML = "";

  // --- MODO PRODUCTO ---
  if (modoActual === "producto") {
    const filasInsumos = document.querySelectorAll("#listaInsumos > div");
    costoBaseInsumos = 0; // Reiniciar para evitar sumas duplicadas

    filasInsumos.forEach((fila, index) => {
      const nombre = fila.querySelector('input[type="text"]').value || "Insumo";
      const cant = parseFloat(fila.querySelector(".item-cant").value || 0);
      const subtotal = parseFloat(fila.querySelector(".item-subtotal").value || 0);

      // CALCULAR PRECIO UNITARIO PARA LA COLUMNA
      const precioUnitario = cant > 0 ? subtotal / cant : 0;
      costoBaseInsumos += subtotal;

      cuerpoTablaPdf.innerHTML += `
        <tr class="border-b border-gray-100 dark:border-gray-800">
          <td class="p-2 text-blue-600 font-black text-[9px] bg-blue-50/50">${index + 1}</td>
          <td class="p-2 font-bold text-[10px] text-gray-700 dark:text-gray-200">${nombre}</td>
          <td class="p-2 text-center text-[10px] text-gray-500">${cant}</td>
          <td class="p-2 text-center text-[10px] text-gray-500">$${precioUnitario.toFixed(2)}</td>
          <td class="p-2 text-right font-black text-[10px] text-blue-900 dark:text-blue-300">$${subtotal.toFixed(2)}</td>
        </tr>`;
    });

    const gastosFijosTotales = luz + agua + internet + telefono + totalAdicionales;
    if (gastosFijosTotales > 0) {
      cuerpoTablaPdf.innerHTML += `
        <tr class="border-b border-gray-100 dark:border-gray-800 bg-gray-50/30">
          <td class="p-2 text-blue-600 font-black text-[9px] bg-blue-50/50">+</td>
          <td class="p-2 font-bold text-[10px] text-gray-700 dark:text-gray-200">Gastos Operativos y Fijos</td>
          <td class="p-2 text-center text-[10px] text-gray-500">1</td>
          <td class="p-2 text-center text-[10px] text-gray-500">Mes</td>
          <td class="p-2 text-right font-black text-[10px] text-blue-900 dark:text-blue-300">$${gastosFijosTotales.toFixed(2)}</td>
        </tr>`;
    }

    const transporteGlobal = parseFloat(document.getElementById("transporteGlobal").value || 0);
    if (transporteGlobal > 0) {
      cuerpoTablaPdf.innerHTML += `
        <tr class="border-b border-gray-100 dark:border-gray-800">
          <td class="p-2 text-blue-600 font-black text-[9px] bg-blue-50/50">+</td>
          <td class="p-2 font-bold text-[10px] text-gray-700 dark:text-gray-200">Transporte Global</td>
          <td class="p-2 text-center text-[10px] text-gray-500">1</td>
          <td class="p-2 text-center text-[10px] text-gray-500">Viaje</td>
          <td class="p-2 text-right font-black text-[10px] text-blue-900 dark:text-blue-300">$${transporteGlobal.toFixed(2)}</td>
        </tr>`;
    }

    const unidades = parseFloat(document.getElementById("unidadesProduccion").value || 1);
    inversionTotalBruta = costoBaseInsumos + gastosFijosTotales + transporteGlobal;

    const costoUniConInflacion = (inversionTotalBruta / unidades) * (1 + inflacionPct);
    precioFinalCalculado = costoUniConInflacion * (1 + gananciaPct);

    // Proyecciones Pantalla
    const ingresoSemanal = precioFinalCalculado * unidades;
    res[0].innerText = `$ ${(ingresoSemanal / 6).toFixed(2)}`;
    res[1].innerText = `$ ${ingresoSemanal.toFixed(2)}`;
    res[2].innerText = `$ ${(ingresoSemanal * 4).toFixed(2)}`;
    res[3].innerText = `$ ${(ingresoSemanal * 48).toFixed(2)}`;

    labels[0].innerText = "POR DÍA";
    labels[1].innerText = "POR SEMANA";
    labels[2].innerText = "POR MES";
    labels[3].innerText = "POR AÑO";

    document.getElementById("pdfCantFinal").innerText = `${unidades} Unds.`;
    document.getElementById("subtituloInforme").innerText = "Informe de Rentabilidad: Producto";
  }
  // --- MODO SERVICIO ---
  else {
    const precioHora = parseFloat(document.getElementById("precioHora").value || 0);
    const horasProyecto = parseFloat(document.getElementById("horasProyecto").value || 0);
    const proyectosMes = parseFloat(document.getElementById("proyectosMes").value || 1);
    const modalidad = document.getElementById("modalidadServicio").value;
    const gastoTraslado = parseFloat(document.getElementById("gastoTransporte").value || 0);

    const inversionEnTiempo = precioHora * horasProyecto;
    const gastosOperativosProrrateados = luz + agua + internet + telefono + totalAdicionales;
    inversionTotalBruta = inversionEnTiempo + gastosOperativosProrrateados + gastoTraslado;

    const costoConInflacion = inversionTotalBruta * (1 + inflacionPct);
    precioFinalCalculado = costoConInflacion * (1 + gananciaPct);

    cuerpoTablaPdf.innerHTML = `
      <tr class="border-b border-gray-100 dark:border-gray-800">
        <td class="p-2 text-blue-600 font-black text-[9px] bg-blue-50/50">1</td>
        <td class="p-2 font-bold text-[10px] text-gray-700 dark:text-gray-200">Mano de Obra (${horasProyecto} hrs x $${precioHora})</td>
        <td class="p-2 text-center text-[10px] text-gray-500">1</td>
        <td class="p-2 text-center text-[10px] text-gray-500">$${inversionEnTiempo.toFixed(2)}</td>
        <td class="p-2 text-right font-black text-[10px] text-blue-900">$${inversionEnTiempo.toFixed(2)}</td>
      </tr>
      <tr class="border-b border-gray-100 dark:border-gray-800">
        <td class="p-2 text-blue-600 font-black text-[9px] bg-blue-50/50">2</td>
        <td class="p-2 font-bold text-[10px] text-gray-700 dark:text-gray-200">Gastos Operativos</td>
        <td class="p-2 text-center text-[10px] text-gray-500">1</td>
        <td class="p-2 text-center text-[10px] text-gray-500">$${gastosOperativosProrrateados.toFixed(2)}</td>
        <td class="p-2 text-right font-black text-[10px] text-blue-900">$${gastosOperativosProrrateados.toFixed(2)}</td>
      </tr>
      ${
        modalidad === "presencial"
          ? `
      <tr class="border-b border-gray-100 dark:border-gray-800">
        <td class="p-2 text-blue-600 font-black text-[9px] bg-blue-50/50">3</td>
        <td class="p-2 font-bold text-[10px] text-gray-700 dark:text-gray-200">Transporte</td>
        <td class="p-2 text-center text-[10px] text-gray-500">1</td>
        <td class="p-2 text-center text-[10px] text-gray-500">$${gastoTraslado.toFixed(2)}</td>
        <td class="p-2 text-right font-black text-[10px] text-blue-900">$${gastoTraslado.toFixed(2)}</td>
      </tr>`
          : ""
      }
    `;

    const ingresoMensual = precioFinalCalculado * proyectosMes;
    res[0].innerText = `$ ${(ingresoMensual / 22).toFixed(2)}`;
    res[1].innerText = `$ ${precioFinalCalculado.toFixed(2)}`;
    res[2].innerText = `$ ${ingresoMensual.toFixed(2)}`;
    res[3].innerText = `$ ${(ingresoMensual * 12).toFixed(2)}`;

    labels[0].innerText = "POR DÍA";
    labels[1].innerText = "POR PROYECTO";
    labels[2].innerText = "POR MES";
    labels[3].innerText = "POR AÑO";

    document.getElementById("subtituloInforme").innerText = "Informe de Rentabilidad: Servicio";
  }

  // --- RESULTADOS COMUNES (ACTUALIZACIÓN DE MARCA Y PDF) ---
  const nombreNegocioVal = document.getElementById("inputNegocio").value || "MI NEGOCIO";
  const inicialesLogoVal = document.getElementById("inputLogo").value || "$";

  // Actualizar Texto de Marca en el PDF
  document.getElementById("pdfNombreNegocio").innerText = nombreNegocioVal.toUpperCase();
  const logoPdfElement = document.getElementById("pdfLogoTexto");
  if (logoPdfElement) {
    logoPdfElement.innerText = inicialesLogoVal.toUpperCase();
  }

  // Totales Finales
  document.getElementById("resPrincipal").innerText = `$ ${precioFinalCalculado.toFixed(2)}`;
  document.getElementById("pdfTotalInversion").innerText = `$ ${inversionTotalBruta.toFixed(2)}`;
  document.getElementById("pdfPrecioTotalFinal").innerText = `$ ${precioFinalCalculado.toFixed(2)}`;
  document.getElementById("pdfFecha").innerText = "Emisión: " + new Date().toLocaleDateString();

  // --- LÓGICA DE ALERTA DE INFLACIÓN ---
  const alertaDiv = document.getElementById("alertaInflacion");
  const pdfSugerenciaCont = document.getElementById("pdfSugerenciaContenedor");
  const pdfSugerenciaTexto = document.getElementById("pdfSugerenciaTexto");

  const valorInflacion = inflacionPct * 100;
  const precioAjustado = precioFinalCalculado * (1 + inflacionPct);

  let mensajeWeb = "";
  let textoPDF = "";
  let claseColor = "";

  if (valorInflacion < 5) {
    mensajeWeb = `✅ Inflación estable (${valorInflacion.toFixed(1)}%).`;
    claseColor = "bg-green-50 text-green-700 border-green-100";
  } else if (valorInflacion <= 10) {
    mensajeWeb = `⚠️ Inflación moderada. Sugerido: $${precioAjustado.toFixed(2)}`;
    textoPDF = `Sugerencia: Debido a la inflación (${valorInflacion.toFixed(1)}%), se recomienda un ajuste a $${precioAjustado.toFixed(2)}.`;
    claseColor = "bg-yellow-50 text-yellow-700 border-yellow-100";
  } else {
    mensajeWeb = `🚨 ALERTA CRÍTICA. Sugerido: $${precioAjustado.toFixed(2)}`;
    textoPDF = `¡ALERTA DE RENTABILIDAD! Con un ${valorInflacion.toFixed(1)}% de inflación, el precio debería ser $${precioAjustado.toFixed(2)}.`;
    claseColor = "bg-red-50 text-red-700 border-red-100 animate-pulse";
  }

  alertaDiv.className = "mt-4 text-center px-4 no-print";
  alertaDiv.innerHTML = `<div class="p-3 rounded-xl text-xs font-bold border ${claseColor}">${mensajeWeb}</div>`;

  if (valorInflacion >= 5 && pdfSugerenciaCont) {
    pdfSugerenciaCont.classList.remove("hidden");
    pdfSugerenciaTexto.innerText = textoPDF;
  } else if (pdfSugerenciaCont) {
    pdfSugerenciaCont.classList.add("hidden");
  }

  // Mostrar contenedor de resultados
  document.getElementById("resultado").classList.remove("hidden");
  document.getElementById("resultado").scrollIntoView({ behavior: "smooth" });
}
