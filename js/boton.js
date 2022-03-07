function seleccionarYcopiar() {

    document.querySelector("#boton2").onclick = function () {
        document.querySelector("#textarea2").select();
        document.execCommand("copy");
    }
}
