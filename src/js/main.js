let modoActual = "producto";

function cambiarModo(modo) {
  modoActual = modo;
  const btnProd = document.getElementById("btnModoProducto");
  const btnServ = document.getElementById("btnModoServicio");
  const secProd = document.getElementById("seccionProducto");
  const secServ = document.getElementById("seccionServicio");

  if (modo === "producto") {
    btnProd.className =
      "flex-1 py-3 rounded-xl font-bold transition-all bg-white dark:bg-blue-600 shadow text-blue-600 dark:text-white text-sm md:text-base";
    btnServ.className =
      "flex-1 py-3 rounded-xl font-bold transition-all text-gray-500 dark:text-gray-400 text-sm md:text-base";
    secProd.classList.remove("hidden");
    secServ.classList.add("hidden");
  } else {
    btnServ.className =
      "flex-1 py-3 rounded-xl font-bold transition-all bg-white dark:bg-blue-600 shadow text-blue-600 dark:text-white text-sm md:text-base";
    btnProd.className =
      "flex-1 py-3 rounded-xl font-bold transition-all text-gray-500 dark:text-gray-400 text-sm md:text-base";
    secServ.classList.remove("hidden");
    secProd.classList.add("hidden");
  }
}

function agregarFila() {
  const div = document.createElement("div");
  div.className =
    "grid grid-cols-12 gap-2 items-center bg-gray-50 dark:bg-gray-900/50 p-2 rounded-xl border dark:border-gray-700 animate-fade mt-2";
  div.innerHTML = `
        <input type="text" placeholder="Insumo" class="col-span-4 p-2 bg-transparent outline-none text-xs md:text-sm">
        <input type="number" placeholder="0" oninput="actualizarSubtotal(this)" class="col-span-2 p-2 bg-white dark:bg-gray-700 border rounded-lg text-center item-cant text-xs md:text-sm">
        <input type="number" placeholder="0" oninput="actualizarSubtotal(this)" class="col-span-3 p-2 bg-white dark:bg-gray-700 border rounded-lg text-center item-precio text-xs md:text-sm">
        <input type="text" value="0.00" class="col-span-2 text-right font-bold item-subtotal text-blue-500 text-xs md:text-sm" readonly>
        <button onclick="this.parentElement.remove()" class="col-span-1 text-red-400 text-xl">×</button>
    `;
  document.getElementById("listaInsumos").appendChild(div);
}

