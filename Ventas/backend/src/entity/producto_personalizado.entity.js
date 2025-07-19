"use strict"
import { EntitySchema } from "typeorm";
const ProductoPersonalizadoSchema = new EntitySchema({
    name: "ProductoPersonalizado",
    tableName: "productos_personalizados",
    columns: {
        id_producto_personalizado: {
        type: "int",
        primary: true,
        generated: true,
        },
        id_relleno: {
        type: "int",
        nullable: false,
        },
        id_material: {
        type: "int",
        nullable: false,
        },
        id_usuario: {
        type: "int",
        nullable: true,
        },
        medida_ancho: {
        type: "float",
        nullable: false,
        },
        medida_alto: {
        type: "float",  
        nullable: false,
        },
        medida_largo: {
        type: "float",  
        nullable: false,
        },
        tipo_puerta: {
        type: "varchar",
        length: 20,
        nullable: false,
        comment: "Tipo de puerta: 'puertaPaso' o 'puertaCloset'"
        },
        nombre_apellido_contacto: {
        type: "varchar",
        length: 255,
        nullable: false,
        },
        rut_contacto: {
        type: "varchar",
        length: 12,
        nullable: true,
        },
        email_contacto: {
        type: "varchar",    
        length: 255,
        nullable: false,
        },
        telefono_contacto: {
        type: "varchar",
        length: 20,
        nullable: false,
        },
        mensaje: {
        type: "text",
        nullable: false,
        },
        estado: {
        type: "varchar",
        length: 50,
        default: "Solicitud Recibida", 
        nullable: false,
        },
        createdAt: {
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
        updatedAt: {
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
            nullable: false,
        },
    },
    indices: [
        {
        name: "idx_producto_personalizado_id",
        columns: ["id_producto_personalizado"],
        unique: true,
        },
    ],
    relations: {
        material: {
            type: "many-to-one",
            target: "Material",
            joinColumn: {
                name: "id_material",
                referencedColumnName: "id_material"
            }
        },
        relleno: {
            type: "many-to-one", 
            target: "Relleno",
            joinColumn: {
                name: "id_relleno",
                referencedColumnName: "id_relleno"
            }
        },
        usuario: {
            type: "many-to-one",
            target: "Usuario",
            joinColumn: {
                name: "id_usuario",
                referencedColumnName: "id_usuario"
            },
            nullable: true
        }
    },
});

export default ProductoPersonalizadoSchema;