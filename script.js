var addTextArea = document.getElementById("textarea2");


function blankSpace() {
    addTextArea.value += "\n";
}

function main() {

    var contenidoArea = document.getElementsByTagName("textarea")[0].value;

    const parseador = new DOMParser();

    const documentoXML = parseador.parseFromString(contenidoArea, "text/xml");

    /* inicializar schema */

    addTextArea.value += "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>";
    blankSpace();
    addTextArea.value += "<xs:schema xmlns:xs=\"http://www.w3.org/2001/XMLSchema\">";
    blankSpace();


    /* inicializar schema */

    leerTree(documentoXML,1);

    addTextArea.value += "</xs:schema>";

}

function leerTree(elemento,espacio) {

    var newChilds = elemento.children;
    console.log("Hijos de " + elemento.nodeName);
    for (var i = 0; i < newChilds.length; i++) {
        if (newChilds[i].children.length > 0) {
            console.log("Defino al padre AQUI " + newChilds[i].nodeName);
            var eleccion = smallCheck(newChilds[i], elemento);
            writeFather(newChilds[i], true, eleccion,espacio);
            writeType(0, true,++espacio);
            if (eleccion) {
                checkPadres(newChilds[i], elemento,espacio);
            }
            else {
                writeSequence(true,++espacio);
                leerTree(newChilds[i],++espacio);
                writeSequence(false,--espacio);
                writeType(0, false,--espacio);
                writeFather(0, false,null,--espacio);
            }

        }
        else {
        
            console.log("Defino a un hijo de " + elemento.nodeName + " aqui " + newChilds[i].nodeName);
            writeChild(newChilds[i],espacio);
        }
    }


}

function addEspacios(espacios){
    for (var i=0;i<espacios;i++){
        addTextArea.value+="  ";
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
    var num = array_padres.length;

    var array = [];

    var arrayTemp = [];

    var ord = false;

    for (var x = 0; x < newChilds.children.length; x++) {
        checkElemento(array_padres, newChilds.children[x], array, arrayTemp);
    }

    if (checkOrd(array_padres, array)) {
        console.log("parece que la secuencia está orden");
        ord = true;
        writeSequence(true,++espacio);
    }
    else {
        console.log("parece que la secuencia no está en orden");
        ord = false;
        writeChoice(true,++espacio);
    }


    console.log("------- Array resultado ------");
    array.forEach(element => console.log(element));
    console.log("------- Array resultado ------");

    ponerNombres(array_padres, array, arrayTemp,espacio);


    if (ord) {
        writeSequence(false,espacio);
    }
    else {
        writeChoice(false,espacio);
    }
    writeType(0,false,--espacio);
    writeFather(0,false,null,--espacio);


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

function ponerNombres(array_padres, array, arrayTemp,espacio) {
    console.log("----- Final ----");
    espacio++;
    for (var x = 0; x < array.length; x++) {
        if (x == 0) {
            for (var y = 0; y < array_padres.length; y++) {
                var m = array_padres[y].getElementsByTagName(array[x])[0];
                checkAb(array, array_padres[y].firstChild,espacio);

            }
        }
        console.log("Elemento repetido: " + array[x]);
        writeChild(arrayTemp[x],espacio)
        for (var y = 0; y < array_padres.length; y++) {
            var m = array_padres[y].getElementsByTagName(array[x])[0];
            checkAb(array, m,espacio);
        }

    }
    console.log("----- Final ----");

}


function checkAb(array, m,espacio) {
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
        writeChild(d,espacio);
    }
}



function writeFather(elemento, abrir, repeated,espacio) {
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

function writeType(type, abrir,espacio) {
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

function writeChild(elemento,espacio) {
    addEspacios(espacio);
    addTextArea.value += "<xs:element name=\"" + elemento.nodeName + "\" type=\"xs:string\"/>";
    blankSpace();
}

function writeChoice(abrir,espacio) {
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

function writeSequence(abrir,espacio) {
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
