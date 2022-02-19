Objetivos Equipo Escalando Programas
Creación document HTML
          -Creación documento HTML para recibir el documento XML.
          -Generar un cuadro de texto para volcar el xml al que se le realizará la validación. Usaremos un cuadro de texto <textarea> >/textarea> donde se volcará esa información.
          -En el mismo HTML donde se encuentra el textarea, se creará un botón de estilo <button> </button> que llamará a la función para realizar su lectura y su la validación a            formato Schema.
Objetivos para el programa validación XML con javaScript
          -Creación documento js.Script
          -Crear variables de tipo String para los distintos elementos tanto en apertura(<>) como en cierre(</>) (xs:complexType;xs:sequence). 
          - Función principal (llamada desde button en el documento HTML) donde se recibe el documento XML y llamará a las distintas funciones para validarlo
                    Funciones:
                              Leer todo el árbol de tal manera que defina el elemento padre
                              Leer los hijos del padre. Aquellos que son elementos que no tienen contenido y no contienen subelementos
                              Aquellos elementos que sí tienen contenido y no contienen subelementos
                              Y elementos que no tienen contenido y sí contienen subelementos (sequence)
                              En este proyecto no incluiremos validaciones de atributos.
                    Elementos repetidos
                              Almacenar los elementos padres repetidos , para evitar así el duplicado del resultado al generarse el Schema
                              Si el elemento aparece más de una vez en el documento XML (ya sea como padre o como hijos), no generar duplicado de información.
