var mostrarResultado = document.getElementById("resultado");
const complexVar = document.createTextNode("----<xs:complexType>");
const sequenceVar = document.createTextNode("--------<xs:sequence>");
const complexVarC = document.createTextNode("</xs:complexType>");
const sequenceVarC = document.createTextNode("</xs:sequence>");



var arrayTempRepetidos = [];

// comentario

function main() {
    var contenidoArea = document.getElementsByTagName("textarea")[0].value;

    const parseador = new DOMParser();

    const documentoXML = parseador.parseFromString(contenidoArea, "text/xml");

    //const elemento_padre = documentoXML.documentElement;

    /* inicializar schema */
    mostrarResultado.appendChild(document.createTextNode("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>"));
    mostrarResultado.innerHTML += "<br>";
    mostrarResultado.appendChild(document.createTextNode("<xs:schema xmlns:xs=\"http://www.w3.org/2001/XMLSchema\">"));
    mostrarResultado.innerHTML += "<br>";
    /* inicializar schema */
    //const array_hijos = documentoXML.documentElement.childNodes;


    leerTree(documentoXML);
}


function leerTree(elemento) {

    var newChilds = elemento.children;
    console.log("Hijos de " + elemento.nodeName);
    for (var i = 0; i < newChilds.length; i++) {
        if (newChilds[i].children.length > 0) {
            if (!arrayTempRepetidos.includes(newChilds[i].nodeName)) {
                console.log("Defino al padre AQUI " + newChilds[i].nodeName);
                mostrarResultado.appendChild(document.createTextNode("<xs:element name=\"" + newChilds[i].nodeName + "\">"));
                checkPadres(newChilds[i], elemento);
                mostrarResultado.innerHTML += "<br>";

                leerTree(newChilds[i]);
            }

        }
        else if (!arrayTempRepetidos.includes(newChilds[i].nodeName)) {
            console.log("Defino a un hijo de " + elemento.nodeName + " aqui " + newChilds[i].nodeName);
            mostrarResultado.innerHTML += "<br>";
            mostrarResultado.appendChild(document.createTextNode("--------------<xs:element name=\"" + newChilds[i].nodeName + "\" type=\"xs:string\"/>"));
            mostrarResultado.innerHTML += "<br>";
        }
    }


}



function secuenciaCaso(elemento) {
    if (elemento.nodeName = "hola") {
        console.log("entra el elemento padre hola " + elemento.children.length);
    }
    if (elemento.children.length > 0) {
        leerTree(elemento);
    }
    else {
        console.log("entro aki con " + elemento.nodeName);
        mostrarResultado.innerHTML += "<br>";
        mostrarResultado.appendChild(document.createTextNode("--------------<xs:element name=\"" + elemento.nodeName + "\" type=\"xs:string\"/>"));
        mostrarResultado.innerHTML += "<br>";
    }
}

function checkPadres(newChilds, elemento) {
    const array_padres = elemento.getElementsByTagName(newChilds.nodeName);
    var num = array_padres.length;


    if (num > 1) {

        var array = [];

        var arrayTemp = [];

        for (var x = 0; x < newChilds.children.length; x++) {
            checkElemento(array_padres, newChilds.children[x], array, arrayTemp);
        }

        console.log("------- Array resultado ------");
        array.forEach(element => console.log(element));
        console.log("------- Array resultado ------");

        ponerNombres(array_padres, array, arrayTemp);


        console.log("------- Array elementos prohibidos ------");
        arrayTempRepetidos.forEach(element => console.log(element));
        console.log("------- Array elementos prohibidos ------");

        //leerTree(array_padres[0]);
        // arrayTempRepetidos.push(newChilds.nodeName);
    }
}

function checkElemento(array_padres, elementoC, array, arrayTemp) {
    var contador = 0;
    for (var i = 0; i < array_padres.length; i++) {
        for (var j = 0; j < array_padres[i].children.length; j++) {
            if (array_padres[i].children[j].nodeName == elementoC.nodeName) {
                contador++;
                console.log("contador de repeticiones de " + elementoC.nodeName + " " + contador);
            }
        }
    }
    if (contador == array_padres.length) {
        array.push(elementoC.nodeName);
        arrayTemp.push(elementoC);
        arrayTempRepetidos.push(elementoC.nodeName, elementoC.parentNode.nodeName);
    }
    else {
        console.log("no hay secuencia de " + elementoC.nodeName);
    }
}

function ponerNombres(array_padres, array, arrayTemp) {
    mostrarResultado.innerHTML += "<br>";
    console.log("----- Final ----");
    for (var x = 0; x < array.length; x++) {
        for (var y = 0; y < array_padres.length; y++) {
            var m = array_padres[y].getElementsByTagName(array[x])[0];
            if (x == 0) {
                checkAr(array, m, arrayTemp[x]);
            }
            if (y == 0) {
                console.log("Elemento repetido: " + array[x]);
                secuenciaCaso(arrayTemp[x]);
                if (arrayTemp[x].children.length>0) {
                    console.log("Tienes hijos " + arrayTemp[x].children.length+ " el "+arrayTemp[x].nodeName);
                }
            }

            checkAb(array, m, arrayTemp[x]);
        }
    }
    console.log("----- Final ----");

}


function checkAb(array, m, arrayTemp) {
    var d = m;
    while (true) {
        d = d.nextElementSibling;
        if (d == null) {
            break;
        }
        else if (array.includes(d.nodeName)) {
            break;
        }
        console.log("Elemento no repetido (ocurrencia 0 o X): " + d.nodeName);
        secuenciaCaso(d);
        arrayTempRepetidos.push(d.nodeName);

    }
}

function checkAr(array, m, arrayTemp) {
    var d = m;
    while (true) {
        d = d.previousElementSibling;
        if (d == null) {
            break;
        }
        else if (array.includes(d.nodeName)) {
            break;
        }
        console.log("Elemento no repetido (ocurrencia 0 o X): " + d.nodeName);
        secuenciaCaso(d);
        arrayTempRepetidos.push(d.nodeName);
    }
}


