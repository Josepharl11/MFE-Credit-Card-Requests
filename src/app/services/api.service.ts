import axios from 'axios';
import { FormModel } from '../models/formModel';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getChannels = () => {
    return axios.get(`${API_URL}/channel`);
};

export const getDocumentTypes = () => {
    return axios.get(`${API_URL}/documenttype`);
};

export const getCustomer = (documenttype: string, documentnumber: string) => {
    return axios.get(`${API_URL}/customer`, {
        params: { documenttype, documentnumber },
    });
};

export const getProducts = () => {
    return axios.get(`${API_URL}/product`);
};

export const getProductLimits = (id: number) => {
    return axios.get(`<span class="math-inline">\{API_URL\}/product/</span>{id}/limits`);
};

export const submitFormData = (data: FormModel): Promise<{ message: string}> => {
    return axios.post(`${API_URL}/solicitud`, data);
}

export const submitExcelData = (data: FormModel[]): Promise<{ message: string}> => {
    return axios.post(`${API_URL}/solicitud/excel`, data);
};