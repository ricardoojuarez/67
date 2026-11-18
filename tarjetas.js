const paletas = [
    { fondo: "#dbeafe", texto: "#1e3a5f", acento: "#2563eb" },
    { fondo: "#dcfce7", texto: "#14532d", acento: "#16a34a" },
    { fondo: "#fef3c7", texto: "#78350f", acento: "#d97706" },
    { fondo: "#fce7f3", texto: "#831843", acento: "#db2777" },
    { fondo: "#ede9fe", texto: "#4c1d95", acento: "#7c3aed" },
    { fondo: "#cffafe", texto: "#164e63", acento: "#0891b2" }
];

function prepararTarjeta(tarjeta, titulo, imagenUrl, datos) {
    const paleta = paletas[Math.floor(Math.random() * paletas.length)];
    tarjeta.style.background = paleta.fondo;
    tarjeta.style.color = paleta.texto;
    tarjeta.dataset.titulo = titulo;
    tarjeta.dataset.imagen = imagenUrl;
    tarjeta.dataset.texto = paleta.texto;
    tarjeta.dataset.datos = JSON.stringify(datos.filter(function (dato) {
        return dato.slice(dato.indexOf(":") + 1).trim() !== "";
    }));

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "descargar";
    boton.textContent = "Descargar tarjeta";
    boton.style.background = paleta.acento;
    boton.addEventListener("click", function () {
        descargarTarjeta(tarjeta);
    });
    tarjeta.appendChild(boton);
}

function descargarTarjeta(tarjeta) {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    const datos = JSON.parse(tarjeta.dataset.datos);
    const titulo = tarjeta.dataset.titulo;
    const fondo = window.getComputedStyle(tarjeta).backgroundColor;

    ctx.fillStyle = fondo;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const imagen = new Image();
    imagen.crossOrigin = "anonymous";
    imagen.onload = function () {
        dibujarImagen(ctx, imagen);
        dibujarTexto(ctx, titulo, datos, tarjeta.dataset.texto);
        guardarCanvas(canvas, titulo);
    };
    imagen.onerror = function () {
        ctx.fillStyle = "#d9dde3";
        ctx.fillRect(0, 0, canvas.width, 380);
        dibujarTexto(ctx, titulo, datos, tarjeta.dataset.texto);
        guardarCanvas(canvas, titulo);
    };
    imagen.src = tarjeta.dataset.imagen;
}

function dibujarImagen(ctx, imagen) {
    const ancho = 600;
    const alto = 380;
    const escala = Math.max(ancho / imagen.width, alto / imagen.height);
    const anchoRecortado = ancho / escala;
    const altoRecortado = alto / escala;
    const x = (imagen.width - anchoRecortado) / 2;
    const y = (imagen.height - altoRecortado) / 2;
    ctx.drawImage(imagen, x, y, anchoRecortado, altoRecortado, 0, 0, ancho, alto);
}

function dibujarTexto(ctx, titulo, datos, colorTexto) {
    ctx.fillStyle = colorTexto;
    ctx.font = "bold 38px Arial";
    ctx.fillText(titulo.substring(0, 24), 35, 440);

    ctx.font = "24px Arial";
    let y = 500;
    datos.forEach(function (dato) {
        if (dato && y < 760) {
            ctx.fillText(dato.substring(0, 42), 35, y);
            y += 42;
        }
    });
}

function guardarCanvas(canvas, titulo) {
    const enlace = document.createElement("a");
    enlace.download = titulo.replace(/[^a-z0-9]/gi, "-").toLowerCase() + "-tarjeta.png";
    enlace.href = canvas.toDataURL("image/png");
    enlace.click();
}
