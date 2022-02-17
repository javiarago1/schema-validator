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
            console.log("Defino al padre AQUI " + newChilds[i].nodeName);
            mostrarResultado.appendChild(document.createTextNode("<xs:element name=\"" + newChilds[i].nodeName + "\">"));
            checkPadres(newChilds[i], elemento);
            //escribirElementosHijos(true);
            mostrarResultado.innerHTML += "<br>";
            leerTree(newChilds[i]);

        }
        else {
            console.log("Defino a un hijo de " + elemento.nodeName + " aqui " + newChilds[i].nodeName);
            mostrarResultado.innerHTML += "<br>";
            mostrarResultado.appendChild(document.createTextNode("--------------<xs:element name=\"" + newChilds[i].nodeName + "\" type=\"xs:string\"/>"));
            mostrarResultado.innerHTML += "<br>";
        }
    }

}



function obtenerIguales(arr) {
    return arr.shift().filter(function (v) {
        return arr.every(function (a) {
            return a.indexOf(v) !== -1;
        });
    });
}


function checkPadres(newChilds, elemento) {
    const array_padres = elemento.getElementsByTagName(newChilds.nodeName);
    var num = array_padres.length;
    if (num > 1) {
     
        console.log(newChilds.children[0]);
        checkElemento(array_padres,newChilds.children[0]);
        checkElemento(array_padres,newChilds.children[1]);
        checkElemento(array_padres,newChilds.children[2]);

        checkElemento(array_padres,newChilds.children[3]);
        

        //leerTree(array_padres[0]);
       // arrayTempRepetidos.push(newChilds.nodeName);
    }
}

function checkElemento(array_padres,elementoC){
    for (var i=1;i<array_padres.length;i++){
        for (var j=0;j<array_padres[i].children.length;j++){
            if (array_padres[i].children[j].nodeName==elementoC.nodeName){
               console.log("aki: "+elementoC.nodeName);
            }
        }
    }
}