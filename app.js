// Arreglo de Semillas Regulares
const semillasRegulares = [
    { nombre: "Papa", minutos: 0.75, imagen: "papa.png" },
    { nombre: "Zanahoria", minutos: 2, imagen: "zanahoria.png" },
    { nombre: "Maíz", minutos: 5, imagen: "maiz.png" },
    { nombre: "Tomate", minutos: 8, imagen: "tomate.png" },
    { nombre: "Cebolla", minutos: 12, imagen: "cebolla.png" },
    { nombre: "Trigo", minutos: 18, imagen: "trigo.png" },
    { nombre: "Calabaza", minutos: 30, imagen: "calabaza.png" },
    { nombre: "Melón", minutos: 45, imagen: "melon.png" },
    { nombre: "Pepino", minutos: 60, imagen: "pepino.png" },
    { nombre: "Pimiento", minutos: 90, imagen: "pimiento.png" },
    { nombre: "Fresa", minutos: 120, imagen: "fresa.png" },
    { nombre: "Arándano", minutos: 180, imagen: "arandano.png" },
    { nombre: "Uva", minutos: 240, imagen: "uva.png" },
    { nombre: "Berenjena", minutos: 300, imagen: "berengena.png" },
    { nombre: "Sandía", minutos: 360, imagen: "sandia.png" },
    { nombre: "Fruta del dragón", minutos: 480, imagen: "fruta_del_dragon.png" },
    { nombre: "Piña", minutos: 600, imagen: "piña.png" },
    { nombre: "Baya de cristal", minutos: 720, imagen: "baya_de_cristal.png" },
    { nombre: "Carambola", minutos: 1080, imagen: "carambola.png" },
    { nombre: "Mora lunar", minutos: 1200, imagen: "mora_lunar.png" },
    { nombre: "Calabaza p. sol", minutos: 1320, imagen: "calabaza_petalo_del_sol.png" },
    { nombre: "Melón helado", minutos: 1440, imagen: "melon_helado.png" },
    { nombre: "Raíz de oro", minutos: 1560, imagen: "raiz_de_oro.png" },
    { nombre: "Uva Aurora", skip: false, minutos: 1680, imagen: "uva_aurora.png" },
    { nombre: "Chile fénix", minutos: 1800, imagen: "chile_fenix.png" }
];

// Arreglo de Semillas Premium
const semillasPremium = [
    { nombre: "Melaza", minutos: 300, imagen: "melaza.png" },
    { nombre: "Loto de cristal", minutos: 720, imagen: "loto_de_cristal.png" },
    { nombre: "Floración celestial", minutos: 1440, imagen: "floracion_celestial.png" }
];

// Fusión para el buscador interno
const baseDeDatosSemillas = [...semillasRegulares, ...semillasPremium];

let alarmasGuardadas = [];
try {
    alarmasGuardadas = JSON.parse(localStorage.getItem('alarmasFarmTown')) || [];
} catch (e) {
    console.log("Error leyendo el almacenamiento local:", e);
    alarmasGuardadas = [];
}

// Selectores Principales
const panelRegulares = document.getElementById('panel-regulares');
const panelPremium = document.getElementById('panel-premium');
const panelAlarmas = document.getElementById('panel-alarmas');
const sonidoAlarma = document.getElementById('sonido-alarma');
const sonidoClick = document.getElementById('sonido-click');

// Selectores del Modal
const btnInfo = document.getElementById('btn-info');
const modalInstrucciones = document.getElementById('modal-instrucciones');
const spanCerrar = document.querySelector('.cerrar-modal');

// Selectores de Donación
const btnDonar = document.getElementById('btn-donar');
const mensajeCopiado = document.getElementById('mensaje-copiado');
const direccionMetamask = "0x33EcAf1B6432ceCbB2EA129CE744512372BcDaF9";

// Lógica de copiar Billetera
btnDonar.onclick = () => {
    reproducirClick();
    navigator.clipboard.writeText(direccionMetamask).then(() => {
        mensajeCopiado.style.display = "block";
        setTimeout(() => {
            mensajeCopiado.style.display = "none";
        }, 3000); // El mensaje desaparece a los 3 segundos
    }).catch(err => {
        console.error('Error al copiar la dirección: ', err);
    });
};

