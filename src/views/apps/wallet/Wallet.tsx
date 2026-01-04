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
import { Modal, Spinner } from 'flowbite-react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';

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
            fetchWallet();
            fetchTransactions(1);
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
            return { icon: 'solar:close-circle-line-duotone', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' };
        }
        switch (type) {
            case 'credit':
                return { icon: 'solar:arrow-down-line-duotone', color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' };
            case 'debit':
            case 'withdrawal':
                return { icon: 'solar:arrow-up-line-duotone', color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' };
            default:
                return { icon: 'solar:transfer-horizontal-line-duotone', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' };
        }
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
            completed: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
            failed: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
        };
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Spinner size="xl" />
                    <p className="mt-4 text-gray-500 dark:text-gray-400">Loading wallet...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <CardBox>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-4">
                            <Icon icon="solar:danger-triangle-bold-duotone" className="text-5xl text-red-500" />
                        </div>
                        <p className="text-red-600 dark:text-red-400 font-semibold text-lg mb-2">Unable to Load Wallet</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{error}</p>
                        <button
                            onClick={fetchWallet}
                            className="px-6 py-2.5 bg-gradient-to-r from-[#b03052] to-[#8a2542] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#b03052]/30 transition-all flex items-center gap-2"
                        >
                            <Icon icon="solar:refresh-linear" height={18} />
                            Try Again
                        </button>
                    </div>
                </CardBox>
            </div>
        );
    }

    const BCrumb = [
        {
            to: '/',
            title: 'Home',
        },
        {
            title: 'Wallet',
        },
    ];
    return (
        <div className="p-4 md:p-6">
            <BreadcrumbComp title="Business Wallet" items={BCrumb} />


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 items-center">
                {/* Bank Card with Account Details - LEFT SIDE */}
                <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl pt-8 px-8 shadow-2xl overflow-hidden">
                    {/* Card Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                    </div>

                    {/* Card Content */}
                    <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#b03052] to-[#8a2542] rounded-xl flex items-center justify-center">
                                    <Icon icon="solar:wallet-bold" height={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs uppercase tracking-wider">Linked Account</p>
                                    <p className="text-white/80 text-xl font-medium uppercase">{user?.full_name || 'Organizer'}</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <div className="w-8 h-8 bg-red-500 rounded-full opacity-80" />
                                <div className="w-8 h-8 bg-yellow-500 rounded-full opacity-80 -ml-3" />
                            </div>
                        </div>

                        {/* Account Number */}
                        <div className="mb-8">
                            <p className="text-gray-400 text-md mb-1">Account Number</p>
                            <p className="text-white/80 font-mono text-3xl tracking-widest">
                                {user?.bank_account
                                    ? `**** **** ${user.bank_account.slice(-4) || '****'}`
                                    : '**** **** **** ****'
                                }
                            </p>
                        </div>

                        {/* IFSC and Account Type */}
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <p className="text-gray-400 text-md mb-1">IFSC Code</p>
                                <p className="text-white/80 font-mono tracking-wider text-xl">
                                    {user?.IFSC_code || 'XXXXXXXXX'}
                                </p>
                            </div>
                            <div className="text-right">
                                <button
                                    onClick={() => setShowWithdrawModal(true)}
                                    disabled={!wallet?.balance || wallet.balance <= 0}
                                    className="w-full py-3 bg-gradient-to-r px-3 from-[#b03052] to-[#8a2542] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#b03052]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Icon icon="solar:card-send-bold" height={20} />
                                    Withdraw
                                </button>
                            </div>
                        </div>

                        {/* Withdraw Button */}

                    </div>


                </div>

                {/* Stats Cards - RIGHT SIDE (2x2 Grid) */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Balance Card */}
                    <CardBox className="!p-5">
                        <div className="flex flex-col h-full">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/50 rounded-xl flex items-center justify-center mb-3">
                                <Icon icon="solar:wallet-money-bold-duotone" height={24} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Balance</p>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                {formatCurrency(wallet?.balance || 0)}
                            </h3>
                        </div>
                    </CardBox>

                    {/* Total Withdrawals Card */}
                    <CardBox className="!p-5">
                        <div className="flex flex-col h-full">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50 rounded-xl flex items-center justify-center mb-3">
                                <Icon icon="solar:card-send-bold-duotone" height={24} className="text-amber-600 dark:text-amber-400" />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Withdrawals</p>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                {formatCurrency(wallet?.totalWithdrawals || 0)}
                            </h3>
                        </div>
                    </CardBox>

                    {/* Total Earnings Card */}
                    <CardBox className="!p-5">
                        <div className="flex flex-col h-full">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-xl flex items-center justify-center mb-3">
                                <Icon icon="solar:chart-2-bold-duotone" height={24} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Earnings</p>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                {formatCurrency(wallet?.totalEarnings || 0)}
                            </h3>
                        </div>
                    </CardBox>

                    {/* Wallet Status Card */}
                    <CardBox className="!p-5">
                        <div className="flex flex-col h-full">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${wallet?.isActive
                                ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/50'
                                : 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50'
                                }`}>
                                <Icon
                                    icon={wallet?.isActive ? "solar:verified-check-bold-duotone" : "solar:close-circle-bold-duotone"}
                                    height={24}
                                    className={wallet?.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}
                                />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Wallet Status</p>
                            <h3 className={`text-xl font-bold ${wallet?.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                {wallet?.isActive ? 'Active' : 'Inactive'}
                            </h3>
                        </div>
                    </CardBox>
                </div>
            </div>

            {/* Quick Info Banner */}
            <div className="bg-gradient-to-r from-[#b03052]/10 to-[#8a2542]/10 border border-[#b03052]/20 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                    <Icon icon="solar:info-circle-bold" height={20} className="text-[#b03052]" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Withdrawals are processed within 2-3 business days to your linked bank account.
                    </p>
                </div>
            </div>

            {/* Transactions Section */}
            <CardBox>
                <div className="p-2">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-xl flex items-center justify-center">
                                <Icon icon="solar:history-bold-duotone" height={22} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h5 className="text-lg font-bold text-gray-800 dark:text-white">Transaction History</h5>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Your recent wallet activities</p>
                            </div>
                        </div>
                        <button
                            onClick={() => fetchTransactions(page)}
                            disabled={transactionsLoading}
                            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                        >
                            <Icon
                                icon="solar:refresh-bold-duotone"
                                className={`text-xl text-gray-500 ${transactionsLoading ? 'animate-spin' : ''}`}
                            />
                        </button>
                    </div>

                    {transactionsLoading && transactions.length === 0 ? (
                        <div className="flex items-center justify-center py-16">
                            <Spinner size="lg" />
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                                <Icon icon="solar:wallet-money-bold-duotone" className="text-5xl text-gray-300 dark:text-gray-600" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 font-semibold mb-1">No transactions yet</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                Your transaction history will appear here
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2 border-gray-100 dark:border-gray-700">
                                            <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Transaction
                                            </th>
                                            <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Date & Time
                                            </th>
                                            <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="text-right py-4 px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
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
                                                    className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                                >
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.bg}`}>
                                                                <Icon icon={style.icon} className={`text-xl ${style.color}`} />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-800 dark:text-white text-sm">
                                                                    {transaction.description}
                                                                </p>
                                                                {transaction.reference && (
                                                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                                                                        {transaction.reference}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {formatDate(transaction.createdAt)}
                                                        </p>
                                                    </td>
                                                    <td className="py-4 px-4">{getStatusBadge(transaction.status)}</td>
                                                    <td className="py-4 px-4 text-right">
                                                        <span
                                                            className={`font-bold text-base ${transaction.type === 'credit' ? 'text-emerald-500' : 'text-gray-800 dark:text-white'
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
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span>
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => fetchTransactions(page - 1)}
                                            disabled={page <= 1 || transactionsLoading}
                                            className="px-4 py-2 text-sm font-medium rounded-xl border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                                        >
                                            <Icon icon="solar:arrow-left-linear" height={16} />
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => fetchTransactions(page + 1)}
                                            disabled={page >= totalPages || transactionsLoading}
                                            className="px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-[#b03052] to-[#8a2542] text-white hover:shadow-lg hover:shadow-[#b03052]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                                        >
                                            Next
                                            <Icon icon="solar:arrow-right-linear" height={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </CardBox>

            {/* Security Footer */}
            <div className="bg-gradient-to-r mt-6 from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
                        <Icon icon="solar:shield-check-bold" className="text-emerald-600 dark:text-emerald-400" height={22} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm">Secure Transactions</h4>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">Your funds are protected with bank-grade security</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon icon="solar:lock-bold" className="text-emerald-600 dark:text-emerald-400" height={16} />
                        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">256-bit SSL</span>
                    </div>
                </div>
            </div>

            {/* Withdrawal Modal */}
            <Modal show={showWithdrawModal} onClose={() => setShowWithdrawModal(false)} size="md">
                <Modal.Header>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#b03052] to-[#8a2542] rounded-xl flex items-center justify-center">
                            <Icon icon="solar:card-send-bold" height={20} className="text-white" />
                        </div>
                        <span>Request Withdrawal</span>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    {withdrawSuccess ? (
                        <div className="flex flex-col items-center py-8">
                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-4">
                                <Icon icon="solar:check-circle-bold-duotone" className="text-5xl text-emerald-500" />
                            </div>
                            <p className="text-xl font-bold text-gray-800 dark:text-white mb-2">Request Submitted!</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                Your withdrawal request has been submitted successfully.<br />
                                Funds will be transferred within 2-3 business days.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {/* Balance Display */}
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase tracking-wider">Available Balance</p>
                                        <p className="text-white text-2xl font-bold">{formatCurrency(wallet?.balance || 0)}</p>
                                    </div>
                                    <Icon icon="solar:wallet-bold-duotone" height={40} className="text-[#b03052]" />
                                </div>
                            </div>

                            {/* Amount Input */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    <Icon icon="solar:money-bag-bold" height={18} className="text-[#b03052]" />
                                    Withdrawal Amount
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
                                    <input
                                        type="number"
                                        placeholder="Enter amount"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        min="1"
                                        max={wallet?.balance || 0}
                                        className="w-full px-4 py-3 pl-10 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 rounded-xl focus:border-[#b03052] focus:ring-2 focus:ring-[#b03052]/20 transition-all text-lg font-semibold"
                                    />
                                </div>
                            </div>

                            {withdrawError && (
                                <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                                    <Icon icon="solar:danger-triangle-bold" height={18} />
                                    {withdrawError}
                                </div>
                            )}

                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
                                <div className="flex items-start gap-2">
                                    <Icon icon="solar:info-circle-bold" height={18} className="text-amber-600 mt-0.5" />
                                    <p className="text-xs text-amber-700 dark:text-amber-400">
                                        Minimum withdrawal amount is ₹100. Funds will be credited to your registered bank account.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                {!withdrawSuccess && (
                    <Modal.Footer>
                        <div className="flex gap-3 w-full justify-end">
                            <button
                                onClick={() => setShowWithdrawModal(false)}
                                disabled={withdrawLoading}
                                className="px-5 py-2.5 border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleWithdraw}
                                disabled={withdrawLoading || !withdrawAmount}
                                className="px-6 py-2.5 bg-gradient-to-r from-[#b03052] to-[#8a2542] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#b03052]/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {withdrawLoading ? <Spinner size="sm" /> : <Icon icon="solar:card-send-bold" height={18} />}
                                Confirm Withdrawal
                            </button>
                        </div>
                    </Modal.Footer>
                )}
            </Modal>
        </div>
    );
};

export default Wallet;
