import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, DialogTitle, DialogContent, Dialog, DialogActions, Button } from '@mui/material';
import { submitExcelData } from '../services/api.service';
import { FormModel } from '../models/formModel';

export interface ExcelModalProps {
  open: boolean;
  onClose: () => void;
  excelData: FormModel[];
}

interface ColumnDefinition {
  header: string;
  key: keyof FormModel;
}

const ExcelModal: React.FC<ExcelModalProps> = ({ open, onClose, excelData }) => {
  const columns: ColumnDefinition[] = [
    { header: 'Canal', key: 'canal' },
    { header: 'Producto', key: 'productId' },
    { header: 'Tipo de Documento', key: 'tipoDocumentoId' },
    { header: 'Numero de Documento', key: 'numeroDocumento' },
    { header: 'Nombre', key: 'nombreCliente' },
    { header: 'Limite Minimo DOP', key: 'minLimiteDOP' },
    { header: 'Limite Maximo DOP', key: 'maxLimiteDOP' },
    { header: 'Limite Minimo USD', key: 'minLimiteUSD' },
    { header: 'Limite Maximo USD', key: 'maxLimiteUSD' },
    { header: 'Limite DOP a solicitar', key: 'limiteDOP' },
    { header: 'Limite USD a solicitar', key: 'limiteUSD' }
  ]

  const handleSubmit = async () => {
    try {
      await submitExcelData(excelData);
      alert('Datos del Excel procesados correctamente');
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el archivo');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Datos del Excel</DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.key}>{column.header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {excelData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => (
                    <TableCell key={`${rowIndex}-${column.key}`}>
                      {row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Procesar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExcelModal;