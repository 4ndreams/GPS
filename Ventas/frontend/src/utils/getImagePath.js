// Devuelve la ruta de la imagen para un producto, usando la estructura tipo/nombreArchivo
export function getImagePath(path) {
  if (!path) return '/img/puertas/default.jpeg';
  return `/img/puertas/${path}`;
}
