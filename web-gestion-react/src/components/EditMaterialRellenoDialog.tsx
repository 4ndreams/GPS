import React, { useEffect, useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { editMaterial, editRelleno } from "@/services/materialesService";

// Debe coincidir con el tipo Item de MaterialesRellenos
export type Item = {
  id: number;
  nombre: string;
  caracteristicas?: string;
  tipo: 'Material' | 'Relleno';
};

interface EditMaterialRellenoDialogProps {
  item: Item | null;
  onClose: () => void;
  onItemUpdated: () => void;
}



const EditMaterialRellenoDialog: React.FC<EditMaterialRellenoDialogProps> = ({ item, onClose, onItemUpdated }) => {
  const [nombre, setNombre] = useState('');
  const [caracteristicas, setCaracteristicas] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<{ nombre?: string }>({});

  useEffect(() => {
    if (item) {
      setNombre(item.nombre);
      setCaracteristicas(item.caracteristicas || '');
      setError(null);
      setValidation({});
    }
  }, [item]);

  const validate = () => {
    const errors: { nombre?: string } = {};
    if (!nombre.trim()) errors.nombre = 'El nombre es obligatorio';
    return errors;
  };

  const handleSave = async () => {
    const errors = validate();
    setValidation(errors);
    if (Object.keys(errors).length > 0) return;
    if (!item) return;
    setSaving(true);
    setError(null);
    try {
      if (item.tipo === 'Material') {
        const updated = await editMaterial(item.id, { nombre_material: nombre, caracteristicas });
        if (!updated) throw new Error('Error al actualizar material');
      } else {
        const updated = await editRelleno(item.id, { nombre_relleno: nombre, caracteristicas });
        if (!updated) throw new Error('Error al actualizar relleno');
      }
      onItemUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (!item) return null;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar {item.tipo}</DialogTitle>
        <DialogDescription>Modifica los datos del {item.tipo.toLowerCase()}.</DialogDescription>
      </DialogHeader>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="space-y-4">
        <div>
          <label htmlFor="edit-nombre" className="text-sm font-medium">Nombre *</label>
          <Input
            id="edit-nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className={validation.nombre ? 'border-red-500' : ''}
            placeholder={`Nombre de ${item.tipo.toLowerCase()}`}
          />
          {validation.nombre && <span className="text-xs text-red-500">{validation.nombre}</span>}
        </div>
        <div>
          <label htmlFor="edit-caracteristicas" className="text-sm font-medium">Características</label>
          <Input
            id="edit-caracteristicas"
            value={caracteristicas}
            onChange={e => setCaracteristicas(e.target.value)}
            placeholder="Características (opcional)"
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={onClose} variant="outline" disabled={saving}>Cancelar</Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default EditMaterialRellenoDialog;
