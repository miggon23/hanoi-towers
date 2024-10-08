let towers = {
    A: [],
    B: [],
    C: []
};

let remainingMoves = 0;

// Mostrar la velocidad en el span cada vez que se mueve el slider
function mostrarVelocidad() {
    const velocidad = document.getElementById("velocidad").value;
    document.getElementById("valorVelocidad").textContent = `${velocidad} ms`;
}

function crearDiscos(numDiscos) {
    const torreA = document.getElementById("torreA");
    const torreB = document.getElementById("torreB");
    const torreC = document.getElementById("torreC");

    // Limpiar todas las torres
    const discosA = torreA.querySelectorAll('.disc');
    discosA.forEach(disco => disco.remove());
    
    const discosB = torreB.querySelectorAll('.disc');
    discosB.forEach(disco => disco.remove());
    
    const discosC = torreC.querySelectorAll('.disc');
    discosC.forEach(disco => disco.remove());

    // Resetear el estado de las torres
    towers = { A: [], B: [], C: [] };

    // Crear los discos en la torre A
    for (let i = numDiscos; i >= 1; i--) {
        const disc = document.createElement("div");
        disc.classList.add("disc", `disc-${i}`);
        disc.style.bottom = `${(numDiscos - i) * 25}px`;
        torreA.appendChild(disc);
        towers.A.push(disc); // Añadir el disco a la torre A
    }
    remainingMoves = Math.pow(2, numDiscos) - 1;
    actualizarTiempoRestante();
}

function moverVisualmente(origen, destino, velocidad) {
    const torreOrigen = document.getElementById(`torre${origen}`);
    const torreDestino = document.getElementById(`torre${destino}`);
    
    const disco = towers[origen].pop(); // Eliminar el disco de la torre origen
    towers[destino].push(disco); // Añadirlo a la torre destino
    
    const numDiscosEnDestino = towers[destino].length;

    // Calcular desplazamiento horizontal
    const posOrigen = torreOrigen.getBoundingClientRect().left;
    const posDestino = torreDestino.getBoundingClientRect().left;
    const desplazamiento = posDestino - posOrigen;

    // Antes de mover el disco, ajustar z-index
    disco.style.zIndex = "20"; // Asegurar que se mantenga al frente

    // Ajustar la posición de "bottom" para apilar los discos correctamente
    disco.style.bottom = `${(numDiscosEnDestino - 1) * 25}px`;

    // Mover disco horizontalmente con transform
    disco.style.transition = `transform ${velocidad}ms ease, bottom ${velocidad}ms ease`;
    disco.style.transform = `translateX(${desplazamiento}px)`;

    // Después de moverlo, colocarlo en la nueva torre
    setTimeout(() => {
        torreDestino.appendChild(disco);
        disco.style.transform = ''; // Resetear la transformación una vez colocado
        disco.style.zIndex = "10"; // Restablecer el z-index después de mover
        remainingMoves--;
        actualizarTiempoRestante();
    }, velocidad); // Ajustar el tiempo para que coincida con la duración de la animación
}

function actualizarTiempoRestante(){
    const velocidad = parseInt(document.getElementById("velocidad").value);
    remainingTime = (remainingMoves * velocidad) / 1000;

    document.getElementById("valor-movimientos-restantes").textContent = `${remainingMoves} movimientos restantes`
    document.getElementById("estimated-time").textContent = `${remainingTime} segundos restantes`;
}

function moverDiscos(n, origen, destino, auxiliar, delay = 500) {
    // Obtener la velocidad del slider
    const velocidad = parseInt(document.getElementById("velocidad").value);
    // console.log(`Velocidad: ${velocidad} ms`);

    if (n === 1) {
        setTimeout(() => {
            moverVisualmente(origen, destino, velocidad);
            console.log(`Mover disco de ${origen} a ${destino}`);
        }, delay);
        return delay + velocidad; // Incrementar el delay según la velocidad
    }

    delay = moverDiscos(n - 1, origen, auxiliar, destino, delay);
    setTimeout(() => {
        moverVisualmente(origen, destino, velocidad);
        console.log(`Mover disco de ${origen} a ${destino}`);
    }, delay);
    delay = moverDiscos(n - 1, auxiliar, destino, origen, delay + velocidad);
    
    return delay;
}

function iniciarHanoi() {
    const numDiscos = document.getElementById("numDiscos").value;
    crearDiscos(numDiscos);
    moverDiscos(numDiscos, 'A', 'C', 'B');
}
