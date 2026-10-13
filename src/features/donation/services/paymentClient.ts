import axios from 'axios';

const paymentClient = axios.create({
  baseURL: 'https://thenbm-329287861933.asia-south1.run.app/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default paymentClient;