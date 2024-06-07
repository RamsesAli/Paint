import { CanvasManager } from "./class/canvasManager.js";

var startPoint;
var endPoint;
var ctx;

document.addEventListener("DOMContentLoaded", function () {
    const canvasManager = new CanvasManager();
    console.log(canvasManager.getCurrentCanvas());
    canvasManager.setDrawing(false);

    //modos
    document.getElementById("line").onclick = function () {
        canvasManager.cambiarModo('linea');
    };
    document.getElementById("square").onclick = function () {
        canvasManager.cambiarModo('cuadrado');
    };
    document.getElementById("text").onclick = function () {
        canvasManager.cambiarModo('texto');
    };
    document.getElementById("rectangle").onclick = function () {
        canvasManager.cambiarModo('rectangulo');
    };
    document.getElementById("circle").onclick = function () {
        canvasManager.cambiarModo('circulo');
    };
    document.getElementById("move").onclick = function () {
        canvasManager.cambiarModo('mover');
    };
    document.getElementById("resize").onclick = function () {
        canvasManager.cambiarModo('escalar');
    };
    document.getElementById("forward").onclick = function () {
        canvasManager.cambiarModo('HaciaAdelante');
    };
    document.getElementById("backward").onclick = function () {
        canvasManager.cambiarModo('HaciaAtras');
    };
    document.getElementById("uplayer").onclick = function () {
        canvasManager.cambiarModo('SubirCapa');
    };
    document.getElementById("downlayer").onclick = function () {
        canvasManager.cambiarModo('BajarCapa');
    };
    document.getElementById("eraser").onclick = function () {
        canvasManager.cambiarModo('borrar');
    };
    document.getElementById("figureEraser").onclick = function () {
        canvasManager.cambiarModo('borrarFigura');
    };
    document.getElementById("pixelEraser").onclick = function () {
        canvasManager.cambiarModo('pixelEraser');
    };
    document.getElementById("pencil").onclick = function () {
        canvasManager.cambiarModo('lapiz');
    };
    document.getElementById("bucket").onclick = function () {
        canvasManager.cambiarModo('cubeta');
    };

    document.getElementById("polygon").onclick = function () {
        canvasManager.cambiarModo('poligono');
        var lados = prompt("Ingrese el numero de lados del poligono");
        canvasManager.setLadosPoligono(lados);
    };
    document.getElementById("elipse").onclick = function () {
        canvasManager.cambiarModo('elipse');
    }
    document.getElementById("trapecio").onclick = function () {
        canvasManager.cambiarModo('trapecio');
    }
    document.getElementById("colorPicker").onchange = function () {
        canvasManager.cambiarColor(this.value);
    };     
   
    document.getElementById("grosor").onchange = function () {
        canvasManager.cambiarGrosor(this.value);
    };

    //eventos
    canvasManager.getCurrentCanvas().addEventListener("mousedown", function (event) {
        ctx = canvasManager.getCurrentCanvasContext()

        canvasManager.setDrawing(true);
        startPoint = canvasManager.getRelativeCoordinates(event);

        if(canvasManager.getCurrentModo() === 'cubeta'){
            canvasManager.fillCubeta(startPoint);
        }
  
    });

    //arrastrar
    canvasManager.getCurrentCanvas().addEventListener("mousemove", function (event) {
        var coordenadas = canvasManager.getRelativeCoordinates(event);
        document.getElementById("coordenadas").innerHTML = "X: " + coordenadas.x.toFixed(2) + " Y: " + coordenadas.y.toFixed(2);
   
        if (canvasManager.getDrawing()) {
            endPoint = canvasManager.getRelativeCoordinates(event);
            ctx = canvasManager.getCurrentCanvasContext()
            const modo = canvasManager.getCurrentModo();

            //Si entra a cualquier modo de dibujo
            if (modo === 'linea' || modo === 'cuadrado' || modo === 'borrar' || modo === 'circulo' || modo === 'poligono' || modo === 'elipse' || modo === 'trapecio' || modo === 'rectangulo' || modo === 'cubeta' || modo === 'texto') {
                canvasManager.drawPreview(startPoint, endPoint);
            } else if (modo === 'lapiz' || modo === 'pixelEraser') {
                canvasManager.drawPreview(startPoint, endPoint);
                startPoint = endPoint;
            }
        }
    });

    //trasladar la figura
    document.addEventListener('keydown', function (event) {
        if (!teclaPresionada) {
            teclaPresionada = true;
            if (canvasManager.figuraSeleccionada != null) {
                console.log(canvasManager.figuraSeleccionada)

                if (event.key === "ArrowUp") {
                    canvasManager.figuraSeleccionada.trasladarFigura(0, -1);
                }
                if (event.key === "ArrowDown") {
                    canvasManager.figuraSeleccionada.trasladarFigura(0, 1);
                }
                if (event.key === "ArrowLeft") {
                    canvasManager.figuraSeleccionada.trasladarFigura(-1, 0);
                }
                if (event.key === "ArrowRight") {
                    canvasManager.figuraSeleccionada.trasladarFigura(1, 0);
                }
            }
            canvasManager.history.renderizar(canvasManager.getCurrentCanvasContext());

        }

        //deshacer ctrl z
        if (event.ctrlKey && event.key === "z") {
            canvasManager.limpiarCanvas();
            canvasManager.history.undo(canvasManager.getCurrentCanvasContext());
        }

        //rehacer ctrl y
        if (event.ctrlKey && event.key === "y") {
            canvasManager.limpiarCanvas();
            canvasManager.history.redo(canvasManager.getCurrentCanvasContext());
        }

        canvasManager.history.renderizar(canvasManager.getCurrentCanvasContext());
    });

    // Agrega event listener para el evento de mouseup
    canvasManager.getCurrentCanvas().addEventListener("mouseup", function () {
        const modo = canvasManager.getCurrentModo();

        //Si entra a cualquier modo de dibujo
        if (modo === 'linea' || modo === 'pixelEraser' || modo === 'cuadrado' || modo === 'borrar' || modo === 'lapiz' || modo === 'circulo' || modo === 'poligono' || modo === 'elipse' || modo === 'trapecio' || modo === 'rectangulo' || modo === 'cubeta' || modo === 'texto') {
            canvasManager.draw(startPoint, endPoint);
        }else if (modo === 'cursor') {
            canvasManager.selectElement(startPoint);
        }else if (modo === 'mover' || modo === 'rotar' || modo === 'HaciaAdelante' || modo === 'HaciaAtras' || modo === 'SubirCapa' || modo === 'BajarCapa' || modo === 'escalar' || modo === 'borrarFigura') {
            canvasManager.limpiarCanvas();
            canvasManager.moverFigura(startPoint, endPoint);
        }
        canvasManager.setDrawing(false);
    });
    canvasManager.getCurrentCanvas().addEventListener("mouseout", function () {
        canvasManager.setDrawing(false);
    });

    //btns
    document.getElementById("undo").onclick = function () {
        canvasManager.limpiarCanvas();
        canvasManager.history.undo(canvasManager.getCurrentCanvasContext());
    };
    // rehacer
    document.getElementById("redo").onclick = function () {
        canvasManager.limpiarCanvas();
        canvasManager.history.redo(canvasManager.getCurrentCanvasContext());
    };
    // abrir
    document.getElementById("open").onclick = function () {
        canvasManager.abrirArchivo();
    };
    // guardar
    document.getElementById("save").onclick = function () {
        canvasManager.guardarArchivo();
    };
    // exportar
    document.getElementById("export").onclick = function () {
        canvasManager.exportarArchivo();
    };

    let teclaPresionada = false;

    document.addEventListener("keyup", event => {
        teclaPresionada = false;
    });
});