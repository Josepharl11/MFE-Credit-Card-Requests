'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect  } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Container,
  Typography,
  Paper,
  Box,
  SelectChangeEvent,
  keyframes,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { FormModel } from '../models/formModel';
import Header from '../components/Header';
import { useRouter } from 'next/navigation';
import { getChannels, getDocumentTypes, getProducts, getProductLimits, submitFormData } from '../services/api.service';
import * as XLSX from 'xlsx';
import ExcelModal from '../components/ExcelModal';
import theme from '../themes/theme';
import * as dotenv from 'dotenv';

dotenv.config();

const limitesTarjetas = {
  'Mastercard Standard': {
    minDOP: 5000,
    maxDOP: 50000,
    minUSD: 100,
    maxUSD: 1000,
  },
  'Visa Gold': {
    minDOP: 50000,
    maxDOP: 250000,
    minUSD: 1000,
    maxUSD: 5000,
  },
};

const channelValues: { [key: string]: number } = {
  'APP': 2,
  'Contact Center': 1
};

const productValues: { [key: string]: number } = {
  'Mastercard Standard': 1,
  'Visa Gold': 2
};

const documentTypeValues: { [key: string]: number } = {
  'Cedula': 2,
  'Pasaporte': 1
};

const headerMapping: { [key: string]: string } = {
  'Canal': 'canal',
  'Producto': 'productId',
  'Tipo de Documento': 'tipoDocumentoId',
  'Numero de Documento': 'numeroDocumento',
  'Nombre': 'nombreCliente',
  'Limite Minimo DOP': 'minLimiteDOP',
  'Limite Maximo DOP': 'maxLimiteDOP',
  'Limite Minimo USD': 'minLimiteUSD',
  'Limite Maximo USD': 'maxLimiteUSD',
  'Limite DOP a solicitar': 'limiteDOP',
  'Limite USD a solicitar': 'limiteUSD'
};

