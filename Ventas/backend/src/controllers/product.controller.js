"use strict";
import { AppDataSource } from "../config/configDb.js";
import ProductoSchema from "../entity/producto.entity.js";
import { uploadImage } from "../services/uploadImage.service.js";
import { createImagenService } from "../services/imagenes.service.js";

const productoRepo = AppDataSource.getRepository("Producto");

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { nombre, minPrecio, maxPrecio, categoria } = req.query;

    const productRepo = AppDataSource.getRepository("Producto");
    let query = productRepo.createQueryBuilder("producto")
      .leftJoinAndSelect("producto.tipo", "tipo")
      .leftJoinAndSelect("producto.imagenes", "imagenes")
      .leftJoinAndSelect("producto.material", "material")
      .leftJoinAndSelect("producto.relleno", "relleno");

    if (nombre) {
      query = query.andWhere("producto.nombre_producto ILIKE :nombre", { nombre: `%${nombre}%` });
    }
    if (minPrecio) {
      query = query.andWhere("producto.precio >= :minPrecio", { minPrecio });
    }
    if (maxPrecio) {
      query = query.andWhere("producto.precio <= :maxPrecio", { maxPrecio });
    }
    if (categoria) {
      query = query.andWhere("tipo.nombre_tipo ILIKE :categoria", { categoria });
    }

    const productos = await query.getMany();

    // No sobrescribir el campo imagen, dejar que el frontend use imagenes
    const productosConImagen = productos;

    return res.json({ status: "success", data: productosConImagen });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Error al obtener productos" });
  }
};


// GET /api/products/:id
export const getProductById = async (req, res) => {
  const id = parseInt(req.params.id);
  
  // Validar que el ID sea un número válido
  if (isNaN(id)) {
    return res.status(400).json({ 
      success: false, 
      message: "ID de producto inválido" 
    });
  }
  
  try {
    const producto = await productoRepo.findOne({
      where: { id_producto: id },
      relations: ["material", "tipo", "imagenes"],
    });

    if (!producto) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    // Si el usuario está autenticado, registra el evento
    if (req.user && req.user.id_usuario) {
      const userEventRepo = AppDataSource.getRepository("UserEvent");

      const nuevoEvento = userEventRepo.create({
        tipo_evento: "PRODUCT_VIEW",
        usuario: { id_usuario: req.user.id_usuario },
        producto: { id_producto: producto.id_producto },
        metadata: {
          // Puedes agregar detalles útiles aquí
          userAgent: req.headers["user-agent"],
          ip: req.ip,
        },
      });

      await userEventRepo.save(nuevoEvento);
    }

    res.json({ success: true, data: producto });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error al buscar el producto", error: err.message });
  }
};


// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const {
      nombre_producto,
      precio,
      stock,
      descripcion,
      medida_ancho,
      medida_largo,
      medida_alto,
      id_material,
      id_tipo,
    } = req.body;

    const nuevoProducto = productoRepo.create({
      nombre_producto,
      precio,
      stock,
      descripcion,
      medida_ancho,
      medida_largo,
      medida_alto,
      material: { id_material },
      tipo: { id_tipo },
    });

    await productoRepo.save(nuevoProducto);
    res.status(201).json({ success: true, message: "Producto creado", data: nuevoProducto });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error al crear el producto", error: err.message });
  }
};

