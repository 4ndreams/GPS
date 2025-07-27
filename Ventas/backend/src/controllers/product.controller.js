"use strict";
import { AppDataSource } from "../config/configDb.js";
import ProductoSchema from "../entity/producto.entity.js";

const productoRepo = AppDataSource.getRepository("Producto");

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { nombre, minPrecio, maxPrecio, categoria } = req.query;

    const productRepo = AppDataSource.getRepository("Producto");
    let query = productRepo.createQueryBuilder("producto")
      .leftJoinAndSelect("producto.tipo", "tipo")
      .leftJoinAndSelect("producto.imagenes", "imagenes");
      .leftJoinAndSelect("producto.material", "material")
      .leftJoinAndSelect("producto.relleno", "relleno"); // <-- Aquí incluyes la relación relleno

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

    const productosConImagen = productos.map(p => ({
      ...p,
      imagen: p.imagenes?.length > 0 ? p.imagenes[0].ruta_imagen : "default.jpeg",
    }));

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
      relations: ["material", "tipo"],
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