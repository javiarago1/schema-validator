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

    /* inicializar schema */
    mostrarResultado.appendChild(document.createTextNode("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>"));
    mostrarResultado.innerHTML += "<br>";
    mostrarResultado.appendChild(document.createTextNode("<xs:schema xmlns:xs=\"http://www.w3.org/2001/XMLSchema\">"));
    mostrarResultado.innerHTML += "<br>";
    /* inicializar schema */


    leerTree(documentoXML);
}


function leerTree(elemento) {

    var newChilds = elemento.children;
    console.log("Hijos de " + elemento.nodeName);
    for (var i = 0; i < newChilds.length; i++) {
        if (newChilds[i].children.length > 0) {
            if (!arrayTempRepetidos.includes(newChilds[i].nodeName)) {
                console.log("Defino al padre AQUI " + newChilds[i].nodeName);
                writeFather(newChilds[i]);
                checkPadres(newChilds[i], elemento);
                leerTree(newChilds[i]);
            }

        }
        else if (!arrayTempRepetidos.includes(newChilds[i].nodeName)) {
            console.log("Defino a un hijo de " + elemento.nodeName + " aqui " + newChilds[i].nodeName);
            writeChild(newChilds[i]);
        }
    }


}



function writeFather(elemento){
    mostrarResultado.innerHTML += "<br>";
    mostrarResultado.appendChild(document.createTextNode("<xs:element name=\"" + elemento.nodeName + "\">"));
    mostrarResultado.innerHTML += "<br>";
    
}

function writeChild (elemento){
    mostrarResultado.innerHTML += "<br>";
    mostrarResultado.appendChild(document.createTextNode("--------------<xs:element name=\"" + elemento.nodeName + "\" type=\"xs:string\"/>"));
    mostrarResultado.innerHTML += "<br>";
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

    }
}

function checkElemento(array_padres, elementoC, array, arrayTemp) {
    var contador = 0;
    for (var i = 0; i < array_padres.length; i++) {
        for (var j = 0; j < array_padres[i].children.length; j++) {
            if (array_padres[i].children[j].nodeName == elementoC.nodeName) {
                contador++;
            }
        }
    }
    if (contador == array_padres.length) {
        array.push(elementoC.nodeName);
        arrayTemp.push(elementoC);
        arrayTempRepetidos.push(elementoC.nodeName, elementoC.parentNode.nodeName);
    }
    else {
        console.log("No hay secuencia de " + elementoC.nodeName);
    }
}

function ponerNombres(array_padres, array, arrayTemp) {
    console.log("----- Final ----");
    for (var x = 0; x < array.length; x++) {
        if (x == 0) {
            for (var y = 0; y < array_padres.length; y++) {
                var m = array_padres[y].getElementsByTagName(array[x])[0];
                checkAb(array, array_padres[y].firstChild);
 
            }
        }
        console.log("Elemento repetido: " + array[x]);
        writeChild(arrayTemp[x])
        for (var y = 0; y < array_padres.length; y++) {
            var m = array_padres[y].getElementsByTagName(array[x])[0];
            checkAb(array, m, arrayTemp[x]);
        }

    }
    console.log("----- Final ----");

}


function checkAb(array, m) {
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
        writeChild(d);
        arrayTempRepetidos.push(d.nodeName);
    }
}