// PATCH /api/products/:id
export const updateProduct = async (req, res) => {
  const id = parseInt(req.params.id);

  // Validar que el ID sea un número válido
  if (isNaN(id)) {
    return res.status(400).json({ 
      success: false, 
      message: "ID de producto inválido" 
    });
  }

  try {
    const producto = await productoRepo.findOneBy({ id_producto: id });
    if (!producto) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    productoRepo.merge(producto, req.body);
    const productoActualizado = await productoRepo.save(producto);

    res.json({ success: true, message: "Producto actualizado", data: productoActualizado });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error al actualizar el producto", error: err.message });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  const id = parseInt(req.params.id);

  // Validar que el ID sea un número válido
  if (isNaN(id)) {
    return res.status(400).json({ 
      success: false, 
      message: "ID de producto inválido" 
    });
  }

  try {
    const resultado = await productoRepo.delete({ id_producto: id });

    if (resultado.affected === 0) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    res.json({ success: true, message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error al eliminar el producto", error: err.message });
  }
};

export const getTipos = async (req, res) => {
  try {
    const tipos = await AppDataSource.getRepository(TipoSchema).find();
    res.json({ success: true, data: tipos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener tipos" });
  }
};

export const getMateriales = async (req, res) => {
  try {
    const materiales = await AppDataSource.getRepository(MaterialSchema).find();
    res.json({ success: true, data: materiales });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener materiales" });
  }
};

// Nuevos métodos para productos con imágenes
export const createProductoConImagenesController = async (req, res) => {
  try {
    // Extraer datos del producto del body
    const productoData = {
      nombre_producto: req.body.nombre_producto,
      precio: parseFloat(req.body.precio),
      stock: parseInt(req.body.stock),
      descripcion: req.body.descripcion,
      medida_ancho: req.body.medida_ancho ? parseFloat(req.body.medida_ancho) : null,
      medida_largo: req.body.medida_largo ? parseFloat(req.body.medida_largo) : null,
      medida_alto: req.body.medida_alto ? parseFloat(req.body.medida_alto) : null,
      id_material: req.body.id_material ? parseInt(req.body.id_material) : null,
      id_tipo: req.body.id_tipo ? parseInt(req.body.id_tipo) : null,
      id_relleno: req.body.id_relleno ? parseInt(req.body.id_relleno) : null,
    };

    // Crear el producto primero
    const nuevoProducto = productoRepo.create({
      ...productoData,
      material: productoData.id_material ? { id_material: productoData.id_material } : null,
      tipo: productoData.id_tipo ? { id_tipo: productoData.id_tipo } : null,
    });

    await productoRepo.save(nuevoProducto);

    // Procesar imágenes si existen
    const imagenes = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          // Subir imagen a MinIO
          const ruta_imagen = await uploadImage(file);
          
          // Crear registro de imagen en BD
          const imagenData = {
            ruta_imagen: ruta_imagen,
            id_producto: nuevoProducto.id_producto
          };
          
          const nuevaImagen = await createImagenService(imagenData);
          if (nuevaImagen) {
            imagenes.push(nuevaImagen);
          }
        } catch (error) {
          console.error('Error al procesar imagen:', error);
          // Continuar con las demás imágenes
        }
      }
    }

    // Obtener producto completo con imágenes
    const productoCompleto = await productoRepo.findOne({
      where: { id_producto: nuevoProducto.id_producto },
      relations: ["material", "tipo", "imagenes"]
    });

    res.status(201).json({ 
      success: true, 
      message: "Producto creado exitosamente con imágenes", 
      data: productoCompleto 
    });
  } catch (error) {
    console.error('Error en createProductoConImagenesController:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor", 
      error: error.message 
    });
  }
};

export const updateProductoConImagenesController = async (req, res) => {
  try {
    const { id } = req.params;
    const id_producto = parseInt(id);
    
    // Extraer datos del producto del body
    const productoData = {
      nombre_producto: req.body.nombre_producto,
      precio: req.body.precio ? parseFloat(req.body.precio) : undefined,
      stock: req.body.stock ? parseInt(req.body.stock) : undefined,
      descripcion: req.body.descripcion,
      medida_ancho: req.body.medida_ancho ? parseFloat(req.body.medida_ancho) : undefined,
      medida_largo: req.body.medida_largo ? parseFloat(req.body.medida_largo) : undefined,
      medida_alto: req.body.medida_alto ? parseFloat(req.body.medida_alto) : undefined,
      id_material: req.body.id_material ? parseInt(req.body.id_material) : undefined,
      id_tipo: req.body.id_tipo ? parseInt(req.body.id_tipo) : undefined,
      id_relleno: req.body.id_relleno ? parseInt(req.body.id_relleno) : undefined,
    };

    // Filtrar campos undefined
    const productoDataFiltrado = Object.fromEntries(
      Object.entries(productoData).filter(([_, value]) => value !== undefined)
    );

    // Actualizar el producto
    const producto = await productoRepo.findOneBy({ id_producto });
    if (!producto) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    productoRepo.merge(producto, productoDataFiltrado);
    const productoActualizado = await productoRepo.save(producto);

    // Procesar nuevas imágenes si existen
    const nuevasImagenes = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          // Subir imagen a MinIO
          const ruta_imagen = await uploadImage(file);
          
          // Crear registro de imagen en BD
          const imagenData = {
            ruta_imagen: ruta_imagen,
            id_producto: id_producto
          };
          
          const nuevaImagen = await createImagenService(imagenData);
          if (nuevaImagen) {
            nuevasImagenes.push(nuevaImagen);
          }
        } catch (error) {
          console.error('Error al procesar imagen:', error);
        }
      }
    }

    // Obtener producto completo con imágenes
    const productoCompleto = await productoRepo.findOne({
      where: { id_producto },
      relations: ["material", "tipo", "imagenes"]
    });

    res.json({ 
      success: true, 
      message: "Producto actualizado exitosamente", 
      data: productoCompleto 
    });
  } catch (error) {
    console.error('Error en updateProductoConImagenesController:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor", 
      error: error.message 
    });
  }
};

