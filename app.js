//! variables y selectores
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");

//! eventos
eventListener();
function eventListener() {
  document.addEventListener("DOMContentLoaded", preguntarPresupuesto);

  formulario.addEventListener("submit", agregarGasto);
}

//!clases

//! CLASE PRESUPUESTO
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoGasto(gasto) {
    //*copiamos el valor de thisgastos que vacio y le agregamos nuevos elementos del parametro que trae al llamar la funcion
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
  }

  calcularRestante() {
    //*reduce lo que hace es coger los valores de los elemtos del array sumarlos. el otro valor que es 0 es la posicion en donde va empezar
    const gastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );
    this.restante = this.presupuesto - gastado;
  }

  eliminarGasto(id) {
    //*con el filter traemos todo menos el id por lo cual el gasto se eliminara del objeto
    this.gastos = this.gastos.filter((gasto) => gasto.id !== id);

    //*
    this.calcularRestante();
  }
}

//! CLASE UI
class UI {
  //*insertar datos al presupuesto
  insertarPresupuesto(cantidad) {
    //*extraemos el valor
    const { presupuesto, restante } = cantidad;

    //*agregar al HTML
    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
  }

  //! ALERTAS
  imprimirAlerta(mensaje, tipo) {
    //creacion del div agregando clases de bootstrap
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert");

    //*validacion si se da error
    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    //*mensaje de error
    divMensaje.textContent = mensaje;

    //*Insert en el html. lo inserta antes del form
    document.querySelector(".primario").insertBefore(divMensaje, formulario);

    //*quitar el html
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }

  //! AGREGAR GASTOS
  agregarGastoListado(gastos) {
    //*limpiar el html previo
    this.limpiarHTML();

    //*Iterar con gasto. imprimir
    gastos.forEach((gasto) => {
      const { cantidad, nombreGasto, id } = gasto;

      //* crear un LI
      const nuevoGasto = document.createElement("li");

      //*clasname permite agregar varias clases a un elemnto. mientra classlist solo puede agregar una clase y si quiere agregar otra debe poner comas
      nuevoGasto.className =
        "list-group-item d-flex justify-content-between align-items-center";

      //*nuevoGasto.setAttribute("data-id", id); - agregar un nuevo atributo en el html pero es version vieja de javascript
      //*dataset.nombre el que quiera
      nuevoGasto.dataset.id = id;

      //*Agregar el HTML del gasto
      nuevoGasto.innerHTML = `
      ${nombreGasto} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>
      `;

      //*BOTON para borrar el gasto
      const btnBorrar = document.createElement("button");

      btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");

      btnBorrar.innerHTML = ` Borrar &times; `;

      //*Eliminar un gasto
      btnBorrar.onclick = () => {
        eliminarGasto(id);
      };

      //*agregar el boton de borrar al html
      nuevoGasto.appendChild(btnBorrar);

      //*Agregar al HMTL
      gastoListado.appendChild(nuevoGasto);
    });
  }

  //! Limpiar HTML
  limpiarHTML() {
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);
    }
  }

  //! ACTUALIZAR RESTANTE
  actualizarRestante(restante) {
    document.querySelector("#restante").textContent = restante;
  }

  //*se colocar Obj para que no error al parametro
  comprobarPresupuesto(presupuestoObj) {
    //*extraemos los elementos
    const { presupuesto, restante } = presupuestoObj;

    //*se;alamos el div
    const restanteDiv = document.querySelector(".restante");

    //* comprobar 75%
    if (presupuesto / 4 > restante) {
      //* quitar la clase succes cuando llega al 75 % y la clase alert-warning que es cuando en los gastos va agregando hasta llegar el 75
      restanteDiv.classList.remove("alert-success", "alert-warning");
      restanteDiv.classList.add("alert-danger");

      //*comprobar el 50%
    } else if (presupuesto / 2 > restante) {
      restanteDiv.classList.remove("alert-success");
      restanteDiv.classList.add("alert-warning");

      //*cuando no sobrepasa los 50 % de gastos
    } else {
      restanteDiv.classList.remove("alert-danger", "alert-warning");
      restanteDiv.classList.add("alert-success");
    }

    //*si el total es 0 o menor
    if (restante <= 0) {
      //*damos un mensaje
      ui.imprimirAlerta("El presupuesto se ha agotado", "error");

      //*desactivamos el boton de agregar gastos
      formulario.querySelector('button[type="submit"]').disabled = true;
    } else {
      formulario.querySelector('button[type="submit"]').disabled = false;
    }
  }
}

//! INSTANCIAS DE CLASES

let presupuesto;

const ui = new UI();

//! FUNCIONES

//*Preguntar presupuesto
function preguntarPresupuesto() {
  const presupuestoUsuario = prompt("Cual es tu Presupuesto");

  //*validacion vacios, caracteres y numero negativos
  if (
    presupuestoUsuario === "" ||
    presupuestoUsuario === null ||
    isNaN(presupuestoUsuario) ||
    presupuestoUsuario <= 0
  ) {
    window.location.reload();
  }

  presupuesto = new Presupuesto(presupuestoUsuario);

  ui.insertarPresupuesto(presupuesto);
}

//*anadir gastos
function agregarGasto(e) {
  e.preventDefault();

  //*leer datos de los input
  const nombreGasto = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);

  //*validar input vacios, valor menores o cero y no darle null a letras
  if (nombreGasto === "" || cantidad === "") {
    ui.imprimirAlerta("Ambos campos son obligatorio", "error");
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta("Cantidad no valida", "error");
    return;
  }

  //*generar un objeto con el gasto // es un objetc constructor. osea que creamos un nuevo objeto y lo otro es extraer los datos de una fucnion const {datos} = extraccion
  //*nombre gasto y cantidad no hay que agrear un elemento por que son iguales mientra id: datenow es un elemento que va cambiando
  const gasto = { nombreGasto, cantidad, id: Date.now() };

  //*anade un nuevo gasto
  presupuesto.nuevoGasto(gasto);

  //*imprimos un mensaje a la funcion de imprimir alerta y el tipo como llegara vacio entonces se cumplira el else del clases que agrega a los mensajes
  ui.imprimirAlerta("Correcto");

  //*imprimir los gastos
  const { gastos, restante } = presupuesto;

  //*agregar gastos al listado
  ui.agregarGastoListado(gastos);

  //*actualizar el valor del restante
  ui.actualizarRestante(restante);

  //*Comprobar presupuesto le pasamos presupuesto al objeto
  ui.comprobarPresupuesto(presupuesto);

  //*limpiar el formulario
  formulario.reset();
}

//! funcion de eliminar Gastos

function eliminarGasto(id) {
  //*elimina los gastos desde el objeto
  presupuesto.eliminarGasto(id);

  //* elimina los gastos en el html
  const { gastos, restante } = presupuesto;
  ui.agregarGastoListado(gastos);

  //*actualizar el valor del restante - se vuelven a llamar para actualizar lo eliminado
  ui.actualizarRestante(restante);

  //*Comprobar presupuesto le pasamos presupuesto al objeto -se vuelven a llamar para actualizar lo eliminado
  ui.comprobarPresupuesto(presupuesto);
}
