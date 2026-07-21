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

//let activo = false;
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