function actualizarSubtotal(input) {
  const fila = input.parentElement;
  const cant = parseFloat(fila.querySelector(".item-cant").value || 0);
  const precio = parseFloat(fila.querySelector(".item-precio").value || 0);
  fila.querySelector(".item-subtotal").value = (cant * precio).toFixed(2);
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

function ejecutarCalculosFinancieros() {
  let costoBase = 0;
  const luz = parseFloat(document.getElementById("luz").value || 0);
  const agua = parseFloat(document.getElementById("agua").value || 0);
  const gananciaPct = parseFloat(document.getElementById("ganancia").value || 30) / 100;
  const inflacionPct = parseFloat(document.getElementById("inflacion").value || 5) / 100;

  const labels = ["labelCol1", "labelCol2", "labelCol3", "labelCol4"].map((id) =>
    document.getElementById(id),
  );
  const res = ["resCol1", "resCol2", "resCol3", "resCol4"].map((id) => document.getElementById(id));

  let precioFinalCalculado = 0; // Variable para usar en la alerta de inflación

  if (modoActual === "producto") {
    document
      .querySelectorAll(".item-subtotal")
      .forEach((s) => (costoBase += parseFloat(s.value || 0)));
    const unidades = parseFloat(document.getElementById("unidadesProduccion").value || 1);

    labels[0].innerText = "POR DÍA";
    labels[1].innerText = "POR SEMANA";
    labels[2].innerText = "POR MES";
    labels[3].innerText = "POR AÑO";

    const costoUniConInflacion = ((costoBase + luz + agua) / unidades) * (1 + inflacionPct);
    precioFinalCalculado = costoUniConInflacion * (1 + gananciaPct);
    const ingresoSemanal = precioFinalCalculado * unidades;

    res[0].innerText = `$ ${(ingresoSemanal / 6).toFixed(2)}`;
    res[1].innerText = `$ ${ingresoSemanal.toFixed(2)}`;
    res[2].innerText = `$ ${(ingresoSemanal * 4).toFixed(2)}`;
    res[3].innerText = `$ ${(ingresoSemanal * 48).toFixed(2)}`;

    document.getElementById("labelPrincipal").innerText = "Precio Sugerido Detal";
    document.getElementById("resPrincipal").innerText = `$ ${precioFinalCalculado.toFixed(2)}`;
    document.getElementById("resSecundario").innerText =
      `$ ${(precioFinalCalculado * 0.8).toFixed(2)}`;
    document.getElementById("subtituloInforme").innerText = "Informe de Rentabilidad: Producto";
  } else {
    const pHora = parseFloat(document.getElementById("precioHora").value || 0);
    const horas = parseFloat(document.getElementById("horasProyecto").value || 0);
    const proyectos = parseFloat(document.getElementById("proyectosMes").value || 1);
    const trans = parseFloat(document.getElementById("gastoTransporte").value || 0);

    labels[0].innerText = "POR ENTREGA";
    labels[1].innerText = "POR PROYECTO";
    labels[2].innerText = "POR MES";
    labels[3].innerText = "POR AÑO";

    const costoTotalServ = (pHora * horas + trans + luz + agua) * (1 + inflacionPct);
    precioFinalCalculado = costoTotalServ * (1 + gananciaPct);

    res[0].innerText = `$ ${(precioFinalCalculado / 2).toFixed(2)}`;
    res[1].innerText = `$ ${precioFinalCalculado.toFixed(2)}`;
    res[2].innerText = `$ ${(precioFinalCalculado * proyectos).toFixed(2)}`;
    res[3].innerText = `$ ${(precioFinalCalculado * proyectos * 12).toFixed(2)}`;

    document.getElementById("labelPrincipal").innerText = "Presupuesto Sugerido";
    document.getElementById("labelSecundario").innerText = "Tarifa Valor/Hora";
    document.getElementById("resPrincipal").innerText = `$ ${precioFinalCalculado.toFixed(2)}`;
    document.getElementById("resSecundario").innerText =
      `$ ${(precioFinalCalculado / (horas || 1)).toFixed(2)}`;
    document.getElementById("subtituloInforme").innerText = "Informe de Rentabilidad: Servicio";
  }

  // --- LÓGICA DE ALERTA DE INFLACIÓN MEJORADA ---
  const alertaDiv = document.getElementById("alertaInflacion");
  const inflacionReal = (inflacionPct * 100).toFixed(1); // Redondeo a 1 decimal

  if (inflacionReal > 10) {
    // NIVEL 3: CRÍTICO (Más de 10%)
    const precioProteccion = precioFinalCalculado * 1.05;
    alertaDiv.innerHTML = `
      <div class="flex flex-col gap-2">
        <span class="text-red-500 dark:text-yellow-400 font-black tracking-widest uppercase text-xs">⚠️ Riesgo Inflacionario Alto</span>
        <p class="text-sm text-gray-700 dark:text-gray-200">
          La inflación configurada (${inflacionReal}%) es elevada. Si los costos suben más de lo previsto, 
          te sugerimos un precio de protección de <strong class="text-black dark:text-white text-lg">$ ${precioProteccion.toFixed(2)}</strong>.
        </p>
      </div>
    `;
    alertaDiv.classList.remove("hidden");
  } else if (inflacionReal > 5) {
    // NIVEL 2: PRECAUCIÓN (Entre 5.1% y 10%)
    const precioSugeridoSutil = precioFinalCalculado * 1.02; // 2% de colchón
    alertaDiv.innerHTML = `
      <div class="flex flex-col gap-2">
        <span class="text-blue-500 font-black tracking-widest uppercase text-xs">ℹ️ Ajuste por Inflación Moderada</span>
        <p class="text-sm text-gray-700 dark:text-gray-200">
          Con una inflación del ${inflacionReal}%, podrías considerar redondear el precio a 
          <strong class="text-black dark:text-white text-lg">$ ${precioSugeridoSutil.toFixed(2)}</strong> 
          para absorber pequeños aumentos en los insumos sin afectar tu ganancia.
        </p>
      </div>
    `;
    alertaDiv.classList.remove("hidden");
  } else {
    // NIVEL 1: ESTABLE (5% o menos)
    alertaDiv.innerHTML = `
      <p class="text-xs opacity-70 italic text-gray-600 dark:text-gray-400">
        ✅ Análisis basado en una economía estable (${inflacionReal}% de inflación). Los márgenes de ganancia están bien protegidos.
      </p>
    `;
  }

  document.getElementById("pdfNombreNegocio").innerText =
    document.getElementById("inputNegocio").value || "MI NEGOCIO";
  document.getElementById("pdfLogo").innerText = (
    document.getElementById("inputLogo").value || "LP"
  ).toUpperCase();
  document.getElementById("pdfFecha").innerText = "Fecha: " + new Date().toLocaleDateString();

  document.getElementById("resultado").classList.remove("hidden");
  document.getElementById("resultado").scrollIntoView({ behavior: "smooth" });
}