export default function Home() {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/');
  };

  const [channels, setChannels] = useState<{ id: number; name: string }[]>([]);
  const [documentTypes, setDocumentTypes] = useState<{ id: number; name: string }[]>([]);
  const [products, setProducts] = useState<{ id: number; name: string }[]>([]);
  const [productLimits, setProductLimits] = useState<{
    minLimitDop: number;
    maxLimitDop: number;
    minLimitUSD: number;
    maxLimitUSD: number;
  }>({ minLimitDop: 0, maxLimitDop: 0, minLimitUSD: 0, maxLimitUSD: 0 });
  const [formValues, setFormValues] = useState<FormModel>(new FormModel());
  const [excelModalOpen, setExcelModalOpen] = useState(false);
  const [excelData, setExcelData] = useState<any[]>([]);

  useEffect(() => {
    getChannels().then((response) => setChannels(response.data));
    getDocumentTypes().then((response) => setDocumentTypes(response.data));
    getProducts().then((response) => setProducts(response.data));
  }, []);

  const handleTextFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
  
    if (name === 'producto') {
      const selectedProduct = products.find((p) => p.id.toString() === value);
      if (selectedProduct) {
        const limites = limitesTarjetas[selectedProduct.name as keyof typeof limitesTarjetas] || {
          minDOP: 0, maxDOP: 0, minUSD: 0, maxUSD: 0
        };
  
        setFormValues({
          ...formValues,
          productId: selectedProduct.id,
          minLimiteDOP: limites.minDOP,
          maxLimiteDOP: limites.maxDOP,
          minLimiteUSD: limites.minUSD,
          maxLimiteUSD: limites.maxUSD,
        });
      }
    } else if (name === 'tipoDocumento') {
      const selectedDocType = documentTypes.find((doc) => doc.id.toString() === value);
      if (selectedDocType) {
        setFormValues({
          ...formValues,
          tipoDocumentoId: selectedDocType.id,
        });
      }
    } else if (name === 'canal') {
      const selectedChannel = channels.find(({id}) => id.toString() === value);
      if (selectedChannel) {
        setFormValues({
          ...formValues,
          canal: selectedChannel.id,
        });
      }
    } else {
      setFormValues({
        ...formValues,
        [name]: value
      });
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await submitFormData(formValues);
      alert('Solicitud enviada correctamente')
      console.log('Solicitud enviada:', {
        ...formValues,
        productId: formValues.productId ?? 'No seleccionado',
        tipoDocumentoId: formValues.tipoDocumentoId ?? 'No seleccionado',
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar la solicitud');
    }
  };

  const handleButtonClick = () => {
    document.getElementById('excel-upload')?.click();
  };

  const handleExcelUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const workSheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(workSheet);

      const processedData = rawData.map((row: any) => {
        const transformedRow: any = {};

        Object.entries(row).forEach(([key, value]) => {
          const internalKey = headerMapping[key];
          if (internalKey) {
            transformedRow[internalKey] = value;
          }
        });

        const processedRow = {
          ...transformedRow,
          canal: channelValues[transformedRow.canal] || transformedRow.canal,
          productId: productValues[transformedRow.productId] || transformedRow.productId,
          tipoDocumentoId: documentTypeValues[transformedRow.tipoDocumentoId] || transformedRow.tipoDocumentoId,
          limiteDOP: Number(transformedRow.limiteDOP),
          limiteUSD: Number(transformedRow.limiteUSD),
          minLimiteDOP: Number(transformedRow.minLimiteDOP),
          maxLimiteDOP: Number(transformedRow.maxLimiteDOP),
          minLimiteUSD: Number(transformedRow.minLimiteUSD),
          maxLimiteUSD: Number(transformedRow.maxLimiteUSD)
        };

        return processedRow;
      });

      console.log('Datos transformados:', processedData);
      setExcelData(processedData);
      setExcelModalOpen(true);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownloadTemplate = () => {
    const template = [
      {
        'Canal': 'APP',
        'Producto': 'Mastercard Standard',
        'Tipo de Documento': 'Cedula',
        'Nombre': 'Joseph',
        'Limite Minimo DOP': '5000',
        'Limite Maximo DOP': '50000',
        'Limite Minimo USD': '100',
        'Limite Maximo USD': '1000',
        'Limite DOP a solicitar': '15000',
        'Limite USD a solicitar': '450',
      }
    ]

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Plantilla');
    XLSX.writeFile(wb, 'plantilla_solicitudes.xlsx');
  }

  return (
    <ThemeProvider theme={theme}>
      <Header title="Solicitudes de tarjetas de crédito" />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper elevation = {8} sx={{ padding: 2, borderRadius: 2 }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="canal-label">Canal</InputLabel>
                  <Select
                    labelId="canal-label"
                    id="canal"
                    name="canal"
                    value={formValues.canal?.toString() || ''}
                    label="Canal"
                    onChange={handleSelectChange}
                  >
                    {channels.map((channel) => (
                    <MenuItem key={channel.id} value={channel.id.toString()}>
                      {channel.name}
                    </MenuItem>
                  ))}
                  </Select>
                </FormControl>
              </Box>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="tipo-documento-label">Tipo de documento</InputLabel>
                <Select
                  labelId="tipo-documento-label"
                  id="tipo-documento"
                  name="tipoDocumento"
                  value={formValues.tipoDocumentoId?.toString() || ''}
                  label="Tipo de documento"
                  onChange={handleSelectChange}
                >
                  {documentTypes.map((docType) => (
                  <MenuItem key={docType.id} value={docType.id.toString()}>
                    {docType.name}
                  </MenuItem>
                ))}
                </Select>
              </FormControl>
              <TextField
                label="Número de documento"
                fullWidth
                sx={{ mt: 2 }}
                name="numeroDocumento"
                value={formValues.numeroDocumento}
                onChange={handleTextFieldChange}
              />
              <TextField
                label="Nombre del cliente"
                fullWidth
                sx={{ mt: 2 }}
                name="nombreCliente"
                value={formValues.nombreCliente}
                onChange={handleTextFieldChange}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation = {8} sx={{ padding: 2, borderRadius: 2 }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="producto-label">Producto</InputLabel>
                  <Select
                    labelId="producto-label"
                    id="producto"
                    name="producto"
                    value={formValues.productId?.toString() || ''}
                    label="Producto"
                    onChange={handleSelectChange}
                  >
                    {products.map((product) => (
                    <MenuItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </MenuItem>
                  ))}
                  </Select>
                </FormControl>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Min Limite DOP"
                    fullWidth
                    sx={{ mt: 2 }}
                    name="minLimiteDOP"
                    value={formValues.minLimiteDOP}
                    disabled 
                    onChange={handleTextFieldChange}
                  />
                  <TextField
                    label="Max Limite DOP"
                    fullWidth
                    sx={{ mt: 2 }}
                    name="maxLimiteDOP"
                    value={formValues.maxLimiteDOP}
                    disabled 
                    onChange={handleTextFieldChange}
                  />
                  <TextField
                    label="Límite DOP a solicitar"
                    fullWidth
                    sx={{ mt: 2 }}
                    name="limiteDOP"
                    value={formValues.limiteDOP}
                    type="number"
                    inputProps={{ min: 0 }}
                    onChange={handleTextFieldChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Min Limite USD"
                    fullWidth
                    sx={{ mt: 2 }}
                    name="minLimiteUSD"
                    value={formValues.minLimiteUSD}
                    disabled  
                    onChange={handleTextFieldChange}
                  />
                  <TextField
                    label="Max Limite USD"
                    fullWidth
                    sx={{ mt: 2 }}
                    name="maxLimiteUSD"
                    value={formValues.maxLimiteUSD}
                    disabled 
                    onChange={handleTextFieldChange}
                  />
                  <TextField
                    label="Limite USD a solicitar"
                    fullWidth
                    sx={{ mt: 2 }}
                    name="limiteUSD"
                    value={formValues.limiteUSD}
                    onChange={handleTextFieldChange}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} sx={{ mt: 3, textAlign: 'center' }}>
            <input type="file"
            accept=".xlsx, .xls"
            id="excel-upload"
            style={{ display: 'none' }}
            onChange={handleExcelUpload}
            />
            <Button variant="outlined" onClick={handleDownloadTemplate} sx={{ mr: 2 }}>
              Descargar Plantilla
            </Button>
            <Button variant="outlined" onClick={handleButtonClick} sx={{ mr: 2 }}>
              Procesar Excel
              <img src="/sheet.png" alt="Procesar Excel" style={{ width: '24px', height: '24px', marginLeft: '8px' }} />
            </Button>
            <Button variant="outlined" onClick={handleCancel} sx={{ mr: 2 }}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Generar Solicitud
            </Button>
          </Grid>
          <ExcelModal 
            open={excelModalOpen} 
            onClose={() => setExcelModalOpen(false)} 
            excelData={excelData}
          ></ExcelModal>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}