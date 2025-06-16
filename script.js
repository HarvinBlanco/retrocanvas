async function generarFondo() {
  const dob = document.getElementById("dob").value;
  if (!dob) return alert("Por favor ingresa tu fecha de nacimiento.");

  const year = new Date(dob).getFullYear();
  const tendencias = obtenerTendencias(year);

  await fetchUnsplashImages(tendencias, year);

  const canvas = document.getElementById("canvas"),
        ctx = canvas.getContext("2d");

  ctx.fillStyle = tendencias.colorFondo;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const imgs = [
    { img: new Image(), url: tendencias.songImage, x: 550, y: 50, size: 180 },
    { img: new Image(), url: tendencias.movieImage, x: 550, y: 250, size: 180 },
    { img: new Image(), url: tendencias.fashionImage, x: 50,  y: 350, size: 180 },
  ];

  await Promise.all(imgs.map(o => new Promise(res => {
    o.img.src = o.url;
    o.img.onload = res;
    o.img.onerror = res;
  })));

  imgs.forEach(o => {
    if (o.img.complete) ctx.drawImage(o.img, o.x, o.y, o.size, o.size);
  });

  ctx.fillStyle = "white";
  ctx.font = "bold 36px Arial";
  ctx.fillText(`Año: ${year}`, 30, 60);

  ctx.font = "22px Arial";
  ctx.fillText(`🎵 ${tendencias.cancion}`, 30, 120);
  ctx.fillText(`🎬 ${tendencias.pelicula}`, 30, 170);
  ctx.fillText(`🧢 ${tendencias.moda}`, 30, 220);
  ctx.fillText(`🎨 ${tendencias.colores}`, 30, 270);

  document.getElementById("fondo").classList.remove("hidden");
  document.getElementById("descargar").href = canvas.toDataURL("image/png");

  document.getElementById("img-song").src = tendencias.songImage;
  document.getElementById("img-movie").src = tendencias.movieImage;
  document.getElementById("img-fashion").src = tendencias.fashionImage;
}

function obtenerTendencias(year) {
  const base = {
    1995: {
      cancion: "Gangsta’s Paradise",
      pelicula: "Toy Story",
      moda: "Gorros de pescador y overoles",
      colores: "Neón y púrpura",
      colorFondo: "#663399",
    },
    2001: {
      cancion: "Lady Marmalade",
      pelicula: "El Señor de los Anillos",
      moda: "Pantalones de campana",
      colores: "Azul metálico y plateado",
      colorFondo: "#1e90ff",
    },
  };
  return base[year] || {
    cancion: "Hit del año",
    pelicula: "Película popular",
    moda: "Estilo en tendencia",
    colores: "Colores icónicos",
    colorFondo: "#444"
  };
}

async function fetchUnsplashImages(data, year) {
  const key = "94a1e4ba2f450e3b5891fe12b91e1aa41b1449fd67cbff5f3f14484b725f18a4"; // clave de prueba

  async function fetchOne(query) {
    try {
      const res = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=${key}`
      );
      const js = await res.json();
      return js.urls.small;
    } catch (e) {
      return "https://i.imgur.com/placeholder.png";
    }
  }

  data.songImage = await fetchOne(`${year} music artist`);
  data.movieImage = await fetchOne(`${year} movie scene`);
  data.fashionImage = await fetchOne(`${year} fashion trend`);
}
