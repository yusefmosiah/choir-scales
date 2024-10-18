import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, TransactionMessage, TransactionSignature, VersionedTransaction } from '@solana/web3.js';
import { FC, useCallback } from 'react';
import { notify } from "../utils/notifications";

export const SendVersionedTransaction: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const onClick = useCallback(async () => {
        if (!publicKey) {
            notify({ type: 'error', message: `Wallet not connected!` });
            console.log('error', `Send Transaction: Wallet not connected!`);
            return;
        }

        let signature: TransactionSignature = '';
        try {
            // Create instructions to send, in this case a simple transfer
            const instructions = [
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: Keypair.generate().publicKey,
                    lamports: 1_000_000,
                }),
            ];

            // Get the latest block hash to use on our transaction and confirmation
            const latestBlockhash = await connection.getLatestBlockhash()

            // Create a new TransactionMessage with version and compile it to version 0
            const messageV0 = new TransactionMessage({
                payerKey: publicKey,
                recentBlockhash: latestBlockhash.blockhash,
                instructions,
            }).compileToV0Message();

            // Create a new VersionedTransaction to support the v0 message
            const transaction = new VersionedTransaction(messageV0)

            // Send transaction and await for signature
            signature = await sendTransaction(transaction, connection);

            // Await for confirmation
            await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');

            console.log(signature);
            notify({ type: 'success', message: 'Transaction successful!', txid: signature });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            notify({ type: 'error', message: 'Transaction failed!', description: errorMessage });
            console.log('error', `Transaction failed! ${errorMessage}`, signature);
            return;
        }
    }, [publicKey, connection, sendTransaction]);

    return (
        <div className="flex flex-row justify-center">
            <div className="relative items-center group">
                <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500
                rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <button
                        className="m-2 w-60 text-black bg-gradient-to-br from-indigo-500 to-fuchsia-500 animate-pulse group btn hover:from-white hover:to-purple-300"
                        onClick={onClick} disabled={!publicKey}
                        >
                    <div className="hidden group-disabled:block">
                        Wallet not connected
                    </div>
                    <span className="block group-disabled:hidden" >
                        Send Versioned Transaction
                    </span>
                    </button>
            </div>
        </div>
    );
};
