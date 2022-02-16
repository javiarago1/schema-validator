var mostrarResultado = document.getElementById("resultado");
const complexVar = document.createTextNode("----<xs:complexType>");
const sequenceVar = document.createTextNode("--------<xs:sequence>");
const complexVarC = document.createTextNode("</xs:complexType>");
const sequenceVarC = document.createTextNode("</xs:sequence>");


var arrayTempRepetidos = [];

function main() {
    var contenidoArea = document.getElementsByTagName("textarea")[0].value;

    const parseador = new DOMParser();
    
    const documentoXML = parseador.parseFromString(contenidoArea, "text/xml");

    const elemento_padre = documentoXML.documentElement;

    /* inicializar schema */
    mostrarResultado.appendChild(document.createTextNode("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>"));
    mostrarResultado.innerHTML += "<br>";
    mostrarResultado.appendChild(document.createTextNode("<xs:schema xmlns:xs=\"http://www.w3.org/2001/XMLSchema\">"));
    mostrarResultado.innerHTML += "<br>";
    /* inicializar schema */
    const array_hijos = documentoXML.documentElement.childNodes;


    leerTree(documentoXML);


}



function leerTree (elemento){
    var newChilds = elemento.children;
    console.log("Hijos de "+elemento.nodeName);
    for(var i=0;i<newChilds.length;i++){
        if (newChilds[i].children.length>0){
            console.log("Defino al padre AQUI "+ newChilds[i].nodeName);
            mostrarResultado.appendChild(document.createTextNode("<xs:element name=\""+newChilds[i].nodeName+"\">"));
            //escribirElementosHijos(true);
            mostrarResultado.innerHTML += "<br>";
            leerTree(newChilds[i]);

        }
        else  {
            console.log("Defino a un hijo de "+ elemento.nodeName +" aqui " +newChilds[i].nodeName);
            mostrarResultado.appendChild(document.createTextNode("--------------<xs:element name=\""+newChilds[i].nodeName+"\" type=\"xs:string\"/>"));
            mostrarResultado.innerHTML += "<br>";
        }
    }
}