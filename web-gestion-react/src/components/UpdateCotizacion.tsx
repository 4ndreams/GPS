import React, { useState, useEffect } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Label } from './ui/label';
import Notification from './Notification';
import type { CotizacionResponse } from '../services/cotizacionService';
import { obtenerMateriales, obtenerRellenos } from '../services/materialesService';
import type { Material, Relleno } from '../services/materialesService';

interface UpdateCotizacionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: Partial<CotizacionResponse> | null;
  loading?: boolean;
  error?: string | null;
  onSave: (data: Partial<CotizacionResponse>) => void;
}

const tipoPuertaOptions = [
  { value: 'puertaPaso', label: 'Puerta de Paso' },
  { value: 'puertaCloset', label: 'Puerta de Closet' },
];

export default function UpdateCotizacion({
  open,
  onOpenChange,
  initialData,
  loading = false,
  error = null,
  onSave,
}: Readonly<UpdateCotizacionProps>) {
  const [form, setForm] = useState<Partial<CotizacionResponse>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [rellenos, setRellenos] = useState<Relleno[]>([]);
  const [loadingMateriales, setLoadingMateriales] = useState(false);
  const [loadingRellenos, setLoadingRellenos] = useState(false);

  useEffect(() => {
    if (initialData) setForm(initialData);
    setFormError(null);
    setFieldErrors({});
  }, [initialData, open]);

  // Cargar materiales y rellenos al abrir el modal
  useEffect(() => {
    if (!open) return;
    setLoadingMateriales(true);
    setLoadingRellenos(true);
    obtenerMateriales()
      .then(setMateriales)
      .catch(() => setMateriales([]))
      .finally(() => setLoadingMateriales(false));
    obtenerRellenos()
      .then(setRellenos)
      .catch(() => setRellenos([]))
      .finally(() => setLoadingRellenos(false));
  }, [open]);

  // Validaciones equivalentes a Cotizar.tsx
const VALIDATION_RULES = {
  medidas: {
    ancho: {
      puertaPaso: { min: 60, max: 90 },
      puertaCloset: { min: 40, max: 60 },
    },
    alto: { min: 200, max: 240 },
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  nombre: {
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
  },
  rut: {
    pattern: /^\d{1,8}-[\dkK]$/
  }
};

function validateNombre(value: string): string | null {
  if (!value.trim()) return 'El nombre es requerido';
  if (value.length < VALIDATION_RULES.nombre.minLength) return `El nombre debe tener al menos ${VALIDATION_RULES.nombre.minLength} caracteres`;
  if (value.length > VALIDATION_RULES.nombre.maxLength) return `El nombre no puede tener más de ${VALIDATION_RULES.nombre.maxLength} caracteres`;
  if (!VALIDATION_RULES.nombre.pattern.test(value)) return 'El nombre solo puede contener letras y espacios';
  return null;
}

function validateEmail(value: string): string | null {
  if (!value.trim()) return 'El email es requerido';
  if (!VALIDATION_RULES.email.pattern.test(value)) return 'El formato del email no es válido';
  return null;
}

function validateRut(value: string): string | null {
  if (!value.trim()) return null; // RUT es opcional aquí
  if (!VALIDATION_RULES.rut.pattern.test(value)) return 'El formato del RUT no es válido (ej: 12345678-9)';
  const [rutBody, dv] = value.split('-');
  if (!rutBody || !dv) return 'El formato del RUT no es válido (ej: 12345678-9)';
  let sum = 0, multiplier = 2;
  for (let i = rutBody.length - 1; i >= 0; i--) {
    sum += parseInt(rutBody[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const remainder = sum % 11;
  const calculatedDv = 11 - remainder;
  let dvExpected = '';
  if (calculatedDv === 11) dvExpected = '0';
  else if (calculatedDv === 10) dvExpected = 'K';
  else dvExpected = calculatedDv.toString();
  if (dvExpected.toUpperCase() !== dv.toUpperCase()) return 'El RUT ingresado no es válido';
  return null;
}

function validateAncho(value: string | number, fieldName: string, tipoPuerta: string): string | null {
  const numValue = typeof value === 'number' ? value : parseFloat(value);
  if (!value || isNaN(numValue)) return `${fieldName} es requerido`;
  if (!tipoPuerta) return 'Primero debe seleccionar el tipo de puerta';
  const limits = VALIDATION_RULES.medidas.ancho[tipoPuerta as 'puertaPaso' | 'puertaCloset'];
  if (numValue < limits.min) {
    return `${fieldName} debe ser mayor a ${limits.min} cm para ${tipoPuerta === 'puertaPaso' ? 'puertas de paso' : 'puertas de closet'}`;
  }
  if (numValue > limits.max) {
    return `${fieldName} debe ser menor a ${limits.max} cm para ${tipoPuerta === 'puertaPaso' ? 'puertas de paso' : 'puertas de closet'}`;
  }
  return null;
}

function validateAlto(value: string | number, fieldName: string): string | null {
  const numValue = typeof value === 'number' ? value : parseFloat(value);
  if (!value || isNaN(numValue)) return `${fieldName} es requerido`;
  const limits = VALIDATION_RULES.medidas.alto;
  if (numValue < limits.min) {
    return `${fieldName} debe ser mayor a ${limits.min} cm`;
  }
  if (numValue > limits.max) {
    return `${fieldName} debe ser menor a ${limits.max} cm`;
  }
  return null;
}

function validateMedida(value: string | number, fieldName: string, dimension: 'ancho' | 'alto', tipoPuerta: string): string | null {
  if (dimension === 'ancho') {
    return validateAncho(value, fieldName, tipoPuerta);
  } else if (dimension === 'alto') {
    return validateAlto(value, fieldName);
  }
  return null;
}

  // Helpers for field validation to reduce complexity
  function getTipoPuertaError(value: any): string | null {
    if (!value || (value !== 'puertaPaso' && value !== 'puertaCloset')) {
      return 'Debe seleccionar un tipo de puerta válido';
    }
    return null;
  }



  // Validación individual de campos
  const validateFieldRealtime = (field: keyof CotizacionResponse, value: any) => {
    let error: string | null = null;
    switch (field) {
      case 'nombre_apellido_contacto':
        error = validateNombre(value || '');
        break;
      case 'email_contacto':
        error = validateEmail(value || '');
        break;
      case 'rut_contacto':
        error = validateRut(value || '');
        break;
      case 'tipo_puerta':
        error = getTipoPuertaError(value);
        break;
      case 'medida_ancho':
        error = validateMedida(value, 'El ancho', 'ancho', form.tipo_puerta || '');
        break;
      case 'medida_alto':
        error = validateMedida(value, 'El alto', 'alto', form.tipo_puerta || '');
        break;
      default:
        error = null;
    }
    setFieldErrors(prev => ({ ...prev, [field]: error }));
    if (formError && error !== formError) setFormError(null);
  };

  const handleChange = (field: keyof CotizacionResponse, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    validateFieldRealtime(field, value);
  };

  // Helpers to extract id_material and id_relleno
  function getMaterialId(material: any): number | undefined {
    if (material) {
      if (typeof material === 'object' && material !== null && 'id_material' in material) {
        return material.id_material;
      } else if (!isNaN(Number(material))) {
        return Number(material);
      }
    }
    return undefined;
  }

  function getRellenoId(relleno: any): number | undefined {
    if (relleno) {
      if (typeof relleno === 'object' && relleno !== null && 'id_relleno' in relleno) {
        return relleno.id_relleno;
      } else if (!isNaN(Number(relleno))) {
        return Number(relleno);
      }
    }
    return undefined;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validaciones igual que Cotizar.tsx
    const nombreError = validateNombre(form.nombre_apellido_contacto || '');
    const emailError = validateEmail(form.email_contacto || '');
    const rutError = validateRut(form.rut_contacto || '');
    const tipoPuertaError = (!form.tipo_puerta || (form.tipo_puerta !== 'puertaPaso' && form.tipo_puerta !== 'puertaCloset')) ? 'Debe seleccionar un tipo de puerta válido' : null;
    const anchoError = validateMedida(form.medida_ancho ?? '', 'El ancho', 'ancho', form.tipo_puerta || '');
    const altoError = validateMedida(form.medida_alto ?? '', 'El alto', 'alto', form.tipo_puerta || '');

    setFieldErrors({
      nombre_apellido_contacto: nombreError,
      email_contacto: emailError,
      rut_contacto: rutError,
      tipo_puerta: tipoPuertaError,
      medida_ancho: anchoError,
      medida_alto: altoError,
    });

    const allErrors = [nombreError, emailError, rutError, tipoPuertaError, anchoError, altoError].filter(Boolean);
    if (allErrors.length > 0) {
      setFormError(allErrors[0] as string);
      return;
    }

    // Enviar espesor como medida_largo según el tipo de puerta
    let espesor: number | undefined = undefined;
    if (form.tipo_puerta === 'puertaPaso') espesor = 45;
    else if (form.tipo_puerta === 'puertaCloset') espesor = 18;

    // Extraer solo los ids para material y relleno usando helpers
    const id_material = getMaterialId(form.material);
    const id_relleno = getRellenoId(form.relleno);

    // Eliminar id_producto_personalizado, material, relleno y usuario antes de enviar al backend
    const { id_producto_personalizado, material, relleno, usuario, ...rest } = form;
    const formConLargo = {
      ...rest,
      medida_largo: espesor,
      ...(id_material !== undefined ? { id_material } : {}),
      ...(id_relleno !== undefined ? { id_relleno } : {}),
    };
    onSave(formConLargo);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Cotización</DialogTitle>
          <DialogDescription>Modifica los datos principales de la cotización.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Material y Relleno en la misma fila */}
            <div>
              <Label>Material</Label>
              {/*
                Extraer el valor del material para evitar ternarios anidados en JSX
              */}
              {(() => {
                // eslint-disable-next-line
                var materialValue = '';
                if (typeof form.material === 'object' && form.material !== null) {
                  materialValue = String(form.material.id_material);
                } else if (form.material) {
                  materialValue = String(form.material);
                }
                return (
                  <Select
                    value={materialValue}
                    onValueChange={v => handleChange('material', v)}
                    disabled={loading || loadingMateriales}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione un material" />
                    </SelectTrigger>
                    <SelectContent>
                      {materiales.map(mat => (
                        <SelectItem key={mat.id_material} value={String(mat.id_material)}>
                          {mat.nombre_material}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              })()}
            </div>
            <div>
              <Label>Relleno</Label>
              {(() => {
                let rellenoValue = '';
                if (typeof form.relleno === 'object' && form.relleno !== null) {
                  rellenoValue = String(form.relleno.id_relleno);
                } else if (form.relleno) {
                  rellenoValue = String(form.relleno);
                }
                return (
                  <Select
                    value={rellenoValue}
                    onValueChange={v => handleChange('relleno', v)}
                    disabled={loading || loadingRellenos}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione un relleno" />
                    </SelectTrigger>
                    <SelectContent>
                      {rellenos.map(rel => (
                        <SelectItem key={rel.id_relleno} value={String(rel.id_relleno)}>
                          {rel.nombre_relleno}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              })()}
            </div>
            <div>
              <Label>Nombre</Label>
              <Input
                value={form.nombre_apellido_contacto || ''}
                onChange={e => handleChange('nombre_apellido_contacto', e.target.value)}
                required
                disabled={loading}
              />
              {fieldErrors.nombre_apellido_contacto && (
                <span className="text-xs text-red-600">{fieldErrors.nombre_apellido_contacto}</span>
              )}
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email_contacto || ''}
                onChange={e => handleChange('email_contacto', e.target.value)}
                required
                disabled={loading}
              />
              {fieldErrors.email_contacto && (
                <span className="text-xs text-red-600">{fieldErrors.email_contacto}</span>
              )}
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input
                value={form.telefono_contacto || ''}
                onChange={e => handleChange('telefono_contacto', e.target.value)}
                disabled={loading}
              />
              {fieldErrors.telefono_contacto && (
                <span className="text-xs text-red-600">{fieldErrors.telefono_contacto}</span>
              )}
            </div>
            <div>
              <Label>RUT</Label>
              <Input
                value={form.rut_contacto || ''}
                onChange={e => handleChange('rut_contacto', e.target.value)}
                disabled={loading}
              />
              {fieldErrors.rut_contacto && (
                <span className="text-xs text-red-600">{fieldErrors.rut_contacto}</span>
              )}
            </div>
            <div>
              <Label>Tipo de Puerta</Label>
              <Select
                value={form.tipo_puerta || ''}
                onValueChange={v => handleChange('tipo_puerta', v)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de puerta" />
                </SelectTrigger>
                <SelectContent>
                  {tipoPuertaOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.tipo_puerta && (
                <span className="text-xs text-red-600">{fieldErrors.tipo_puerta}</span>
              )}
            </div>
            <div>
              <Label>Mensaje</Label>
              <Input
                value={form.mensaje || ''}
                onChange={e => handleChange('mensaje', e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <Label>Ancho (cm)</Label>
              <Input
                type="text"
                inputMode="decimal"
                pattern="^[0-9]*[.,]?[0-9]*$"
                value={form.medida_ancho ?? ''}
                onChange={e => {
                  // Permitir solo números y decimales
                  const val = e.target.value.replace(',', '.');
                  if (/^\d*\.?\d*$/.test(val) || val === '') {
                    handleChange('medida_ancho', val);
                  }
                }}
                disabled={loading}
              />
              {fieldErrors.medida_ancho && (
                <span className="text-xs text-red-600">{fieldErrors.medida_ancho}</span>
              )}
            </div>
            <div>
              <Label>Alto (cm)</Label>
              <Input
                type="text"
                inputMode="decimal"
                pattern="^[0-9]*[.,]?[0-9]*$"
                value={form.medida_alto ?? ''}
                onChange={e => {
                  const val = e.target.value.replace(',', '.');
                  if (/^\d*\.?\d*$/.test(val) || val === '') {
                    handleChange('medida_alto', val);
                  }
                }}
                disabled={loading}
              />
              {fieldErrors.medida_alto && (
                <span className="text-xs text-red-600">{fieldErrors.medida_alto}</span>
              )}
            </div>
            {/* Espesor según tipo de puerta */}
            <div>
              <Label className="block">Espesor</Label>
              <div className="mt-[8px] ml-[8px]">
                {form.tipo_puerta === 'puertaPaso' && <span>45 mm</span>}
                {form.tipo_puerta === 'puertaCloset' && <span>18 mm</span>}
                {!form.tipo_puerta && <span className="text-gray-400">Seleccione tipo de puerta</span>}
              </div>
            </div>
          </div>
          {(formError || error) && (
            <Notification
              type="error"
              title="Error"
              message={(formError || error) ?? undefined}
              onClose={() => setFormError(null)}
            />
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              Guardar cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