// Funciones para abrir y cerrar las instrucciones
btnInfo.onclick = () => {
    desbloquearAudiosMóviles();
    reproducirClick();
    modalInstrucciones.style.display = "block";
};

spanCerrar.onclick = () => {
    reproducirClick();
    modalInstrucciones.style.display = "none";
};

// Cierra el modal si el usuario hace clic afuera de la caja
window.onclick = (event) => {
    if (event.target === modalInstrucciones) {
        modalInstrucciones.style.display = "none";
    }
};

// Variable bandera para ejecutar el truco una sola vez
let audiosDesbloqueados = false;

// Solo manipulamos la alarma de fondo silenciosamente una vez
function desbloquearAudiosMóviles() {
    if (audiosDesbloqueados) return; 

    if (sonidoAlarma) {
        sonidoAlarma.play().then(() => {
            sonidoAlarma.pause();
            sonidoAlarma.currentTime = 0;
        }).catch(() => {});
    }
    
    audiosDesbloqueados = true;
}

// El clic suena natural sin que nadie lo interrumpa
function reproducirClick() {
    if (sonidoClick) {
        sonidoClick.currentTime = 0; 
        sonidoClick.play().catch(e => console.log("Interacción requerida para audio."));
    }
}

function crearBotonesEnPanel(arraySemillas, contenedor) {
    if (!contenedor) return;
    contenedor.innerHTML = ''; 
    arraySemillas.forEach((semilla) => {
        let btn = document.createElement('button');
        btn.className = 'btn-semilla';
        
        let img = document.createElement('img');
        img.src = `Imagenes_FarmTown/${semilla.imagen}`;
        img.alt = semilla.nombre;
        
        let txt = document.createElement('span');
        txt.innerText = semilla.nombre;
        
        btn.appendChild(img);
        btn.appendChild(txt);
        
        btn.onclick = () => {
            desbloquearAudiosMóviles(); 
            reproducirClick(); 
            crearAlarma(semilla);
        };
        contenedor.appendChild(btn);
    });
}

function renderizarBotones() {
    crearBotonesEnPanel(semillasRegulares, panelRegulares);
    crearBotonesEnPanel(semillasPremium, panelPremium);
}

function crearAlarma(semilla) {
    const ahora = new Date();
    const tiempoCosecha = new Date(ahora.getTime() + semilla.minutos * 60000); 

    const nuevaAlarma = {
        id: Date.now(),
        nombre: semilla.nombre,
        horaActivacion: ahora.getTime(),
        horaCosecha: tiempoCosecha.getTime(),
        lista: false
    };

    alarmasGuardadas.push(nuevaAlarma);
    guardarEnLocal();
    renderizarAlarmas();
}

function renderizarAlarmas() {
    if (!panelAlarmas) return;
    panelAlarmas.innerHTML = ''; 
    alarmasGuardadas.sort((a, b) => a.horaCosecha - b.horaCosecha); 

    alarmasGuardadas.forEach(alarma => {
        const div = document.createElement('div');
        div.className = 'alarma-activa';

        const semillaData = baseDeDatosSemillas.find(s => s.nombre === alarma.nombre);
        const rutaImagen = semillaData ? `Imagenes_FarmTown/${semillaData.imagen}` : '';

        if (alarma.lista) {
            div.classList.add('alarma-lista');
            div.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${rutaImagen}" alt="${alarma.nombre}" style="width: 38px; height: 38px; object-fit: contain; image-rendering: pixelated; filter: drop-shadow(2px 2px 0px rgba(0,0,0,0.4));">
                    <span>¡<b>${alarma.nombre}</b> lista para cosechar!</span>
                </div>
            `;
        } else {
            div.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${rutaImagen}" alt="${alarma.nombre}" style="width: 38px; height: 38px; object-fit: contain; image-rendering: pixelated; filter: drop-shadow(2px 2px 0px rgba(0,0,0,0.4));">
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                        <span id="texto-fecha-${alarma.id}" style="font-size: 1.1rem;">Calculando...</span>
                        <span id="contador-${alarma.id}" style="color: #e68a2e; font-size: 1.2rem; font-weight: bold; text-shadow: 1px 1px 0 #000;">⏳ Calculando...</span>
                    </div>
                </div>
            `;
        }

        const btnEliminar = document.createElement('button');
        btnEliminar.className = 'btn-eliminar';
        btnEliminar.innerText = 'X';
        btnEliminar.onclick = () => {
            desbloquearAudiosMóviles();
            reproducirClick(); 
            eliminarAlarma(alarma.id);
        };
        
        div.appendChild(btnEliminar);
        panelAlarmas.appendChild(div);
    });
    
    actualizarContadores();
}

