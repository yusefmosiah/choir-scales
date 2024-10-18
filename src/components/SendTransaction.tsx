import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TransactionMessage, VersionedTransaction, TransactionInstruction } from '@solana/web3.js';
import React, { FC, useCallback } from 'react';
import { notify } from "../utils/notifications";

export const SendTransaction: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const onClick = useCallback(async () => {
        if (!publicKey) {
            notify({ type: 'error', message: 'Wallet not connected!' });
            return;
        }

        let signature: string | undefined = undefined;

        try {
            const instructions: TransactionInstruction[] = [
                // Your transaction instructions here
            ];

            const latestBlockhash = await connection.getLatestBlockhash();

            const messageV0 = new TransactionMessage({
                payerKey: publicKey,
                recentBlockhash: latestBlockhash.blockhash,
                instructions,
            }).compileToV0Message();

            const transaction = new VersionedTransaction(messageV0);

            signature = await sendTransaction(transaction, connection);

            await connection.confirmTransaction({ signature, ...latestBlockhash });
            notify({ type: 'success', message: 'Transaction successful!', txid: signature });
        } catch (error: unknown) {
            notify({ type: 'error', message: 'Transaction failed!', description: (error as Error).message });
        }
    }, [publicKey, connection, sendTransaction]);

    return (
        <div>
            <button
                className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
                onClick={onClick}
                disabled={!publicKey}
            >
                <span>Send Transaction</span>
            </button>
        </div>
    );
};
