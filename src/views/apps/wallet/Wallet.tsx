// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useContext, useEffect, useState } from 'react';
import CardBox from '../../../components/shared/CardBox';
import { Icon } from '@iconify/react';
import { AuthContext } from 'src/context/authContext/AuthContext';
import {
    getWallet,
    getTransactions,
    requestWithdrawal,
    WalletData,
    Transaction,
} from 'src/service/wallet';
import { Modal, Button, TextInput, Spinner } from 'flowbite-react';

const Wallet = () => {
    const { user }: any = useContext(AuthContext);
    const organizerId = user?._id;

    // State
    const [wallet, setWallet] = useState<WalletData | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [transactionsLoading, setTransactionsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Withdrawal modal state
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [withdrawError, setWithdrawError] = useState<string | null>(null);
    const [withdrawSuccess, setWithdrawSuccess] = useState(false);

    // Fetch wallet data
    const fetchWallet = async () => {
        if (!organizerId) return;
        try {
            setLoading(true);
            const data = await getWallet(organizerId);
            setWallet(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to load wallet');
        } finally {
            setLoading(false);
        }
    };

    // Fetch transactions
    const fetchTransactions = async (pageNum: number = 1) => {
        if (!organizerId) return;
        try {
            setTransactionsLoading(true);
            const data = await getTransactions(organizerId, pageNum, 10);
            setTransactions(data.result || []);
            setTotalPages(data.pagination?.totalPages || 1);
            setPage(pageNum);
        } catch (err: any) {
            console.error('Failed to load transactions:', err);
        } finally {
            setTransactionsLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        if (organizerId) {
            fetchWallet();
            fetchTransactions(1);
        }
    }, [organizerId]);

    // Handle withdrawal request
    const handleWithdraw = async () => {
        if (!organizerId || !withdrawAmount) return;

        const amount = parseFloat(withdrawAmount);
        if (isNaN(amount) || amount <= 0) {
            setWithdrawError('Please enter a valid amount');
            return;
        }

        if (wallet && amount > wallet.balance) {
            setWithdrawError('Insufficient balance');
            return;
        }

        try {
            setWithdrawLoading(true);
            setWithdrawError(null);
            await requestWithdrawal(organizerId, amount);
            setWithdrawSuccess(true);
            setWithdrawAmount('');
            // Refresh data
            fetchWallet();
            fetchTransactions(1);
            // Close modal after 2 seconds
            setTimeout(() => {
                setShowWithdrawModal(false);
                setWithdrawSuccess(false);
            }, 2000);
        } catch (err: any) {
            setWithdrawError(err.message || 'Failed to request withdrawal');
        } finally {
            setWithdrawLoading(false);
        }
    };

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Get transaction icon and color based on type
    const getTransactionStyle = (type: string, status: string) => {
        if (status === 'failed') {
            return { icon: 'solar:close-circle-line-duotone', color: 'text-error', bg: 'bg-error/10' };
        }
        switch (type) {
            case 'credit':
                return { icon: 'solar:arrow-down-line-duotone', color: 'text-success', bg: 'bg-success/10' };
            case 'debit':
            case 'withdrawal':
                return { icon: 'solar:arrow-up-line-duotone', color: 'text-warning', bg: 'bg-warning/10' };
            default:
                return { icon: 'solar:transfer-horizontal-line-duotone', color: 'text-primary', bg: 'bg-primary/10' };
        }
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-warning/10 text-warning',
            completed: 'bg-success/10 text-success',
            failed: 'bg-error/10 text-error',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Spinner size="xl" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <CardBox>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Icon icon="solar:danger-triangle-line-duotone" className="text-6xl text-error mb-4" />
                        <p className="text-error font-medium">{error}</p>
                        <button
                            onClick={fetchWallet}
                            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </CardBox>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="mb-6">
                <h4 className="text-xl font-semibold text-dark dark:text-white">Wallet</h4>
                <p className="text-sm text-bodydark dark:text-bodydark1">Manage your earnings and payouts</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {/* Balance Card */}
                <CardBox>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-primary/10">
                                <Icon icon="solar:wallet-line-duotone" className="text-3xl text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-bodydark dark:text-bodydark1">Available Balance</p>
                                <h3 className="text-2xl font-bold text-dark dark:text-white">
                                    {formatCurrency(wallet?.balance || 0)}
                                </h3>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowWithdrawModal(true)}
                            disabled={!wallet?.balance || wallet.balance <= 0}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                        >
                            Withdraw
                        </button>
                    </div>
                </CardBox>

                {/* Total Earnings Card */}
                <CardBox>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-success/10">
                            <Icon icon="solar:chart-2-line-duotone" className="text-3xl text-success" />
                        </div>
                        <div>
                            <p className="text-sm text-bodydark dark:text-bodydark1">Total Earnings</p>
                            <h3 className="text-2xl font-bold text-dark dark:text-white">
                                {formatCurrency(wallet?.totalEarnings || 0)}
                            </h3>
                        </div>
                    </div>
                </CardBox>

                {/* Pending Payout Card */}
                <CardBox>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-warning/10">
                            <Icon icon="solar:clock-circle-line-duotone" className="text-3xl text-warning" />
                        </div>
                        <div>
                            <p className="text-sm text-bodydark dark:text-bodydark1">Pending Payout</p>
                            <h3 className="text-2xl font-bold text-dark dark:text-white">
                                {formatCurrency(wallet?.pendingWithdrawals || 0)}
                            </h3>
                        </div>
                    </div>
                </CardBox>
            </div>

            {/* Transactions Section */}
            <CardBox>
                <div className="flex items-center justify-between mb-4">
                    <h5 className="text-lg font-semibold text-dark dark:text-white">Recent Transactions</h5>
                    <button
                        onClick={() => fetchTransactions(page)}
                        disabled={transactionsLoading}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <Icon
                            icon="solar:refresh-line-duotone"
                            className={`text-xl text-bodydark ${transactionsLoading ? 'animate-spin' : ''}`}
                        />
                    </button>
                </div>

                {transactionsLoading && transactions.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Icon icon="solar:wallet-money-line-duotone" className="text-6xl text-bodydark/50 mb-4" />
                        <p className="text-bodydark dark:text-bodydark1">No transactions yet</p>
                        <p className="text-sm text-bodydark/70 dark:text-bodydark1/70">
                            Your transaction history will appear here
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-bodydark dark:text-bodydark1">
                                            Transaction
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-bodydark dark:text-bodydark1">
                                            Date
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-bodydark dark:text-bodydark1">
                                            Status
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-bodydark dark:text-bodydark1">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((transaction) => {
                                        const style = getTransactionStyle(transaction.type, transaction.status);
                                        return (
                                            <tr
                                                key={transaction._id}
                                                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                            >
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${style.bg}`}>
                                                            <Icon icon={style.icon} className={`text-xl ${style.color}`} />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-dark dark:text-white text-sm">
                                                                {transaction.description}
                                                            </p>
                                                            {transaction.reference && (
                                                                <p className="text-xs text-bodydark/70 dark:text-bodydark1/70">
                                                                    Ref: {transaction.reference}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-bodydark dark:text-bodydark1">
                                                    {formatDate(transaction.createdAt)}
                                                </td>
                                                <td className="py-4 px-4">{getStatusBadge(transaction.status)}</td>
                                                <td className="py-4 px-4 text-right">
                                                    <span
                                                        className={`font-semibold ${transaction.type === 'credit' ? 'text-success' : 'text-dark dark:text-white'
                                                            }`}
                                                    >
                                                        {transaction.type === 'credit' ? '+' : '-'}
                                                        {formatCurrency(transaction.amount)}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <p className="text-sm text-bodydark dark:text-bodydark1">
                                    Page {page} of {totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => fetchTransactions(page - 1)}
                                        disabled={page <= 1 || transactionsLoading}
                                        className="px-3 py-1 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => fetchTransactions(page + 1)}
                                        disabled={page >= totalPages || transactionsLoading}
                                        className="px-3 py-1 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CardBox>

            {/* Withdrawal Modal */}
            <Modal show={showWithdrawModal} onClose={() => setShowWithdrawModal(false)} size="md">
                <Modal.Header>Request Withdrawal</Modal.Header>
                <Modal.Body>
                    {withdrawSuccess ? (
                        <div className="flex flex-col items-center py-6">
                            <div className="p-4 rounded-full bg-success/10 mb-4">
                                <Icon icon="solar:check-circle-line-duotone" className="text-5xl text-success" />
                            </div>
                            <p className="text-lg font-medium text-dark dark:text-white">Withdrawal Requested!</p>
                            <p className="text-sm text-bodydark dark:text-bodydark1">
                                Your withdrawal request has been submitted successfully.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-bodydark dark:text-bodydark1 mb-2">
                                    Available Balance: <strong>{formatCurrency(wallet?.balance || 0)}</strong>
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                                    Withdrawal Amount (₹)
                                </label>
                                <TextInput
                                    type="number"
                                    placeholder="Enter amount"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    min="1"
                                    max={wallet?.balance || 0}
                                />
                            </div>
                            {withdrawError && (
                                <div className="p-3 rounded-lg bg-error/10 text-error text-sm">{withdrawError}</div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                {!withdrawSuccess && (
                    <Modal.Footer>
                        <div className="flex gap-3 w-full justify-end">
                            <Button color="gray" onClick={() => setShowWithdrawModal(false)} disabled={withdrawLoading}>
                                Cancel
                            </Button>
                            <Button color="primary" onClick={handleWithdraw} disabled={withdrawLoading || !withdrawAmount}>
                                {withdrawLoading ? <Spinner size="sm" className="mr-2" /> : null}
                                Request Withdrawal
                            </Button>
                        </div>
                    </Modal.Footer>
                )}
            </Modal>
        </div>
    );
};

export default Wallet;
