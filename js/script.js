var addTextArea = document.getElementById("textarea2");


function blankSpace() {
    addTextArea.value += "\n";
}

function limpiar() {
    addTextArea.value = "";
}

function checkDescarga() {
    if (document.getElementById("descargar").checked) {
        var text = document.getElementById("textarea2").value;
        var filename = "schema.xsd";
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}

function main() {

    limpiar();


    // Pasar texto a xml 
    var contenidoArea = document.getElementsByTagName("textarea")[0].value;

    const parseador = new DOMParser();

    const documentoXML = parseador.parseFromString(contenidoArea, "text/xml");
    // Pasar texto a xml 


    /* inicializar schema (Obligatorio) */

    addTextArea.value += "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>";
    blankSpace();
    addTextArea.value += "<xs:schema xmlns:xs=\"http://www.w3.org/2001/XMLSchema\">";
    blankSpace();


    /* inicializar schema */

    leerTree(documentoXML, 1); // enviamos el documento entero y llamamos a la función

    addTextArea.value += "</xs:schema>"; // cierra schema

    checkDescarga(); // comprueba descarga si esta marcadod checkbox y lo descarga o no

}

function leerTree(elemento, espacio) {
    var newChilds = elemento.children; // mete en variable los hijos de "elemento"
    console.log("Hijos de " + elemento.nodeName);
    for (var i = 0; i < newChilds.length; i++) { // recorre el for de los hijos
        if (newChilds[i].children.length > 0) { // comprueba que tenga hijos el hijo x 
            console.log("Defino al padre AQUI " + newChilds[i].nodeName);
            var eleccion = smallCheck(newChilds[i], elemento); // true o false de si tiene hermanos iguales
            writeFather(newChilds[i], true, eleccion, espacio); // escribe el nombre del padre (xs:element)
            writeType(0, true, ++espacio); // tipo (complex o simple)
            if (eleccion) { // si es true va a la funcion  de mezclar
                checkPadres(newChilds[i], elemento, espacio); // llamamos a funcion para mezclar
            }
            else { // si no es false simplemente sigue leyendo hijos
                writeSequence(true, ++espacio); // escribe secuencia
                leerTree(newChilds[i], ++espacio); // llama al metodo recursivo
                writeSequence(false, --espacio); // cierra secuencia
                writeType(0, false, --espacio); // cierra tipo
                writeFather(0, false, null, --espacio); // cierra padre
            }

        }
        else {
            console.log("Defino a un hijo de " + elemento.nodeName + " aqui " + newChilds[i].nodeName);
            writeChild(newChilds[i], espacio);
        }
    }


}

function addEspacios(espacios) {
    for (var i = 0; i < espacios; i++) {
        addTextArea.value += "  ";
    }
}

function smallCheck(newChilds, elemento) {
    const array_padres = elemento.getElementsByTagName(newChilds.nodeName);
    var num = array_padres.length;
    if (num > 1) {
        return true;
    }
}

function checkPadres(newChilds, elemento, espacio) {


    const array_padres = elemento.getElementsByTagName(newChilds.nodeName);

    var array = [];     

    var arrayTemp = [];

    var ord = false;

    for (var x = 0; x < newChilds.children.length; x++) {
        checkElemento(array_padres, newChilds.children[x], array, arrayTemp);
    }

    if (checkOrd(array_padres, array)) {

        console.log("parece que la secuencia está orden");
        ord = true;
        writeSequence(true, ++espacio);
    }
    else {
        console.log("parece que la secuencia no está en orden");
        ord = false;
        writeChoice(true, ++espacio);
    }


    console.log("------- Array resultado ------");
    array.forEach(element => console.log(element));
    console.log("------- Array resultado ------");

    ponerNombres(array_padres, array, arrayTemp, espacio, ord);


    if (ord) {
        writeSequence(false, espacio);
    }
    else {
        writeChoice(false, espacio);
    }
    writeType(0, false, --espacio);
    writeFather(0, false, null, --espacio);


    eliminateBros(newChilds);

}


function eliminateBros(newChilds) {
    var d = newChilds;
    while (true) {
        d = d.nextElementSibling
        if (d == null) {
            break;
        }
        else if (d.nodeName == newChilds.nodeName) {
            console.log("Revisa la eliminacion -- > " + d.nodeName)
            eliminateBros(d);
            d.remove();


        }
        console.log("Revisa la eliminacion -- > " + d.nodeName)
    }

}

function checkOrd(array_padres, array) {
    for (var i = 1; i < array_padres.length; i++) {
        for (var j = 0, x = 0; j < array_padres[i].children.length; j++) {
            if (array_padres[i].children[j].nodeName == array[x]) {
                x++;
            }
            if (j == array_padres[i].children.length - 1 && x != array.length) {
                return false;
            }
        }
    }
    return true;
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

    }
    else {
        console.log("No hay secuencia de " + elementoC.nodeName);
    }
}

