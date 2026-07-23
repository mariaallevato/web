const links = document.querySelectorAll('nav a[data-target]');
const sections = document.querySelectorAll('.content-section');
const inicio = document.getElementById('inicio');
const contacto = document.getElementById('contacto');

function showSection(name) {
    // ocultar secciones
    sections.forEach(s => {
        s.classList.remove('active');
        s.setAttribute('aria-hidden','true');
    });

    document.body.classList.remove('mostrar-flor');

    // manejar inicio
    if (name === 'inicio') {
        inicio.style.display = 'flex';
    } else {
        inicio.style.display = 'none';
    }

    // mostrar flor solo en clases
    if (name === 'clases') {
        document.body.classList.add('mostrar-flor');
    }

    // contacto scrollea
    if (name === 'contacto') {
        contacto.scrollIntoView({behavior: 'smooth'});
    return;
    }

    // mostrar seccion normal
    if (name !== 'inicio') {
        const sec = document.getElementById(name);

    if (sec) {
        sec.classList.add('active');
        sec.setAttribute('aria-hidden','false');
        sec.scrollIntoView({behavior: 'smooth'});
    }
    }
}

links.forEach(link => {
    link.addEventListener('click', (e) => {
    e.preventDefault();
    
    links.forEach(l => l.classList.remove('active-link'));
    link.classList.add('active-link');
    
    const target = link.getAttribute('data-target');
    showSection(target);
    });
});

document.addEventListener('DOMContentLoaded', () => showSection('inicio'));

// boton volver a inicio
document.querySelectorAll('.volver-inicio').forEach(btn => {
    btn.addEventListener('click', (e) => {
    e.preventDefault();
    showSection('inicio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});



///////////////
// Burger menu

let activo = false;
const burger = document.getElementById("burger");
const menu = document.querySelector(".menu-nav");

burger.addEventListener("click", function () {
    //activo = !activo;
    menu.classList.toggle("open");

    burger.classList.toggle("active");
    menu.style.display = activo ? "block" : "none";
});


window.addEventListener("resize", () => {
    if (window.innerWidth > 600) {
        activo = false;
        burger.classList.remove("active");
        menu.classList.remove("open")
    }
});


/////////////////////
// Form contacto
/*
const formContacto = document.getElementById("form-contacto");
formContacto.addEventListener("submit", () => {

    alert("Email enviado!");

    formContacto.reset();
});
*/

/////////////////////////
// Copyright del footer
let mensajeFooter = `© ${new Date().getFullYear()} María Allevato. Todos los derechos reservados.`
document.getElementById("footer-copyright").innerHTML = mensajeFooter;
// ================================
//// NOTAS MUSICALES DEL MENÚ
// ================================

const sonidos = {
    inicio: new Audio("AUDIO/01DO.mp3"),
    bio: new Audio("AUDIO/02RE.mp3"),
    musica: new Audio("AUDIO/03MI.mp3"),
    agenda: new Audio("AUDIO/04FA.mp3"),
    galeria: new Audio("AUDIO/05SOL.mp3"),
    clases: new Audio("AUDIO/06LA.mp3"),
    contacto: new Audio("AUDIO/07SI.mp3"),
    fin: new Audio("AUDIO/08DO.mp3")
};


// Precargar y ajustar volumen
Object.values(sonidos).forEach(audio => {
    audio.preload = "auto";
    audio.volume = 0.45;
});

// PRUEBA DE SECUENCIA
    const secuenciaCorrecta = [
    "inicio",
    "bio",
    "musica",
    "agenda",
    "galeria",
    "clases",
    "contacto"
];

let progreso = 0;
    function mostrarEasterEgg() {

    const egg = document.getElementById("easter-egg");

    egg.classList.add("visible");

    setTimeout(() => {
        egg.classList.remove("visible");
    }, 4000);

}

    

document.querySelectorAll("nav a").forEach(enlace => {

    enlace.addEventListener("mouseenter", () => {

        const nombre = enlace.dataset.target;

        if (!nombre) return;

        const sonido = sonidos[nombre];

        if (!sonido) return;

        // Reinicia la nota para que siempre suene desde el principio
        sonido.pause();
        sonido.currentTime = 0,2;
        sonido.play().catch(() => {});
        // Verificar secuencia
if (nombre === secuenciaCorrecta[progreso]) {

    progreso++;

    if (progreso === secuenciaCorrecta.length) {

        sonidos.fin.pause();
        sonidos.fin.currentTime = 0;
        sonidos.fin.play();

        mostrarEasterEgg();

        progreso = 0;
    }

} else {

    progreso = (nombre === secuenciaCorrecta[0]) ? 1 : 0;

}

        // Brillo del texto
        enlace.classList.add("nota-activa");

        setTimeout(() => {
            enlace.classList.remove("nota-activa");
        }, 350);

    });

});
