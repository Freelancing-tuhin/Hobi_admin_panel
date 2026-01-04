import axios from 'axios';
import { API_BASE_URL } from 'src/config';

export interface WalletData {
  _id: string;
  organizerId: string;
  balance: number;
  totalEarnings: number;
  totalWithdrawals: number;
  pendingWithdrawals: number;
  lastTransactionAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  type: 'credit' | 'debit' | 'withdrawal';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  reference?: string;
}

export interface TransactionsResponse {
  result: Transaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Get wallet
export const getWallet = async (organizerId: string): Promise<WalletData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/wallet?organizerId=${organizerId}`);
    return response.data.result;
  } catch (error: any) {
    console.error('Error fetching wallet:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch wallet');
  }
};

// Request withdrawal
export const requestWithdrawal = async (organizerId: string, amount: number) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/wallet/withdraw`, {
      organizerId,
      amount,
    });
    return response.data.result;
  } catch (error: any) {
    console.error('Error requesting withdrawal:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to request withdrawal');
  }
};

// Get transactions
export const getTransactions = async (
  organizerId: string,
  page: number = 1,
  limit: number = 20
): Promise<TransactionsResponse> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/wallet/transactions?organizerId=${organizerId}&page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching transactions:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch transactions');
  }
};
