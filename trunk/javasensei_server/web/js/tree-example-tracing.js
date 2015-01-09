var tree_self = {};

var tree_example_tracing = function tree_example_tracing(ejercicios) {
    this.ejercicios = ejercicios;
    this.log_atras = new buckets.Stack();
    this.log_adelante = new buckets.Stack();

    this.log_monitoreo = new buckets.LinkedList();

    this.cachenodos = new buckets.Dictionary();

    this.nodo = {};
    this.pasobuscado = -1;
    this.pasoactual = -1;

    this.matriz = {};
    this.tablaErrores = {};
    
    tree_self = this;
};
tree_example_tracing.prototype = {
    crearTablaErrores: function(){
        
    },
    construirMatriz: function (matriz, nodo, anterior) {
        if (matriz == undefined){ //Primera construccion de la matriz
            tree_self.construirMatriz(tree_self.matriz, tree_self.ejercicios, -1);
            //Recursividad terminada, creamos la tabla de errores
            tree_self.crearTablaErrores();
            return;
        }
        
        matriz[nodo.paso] = {
            tipopaso: nodo.tipo,
            anterior: [anterior],
            siguiente: []
        };

        //Construccion de siguiente
        var array = Array();

        if (nodo.opciones.length > 0) { //Tiene pasos siguientes
            for (var index in nodo.opciones){
                var nodoItem = nodo.opciones[index];
                array[index] = nodoItem.paso;
                tree_self.construirMatriz(matriz, nodoItem, nodo.paso);
            }

            matriz[nodo.paso].siguiente = array;
        };
    },
    obtenerId: function () {
        return tree_self.ejercicios.id;
    },
    tieneAtras: function () {
        return tree_self.log_atras.size() > 0;
    },
    tieneAdelante: function () {
        return tree_self.log_adelante.size() > 0;
    },
    adelante: function () {
        //El ultimo de adelante pasa a ser el nodo actual, el nodo actual pasa a ser uno de atras, se elimina el ultimo de adelante
        tree_self.log_atras.add(tree_self.pasoactual);

        tree_self.pasoactual = tree_self.log_adelante.pop();
        tree_self.log_monitoreo.add(tree_self.pasoactual);

        return tree_self.obtenerNodo(tree_self.pasoactual);

    },
    atras: function () {
        //Si hay actual, pasa al log de adelante, se obtiene el nodo del cache de nodos
        tree_self.log_adelante.add(tree_self.pasoactual);

        //El ultimo nodo del log_atras para a ser el actual y se remueve
        tree_self.pasoactual = tree_self.log_atras.pop();
        tree_self.log_monitoreo.add(tree_self.pasoactual);

        //Se regresa el nodo actual desde la cache de nodos
        return tree_self.obtenerNodo(tree_self.pasoactual);
    },
    avanzarNodo: function (paso) {
        //Se coloca el paso que buscamos
        tree_self.pasobuscado = paso;

        //Se busca el nodo en el cache de nodos, si no se busca recursivamente
        if (tree_self.cachenodos.containsKey(tree_self.pasobuscado)) {
            tree_self.nodo = tree_self.cachenodos.get(tree_self.pasobuscado);
        } else {
            $.each(tree_self.ejercicios.opciones, tree_self.validarNodo);
        }

        //Si no es el primer paso, se agrega al log atras
        if (tree_self.pasoactual != -1) {
            //El paso actual se agrega al log de atras
            tree_self.log_atras.add(tree_self.pasoactual);
        }

        //Lo ubicamos el nodo encontrado como el actual
        tree_self.pasoactual = tree_self.pasobuscado;
        tree_self.log_monitoreo.add(tree_self.pasoactual);

        //Se borra la cache de pasos adelantes (se supone que estamos seleccionando una respuesta)
        //Esto nos lleva a pensar que estamos creando un nuevo camino
        tree_self.log_adelante.clear();

        //Se regresa el nodo que se haya encontrado
        return this.nodo;
    },
    obtenerNodoActual: function () {
        return tree_self.obtenerNodo(tree_self.pasoactual);
    },
    obtenerNodo: function (paso) { //Obtiene nodo del cache de nodos
        return tree_self.cachenodos.get(paso);
    },
    validarNodo: function (indice, item) {
        if (item.paso == tree_self.pasobuscado) {
            //Construimos el nodo
            tree_self.nodo = item;

            //Se agrega al cache de nodos
            tree_self.cachenodos.set(item.paso, tree_self.nodo);

            return false;//Break
        } else if (item.opciones.length > 0) {
            $.each(item.opciones, tree_self.validarNodo);
        }
    },
    obtenerTextoEmocional: function (emocion, retroalimentacion) {
        var nodo_emocional = tree_self.obtenerNodo(tree_self.pasoactual).textoEmocional;
        var resultado = {
            "motivacional": nodo_emocional[emocion],
            "retroalimentacion": nodo_emocional.retroalimentacion[retroalimentacion]
        };

        return resultado;
    }
};