function actualizarContadores() {
    const ahoraDate = new Date();
    const ahoraMs = ahoraDate.getTime();
    const inicioHoy = new Date(ahoraDate.getFullYear(), ahoraDate.getMonth(), ahoraDate.getDate()).getTime();

    alarmasGuardadas.forEach(alarma => {
        if (!alarma.lista) {
            const contadorElemento = document.getElementById(`contador-${alarma.id}`);
            const fechaElemento = document.getElementById(`texto-fecha-${alarma.id}`);
            
            if (contadorElemento && fechaElemento) {
                const diferencia = alarma.horaCosecha - ahoraMs;
                if (diferencia > 0) {
                    const horas = Math.floor((diferencia / (1000 * 60 * 60)));
                    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
                    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

                    const h = horas.toString().padStart(2, '0');
                    const m = minutos.toString().padStart(2, '0');
                    const s = segundos.toString().padStart(2, '0');

                    contadorElemento.innerText = `⏳ Faltan: ${h}:${m}:${s}`;
                    
                    const fechaCosecha = new Date(alarma.horaCosecha);
                    const inicioCosecha = new Date(fechaCosecha.getFullYear(), fechaCosecha.getMonth(), fechaCosecha.getDate()).getTime();
                    
                    const diffDias = Math.round((inicioCosecha - inicioHoy) / (1000 * 60 * 60 * 24));
                    
                    const diaSemana = fechaCosecha.toLocaleDateString('es-VE', { weekday: 'long' });
                    const horaTexto = fechaCosecha.toLocaleTimeString('es-VE', {hour: '2-digit', minute:'2-digit'});
                    
                    let prefijoDia = "el día";
                    if (diffDias === 0) {
                        prefijoDia = "hoy";
                    } else if (diffDias === 1) {
                        prefijoDia = "mañana";
                    }
                    
                    fechaElemento.innerHTML = `${alarma.nombre} - Cosechar ${prefijoDia} <b style="text-transform: capitalize;">${diaSemana}</b> a las <b>${horaTexto}</b>`;
                }
            }
        }
    });
}

function eliminarAlarma(id) {
    alarmasGuardadas = alarmasGuardadas.filter(a => a.id !== id);
    guardarEnLocal();
    renderizarAlarmas();
    
    if (!alarmasGuardadas.some(a => a.lista)) {
        if (sonidoAlarma) {
            sonidoAlarma.pause();
            sonidoAlarma.currentTime = 0;
        }
    }
}

function guardarEnLocal() {
    try {
        localStorage.setItem('alarmasFarmTown', JSON.stringify(alarmasGuardadas));
    } catch(e) {
        console.log("No se pudo guardar en LocalStorage:", e);
    }
}

// Bucle central de tiempo (Corre cada 1 segundo)
setInterval(() => {
    const ahora = Date.now();
    let hayCambios = false;
    let hayAlarmaSonando = false;

    alarmasGuardadas.forEach(alarma => {
        if (!alarma.lista && ahora >= alarma.horaCosecha) {
            alarma.lista = true;
            hayCambios = true;
        }
        if (alarma.lista) {
            hayAlarmaSonando = true;
        }
    });

    if (hayCambios) {
        guardarEnLocal();
        renderizarAlarmas();
    } else {
        actualizarContadores();
    }

    if (hayAlarmaSonando) {
        document.title = document.title === "¡COSECHA LISTA! 🚨" ? "Alarmas Farm Town" : "¡COSECHA LISTA! 🚨";
        
        if (sonidoAlarma && sonidoAlarma.paused) {
            sonidoAlarma.play().catch(e => console.log("Esperando clic para sonar alarma principal."));
        }
    } else {
        document.title = "Alarmas Farm Town";
    }
}, 1000);

// Arranque inicial de la interfaz
renderizarBotones();
renderizarAlarmas();