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
  if (!terminos.checked) {
    alert("⚠️ Debes aceptar los términos para generar el presupuesto.");
    return;
  }

  const modal = document.getElementById("modalCarga");
  const barra = document.getElementById("barraCarga");
  modal.classList.remove("hidden");

  let progreso = 0;
  const t = setInterval(() => {
    progreso += 10;
    barra.style.width = progreso + "%";
    if (progreso >= 100) {
      clearInterval(t);
      modal.classList.add("hidden");
      ejecutarCalculosFinancieros();
    }
  }, 150);
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
    const precio = costoUniConInflacion * (1 + gananciaPct);
    const ingresoSemanal = precio * unidades;

    res[0].innerText = `$ ${(ingresoSemanal / 6).toFixed(2)}`;
    res[1].innerText = `$ ${ingresoSemanal.toFixed(2)}`;
    res[2].innerText = `$ ${(ingresoSemanal * 4).toFixed(2)}`;
    res[3].innerText = `$ ${(ingresoSemanal * 48).toFixed(2)}`;

    document.getElementById("labelPrincipal").innerText = "Precio Sugerido Detal";
    document.getElementById("resPrincipal").innerText = `$ ${precio.toFixed(2)}`;
    document.getElementById("resSecundario").innerText = `$ ${(precio * 0.8).toFixed(2)}`;
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
    const precioProyecto = costoTotalServ * (1 + gananciaPct);

    res[0].innerText = `$ ${(precioProyecto / 2).toFixed(2)}`;
    res[1].innerText = `$ ${precioProyecto.toFixed(2)}`;
    res[2].innerText = `$ ${(precioProyecto * proyectos).toFixed(2)}`;
    res[3].innerText = `$ ${(precioProyecto * proyectos * 12).toFixed(2)}`;

    document.getElementById("labelPrincipal").innerText = "Presupuesto Sugerido";
    document.getElementById("labelSecundario").innerText = "Tarifa Valor/Hora";
    document.getElementById("resPrincipal").innerText = `$ ${precioProyecto.toFixed(2)}`;
    document.getElementById("resSecundario").innerText =
      `$ ${(precioProyecto / (horas || 1)).toFixed(2)}`;
    document.getElementById("subtituloInforme").innerText = "Informe de Rentabilidad: Servicio";
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
