import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, TransactionSignature } from '@solana/web3.js';
import { FC, useCallback } from 'react';
import { notify } from "../utils/notifications";
import useUserSOLBalanceStore from '../stores/useUserSOLBalanceStore';

export const RequestAirdrop: FC = () => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const { getUserSOLBalance } = useUserSOLBalanceStore();

    const onClick = useCallback(async () => {
        if (!publicKey) {
            console.log('error', 'Wallet not connected!');
            notify({ type: 'error', message: 'error', description: 'Wallet not connected!' });
            return;
        }

        let signature: TransactionSignature = '';

        try {
            signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);

            // Get the latest block hash to use on our transaction and confirmation
            const latestBlockhash = await connection.getLatestBlockhash();
            await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');

            notify({ type: 'success', message: 'Airdrop successful!', txid: signature });

            getUserSOLBalance(publicKey, connection);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            notify({ type: 'error', message: 'Airdrop failed!', description: errorMessage });
            console.log('error', `Airdrop failed! ${errorMessage}`, signature);
        }
    }, [publicKey, connection, getUserSOLBalance]);

    return (
        <div className="flex flex-row justify-center">
            <div className="relative items-center group">
                <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500
                rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <button
                    className="px-8 m-2 text-black bg-gradient-to-br from-indigo-500 to-fuchsia-500 animate-pulse btn hover:from-white hover:to-purple-300"
                    onClick={onClick}
                >
                    <span>Airdrop 1 </span>
                </button>
            </div>
        </div>
    );
};
