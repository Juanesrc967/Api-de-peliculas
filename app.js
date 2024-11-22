let Pagina = 1;
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');
const inputBusqueda = document.getElementById('inputBusqueda');

btnSiguiente.addEventListener('click', () => {
    if (Pagina < 1000) {
        Pagina += 1;
        cargarpelis();
    }
});

btnAnterior.addEventListener('click', () => {
    if (Pagina > 1) {
        Pagina -= 1;
        cargarpelis();
    }
});

inputBusqueda.addEventListener('input', () => {
    const query = inputBusqueda.value;
    if (query) {
        buscarPeliculas(query);
    } else {
        cargarpelis();  
    }
});

const cargarpelis = async () => {
    try {
        const Respuesta = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=fbf35eff2d4e6b983489b8b08fbe6063&language=es-MX&page=${Pagina}`);

        if (Respuesta.status === 200) {
            const datos = await Respuesta.json();
            mostrarPeliculas(datos.results);
        } else {
            manejarErrores(Respuesta.status);
        }
    } catch (error) {
        console.log('Error al realizar la solicitud a la API:', error);
    }
}

const buscarPeliculas = async (query) => {
    try {
        const Respuesta = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=fbf35eff2d4e6b983489b8b08fbe6063&language=es-MX&query=${query}&page=${Pagina}`);

        if (Respuesta.status === 200) {
            const datos = await Respuesta.json();
            mostrarPeliculas(datos.results, query); 
        } else {
            manejarErrores(Respuesta.status);
        }
    } catch (error) {
        console.log('Error al realizar la solicitud a la API:', error);
    }
}

const mostrarPeliculas = (peliculas, query = '') => {
    let htmlPeliculas = '';

    if (peliculas.length === 0) {
        htmlPeliculas = `<p>No se encontraron resultados para "${query}".</p>`; 
    } else {
        peliculas.forEach(pelicula => {
            htmlPeliculas += `
                <div class="pelicula" onclick="mostrarDetalles(${pelicula.id})">
                    <img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}" alt="Póster de ${pelicula.title}">
                    <h3 class="titulo">${pelicula.title}</h3>
                </div>
            `;
        });
    }

    document.getElementById('contenedor').innerHTML = htmlPeliculas;
}


const mostrarDetalles = async (id) => {
    try {
        const Respuesta = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=e243446be1755ba89275758cc7631b10&language=es-MX`);

        if (Respuesta.status === 200) {
            const pelicula = await Respuesta.json();

            // Rellenar los datos del modal
            document.getElementById('tituloModal').textContent = pelicula.title;
            document.getElementById('posterModal').src = `https://image.tmdb.org/t/p/w500/${pelicula.poster_path}`;
            document.getElementById('descripcionModal').textContent = pelicula.overview || 'Descripción no disponible.';
            document.getElementById('generosModal').textContent = pelicula.genres.map(genero => genero.name).join(', ') || 'Géneros no disponibles.';
            document.getElementById('puntuacionModal').textContent = pelicula.vote_average || 'Sin puntuación.';

            // Ajustar el tamaño del modal al contenido
            const modalContent = document.querySelector('.modal-content');
            modalContent.style.width = 'auto'; // Ajusta el ancho según el contenido
            modalContent.style.height = 'auto'; // Ajusta la altura según el contenido

            // Mostrar el modal
            document.getElementById('modal').style.display = "block";
        } else {
            manejarErrores(Respuesta.status);
        }
    } catch (error) {
        console.log('Error al obtener detalles de la película:', error);
    }
};


const manejarErrores = (status) => {
    if (status === 401) {
        console.log('Llave errónea o no válida');
    } else if (status === 404) {
        console.log('Película no encontrada');
    } else {
        console.log('Hubo un error en tu búsqueda');
    }
}

cargarpelis();

const modal = document.getElementById('modal');
const closeModal = document.getElementById('close');

closeModal.addEventListener('click', () => {
    modal.style.display = "none";
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

//Seguridad
// Deshabilitar clic derecho
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Deshabilitar F12 (Herramientas de desarrollo)
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12') {
        e.preventDefault();
    }else if (e.ctrlKey && e.shiftKey && e.key === 'I') { 
        e.preventDefault();
    } else if (e.ctrlKey && e.shiftKey && e.key === 'J') { 
        e.preventDefault();
    }else if (e.ctrlKey && e.key === 'U') { 
        e.preventDefault();
    }
});


