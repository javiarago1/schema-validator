var mostrarResultado = document.getElementById("resultado");
const sequenceVar = document.createTextNode("<xs:sequence>");
const sequenceVarC = document.createTextNode("</xs:sequence>");





function main() {
    var contenidoArea = document.getElementsByTagName("textarea")[0].value;

    const parseador = new DOMParser();

    const documentoXML = parseador.parseFromString(contenidoArea, "text/xml");

    /* inicializar schema */
    mostrarResultado.appendChild(document.createTextNode("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>"));
    mostrarResultado.innerHTML += "<br>";
    mostrarResultado.innerHTML += "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>";
    mostrarResultado.appendChild(document.createTextNode("<xs:schema xmlns:xs=\"http://www.w3.org/2001/XMLSchema\">"));
    mostrarResultado.innerHTML += "<br>";
    /* inicializar schema */

    leerTree(documentoXML);

    mostrarResultado.innerHTML += "<br>";
    mostrarResultado.appendChild(document.createTextNode("</xs:schema>"));

}

function leerTree(elemento) {
    var newChilds = elemento.children;
    console.log("Hijos de " + elemento.nodeName);
    for (var i = 0; i < newChilds.length; i++) {
        if (newChilds[i].children.length > 0) {
                console.log("Defino al padre AQUI " + newChilds[i].nodeName);
                var eleccion = smallCheck(newChilds[i],elemento);
                writeFather(newChilds[i], true, eleccion);
                writeType(0, true);
                if (eleccion){
                    checkPadres(newChilds[i], elemento);
                }
                else {
                    writeSequence(true);
                    leerTree(newChilds[i]);
                    writeSequence(false);
                }
                writeType(0, false);
                writeFather(0, false);
        }
        else  {
            console.log("Defino a un hijo de " + elemento.nodeName + " aqui " + newChilds[i].nodeName);
            writeChild(newChilds[i]);
        }
    }


}


function writeFather(elemento, abrir, repeated) {
    if (abrir) {
        if (repeated) {
            mostrarResultado.innerHTML += "<br>";
            mostrarResultado.appendChild(document.createTextNode("<xs:element name=\"" + elemento.nodeName + "\"  maxOccurs=\"unbounded\" minOccurs=\"0\">"));
            mostrarResultado.innerHTML += "<br>";
        }
        else {
            mostrarResultado.innerHTML += "<br>";
            mostrarResultado.appendChild(document.createTextNode("<xs:element name=\"" + elemento.nodeName + "\">"));
            mostrarResultado.innerHTML += "<br>";
        }
    }
    else {
        mostrarResultado.innerHTML += "<br>";
        mostrarResultado.appendChild(document.createTextNode("</xs:element>"));
        mostrarResultado.innerHTML += "<br>";
    }
}

function writeType(type, abrir) {
    if (type == 0) {
        if (abrir) {
            mostrarResultado.innerHTML += "<br>";
            mostrarResultado.appendChild(document.createTextNode("<xs:complexType>"));
            mostrarResultado.innerHTML += "<br>";
        } else {
            mostrarResultado.innerHTML += "<br>";
            mostrarResultado.appendChild(document.createTextNode("</xs:complexType>"));
            mostrarResultado.innerHTML += "<br>";
        }
    }
}

function writeChild(elemento) {
    mostrarResultado.innerHTML += "<br>";
    mostrarResultado.appendChild(document.createTextNode("<xs:element name=\"" + elemento.nodeName + "\" type=\"xs:string\"/>"));
    mostrarResultado.innerHTML += "<br>";
}

function writeChoice(abrir) {
    if (abrir) {
        mostrarResultado.innerHTML += "<br>";
        mostrarResultado.appendChild(document.createTextNode("<xs:choice minOccurs=\"0\" maxOccurs=\"unbounded\">"));
        mostrarResultado.innerHTML += "<br>";
    }
    else {
        mostrarResultado.innerHTML += "<br>";
        mostrarResultado.appendChild(document.createTextNode("</xs:choice>"));
        mostrarResultado.innerHTML += "<br>";
    }
}

function writeSequence(abrir) {
   
        if (abrir) {
            mostrarResultado.innerHTML += "<br>";
            mostrarResultado.appendChild(document.createTextNode("<xs:sequence>"));
            mostrarResultado.innerHTML += "<br>";
        }
        else {
            mostrarResultado.innerHTML += "<br>";
            mostrarResultado.appendChild(document.createTextNode("</xs:sequence>"));
            mostrarResultado.innerHTML += "<br>";
        }
    
}


function smallCheck (newChilds,elemento){
    const array_padres = elemento.getElementsByTagName(newChilds.nodeName);
    var num = array_padres.length;
    if (num > 1) {
        return true;
    }
}

function checkPadres(newChilds, elemento, comprobacion) {
    const array_padres = elemento.getElementsByTagName(newChilds.nodeName);
    var num = array_padres.length;


        console.log(newChilds.nextElementSibling);
        var array = [];

        var arrayTemp = [];

        var ord = false;

        for (var x = 0; x < newChilds.children.length; x++) {
            checkElemento(array_padres, newChilds.children[x], array, arrayTemp);
        }

        if (checkOrd(array_padres, array)) {
            console.log("parece que la secuencia está orden");
            ord = true;
            writeSequence(true);
        }
        else {
            console.log("parece que la secuencia no está en orden");
            ord = false;
            writeChoice(true);
        }


        console.log("------- Array resultado ------");
        array.forEach(element => console.log(element));
        console.log("------- Array resultado ------");

        ponerNombres(array_padres, array, arrayTemp);


        if (ord) {
            writeSequence(false);
        }
        else {
            writeChoice(false);
        }

        eliminateBros(newChilds);

}


function eliminateBros(newChilds){
    var d = newChilds;
    while (true){
        d = d.nextElementSibling
        if (d==null){
            break;
        }
        else if (d.nodeName==newChilds.nodeName){
            d.remove();
        }
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

    }
}