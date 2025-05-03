export class FormModel {
  canal: number | null = null;
  productId: number | null = null;
  tipoDocumentoId: number | null = null;
  numeroDocumento: string = '';
  nombreCliente: string = '';
  minLimiteDOP: number = 0;
  maxLimiteDOP: number = 0;
  minLimiteUSD: number = 0;
  maxLimiteUSD: number = 0;
  limiteDOP: number = 0;
  limiteUSD: number = 0;
}