function ponerNombres(array_padres, array, arrayTemp, espacio, ord) {
    console.log("----- Final ----");
    espacio++;
    for (var x = 0; x < array.length; x++) {
        if (x == 0) {
            for (var y = 0; y < array_padres.length; y++) {
                var m = array_padres[y].getElementsByTagName(array[x])[0];
                checkAb(array, array_padres[y].firstChild, espacio, ord);

            }
        }
        console.log("Elemento repetido: " + array[x]);
        writeChild(arrayTemp[x], espacio)
        for (var y = 0; y < array_padres.length; y++) {
            var m = array_padres[y].getElementsByTagName(array[x])[0];
            checkAb(array, m, espacio, ord);
        }

    }
    console.log("----- Final ----");

}


function checkAb(array, m, espacio,ord) {
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
        writeChild(d, espacio, ord);
    }
}



function writeFather(elemento, abrir, repeated, espacio) {
    if (abrir) {
        if (repeated) {

            addEspacios(espacio);
            addTextArea.value += "<xs:element name=\"" + elemento.nodeName + "\"  maxOccurs=\"unbounded\" minOccurs=\"0\">";
            blankSpace();
        }
        else {

            addEspacios(espacio);
            addTextArea.value += "<xs:element name=\"" + elemento.nodeName + "\">";
            blankSpace();
        }
    }
    else {

        addEspacios(espacio);
        addTextArea.value += "</xs:element>";
        blankSpace();
    }
}

function writeType(type, abrir, espacio) {
    if (type == 0) {
        if (abrir) {

            addEspacios(espacio);
            addTextArea.value += "<xs:complexType>";
            blankSpace();
        } else {

            addEspacios(espacio);
            addTextArea.value += "</xs:complexType>";
            blankSpace();
        }
    }
}

function writeChild(elemento, espacio, ord) {
    if (!ord) {
        addEspacios(espacio);
        addTextArea.value += "<xs:element name=\"" + elemento.nodeName + "\" type=\"xs:string\"/>";
        blankSpace();
    }
    else {
        addEspacios(espacio);
        addTextArea.value += "<xs:element name=\"" + elemento.nodeName + "\" type=\"xs:string\" minOccurs=\"0\"/>";
        blankSpace();
    }
}

function writeChoice(abrir, espacio) {
    if (abrir) {
        addEspacios(espacio);
        addTextArea.value += "<xs:choice minOccurs=\"0\" maxOccurs=\"unbounded\">";
        blankSpace();
    }
    else {
        addEspacios(espacio);
        addTextArea.value += "</xs:choice>";
        blankSpace();
    }
}

function writeSequence(abrir, espacio) {
    if (abrir) {
        addEspacios(espacio);
        addTextArea.value += "<xs:sequence>";
        blankSpace();
    }
    else {
        addEspacios(espacio);
        addTextArea.value += "</xs:sequence>";
        blankSpace();
    }

}
