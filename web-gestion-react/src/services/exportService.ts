import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface OrdenDespacho {
  id: string;
  fecha: string;
  trabajadorFabrica: string;
  estado: string;
  prioridad: string;
  totalProductos: number;
  valorTotal: number;
  vendedora?: string;
}

export const exportToPDF = (ordenes: OrdenDespacho[], filename: string = 'ordenes-despacho') => {
  const doc = new jsPDF()
  
  // Título del documento
  doc.setFontSize(20)
  doc.text('Órdenes de Despacho TERPLAC', 14, 22)
  
  // Fecha de generación
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 14, 32)
  
  // Preparar datos para la tabla
  const tableData = ordenes.map(orden => [
    orden.id,
    orden.trabajadorFabrica,
    orden.estado,
    orden.prioridad,
    `${orden.totalProductos} unidades`,
    `$${orden.valorTotal.toLocaleString()}`,
    orden.fecha,
    orden.vendedora || 'No especificado'
  ])
  
  // Configurar y generar la tabla
  autoTable(doc, {
    head: [
      ['ID', 'Trabajador', 'Estado', 'Prioridad', 'Productos', 'Valor Total', 'Fecha', 'Producto']
    ],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [220, 53, 69], // Rojo TERPLAC
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250],
    },
    columnStyles: {
      0: { cellWidth: 15 }, // ID
      1: { cellWidth: 35 }, // Trabajador
      2: { cellWidth: 25 }, // Estado
      3: { cellWidth: 20 }, // Prioridad
      4: { cellWidth: 25 }, // Productos
      5: { cellWidth: 25 }, // Valor Total
      6: { cellWidth: 20 }, // Fecha
      7: { cellWidth: 30 }, // Producto
    },
    didDrawPage: function (data) {
      // Agregar pie de página
      const pageCount = doc.getNumberOfPages()
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text(`Página ${data.pageNumber} de ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10)
    },
  })
  
  // Guardar el PDF
  doc.save(`${filename}.pdf`)
}

export const exportToExcel = (ordenes: OrdenDespacho[], filename: string = 'ordenes-despacho') => {
  // Crear contenido CSV (formato simple que Excel puede abrir)
  const headers = ['ID', 'Trabajador', 'Estado', 'Prioridad', 'Productos', 'Valor Total', 'Fecha', 'Producto']
  const csvContent = [
    headers.join(','),
    ...ordenes.map(orden => [
      orden.id,
      `"${orden.trabajadorFabrica}"`,
      `"${orden.estado}"`,
      `"${orden.prioridad}"`,
      `${orden.totalProductos} unidades`,
      `$${orden.valorTotal.toLocaleString()}`,
      orden.fecha,
      `"${orden.vendedora || 'No especificado'}"`
    ].join(','))
  ].join('\n')
  
  // Crear y descargar archivo
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportToCSV = (ordenes: OrdenDespacho[], filename: string = 'ordenes-despacho') => {
  // Similar a Excel pero con extensión .csv
  exportToExcel(ordenes, filename)
} 