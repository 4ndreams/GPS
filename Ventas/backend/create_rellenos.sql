-- Script SQL para crear rellenos directamente
INSERT INTO relleno (id_relleno, nombre_relleno, caracteristicas) VALUES 
(1, 'Panal de Abeja', 'Ligero y resistente, ideal para puertas interiores'),
(2, 'Macizo', 'Estructura sólida, máxima resistencia y durabilidad'),
(3, 'Laminado', 'Láminas de madera intercaladas, balance entre peso y resistencia'),
(4, 'Espuma de Poliuretano', 'Aislamiento térmico y acústico, liviano'),
(5, 'Tubular', 'Estructura hueca con refuerzos internos, económico')
ON CONFLICT (id_relleno) DO NOTHING;
