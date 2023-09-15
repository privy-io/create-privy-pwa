import AuthenticatedPage from '@/components/authenticated-page'
import Section from '@/components/section'
import { links } from '@/lib/links'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useState } from 'react'
import { createWalletClient, custom, parseEther } from 'viem'
import { goerli } from 'viem/chains'

const LoadAssets = () => {
	const { connectWallet } = usePrivy();
	const { wallets } = useWallets();
	const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
	const externalWallet = wallets.find((wallet) => wallet.walletClientType !== 'privy');
	const [txIsLoading, setTxIsLoading] = useState(false);
	const [txHash, setTxHash] = useState<string | undefined>();

	const onTransfer = async () => {
		if (!externalWallet || !embeddedWallet) return;
		try {
			// Switch chain to Goerli
			await externalWallet?.switchChain(5);

			// Build viem wallet client for external wallet
			const provider = await externalWallet?.getEthereumProvider();
			const walletClient = createWalletClient({
				account: externalWallet.address as `0x${string}`,
				chain: goerli,
				transport: custom(provider),
			});

			// Send transaction from external wallet
			setTxIsLoading(true);
			const _txHash = await walletClient.sendTransaction({
				account: externalWallet.address as `0x${string}`,
				to: embeddedWallet.address as `0x${string}`,
				value: parseEther('0.005'),
			});
			setTxHash(_txHash);
		} catch (e) {
			console.error('Transfer failed with error ', e);
		}
		setTxIsLoading(false);
	}

	return (
		<AuthenticatedPage>
			<Section>
				<p className='text-md mt-2 font-bold uppercase text-gray-700'>
					Fund your embedded wallet
				</p>
				<p className='mt-2 text-sm text-gray-600'>
					First, connect an external wallet to send assets to your embedded
					wallet.
				</p>
				<button
					type='button'
					className='mt-2 w-full rounded-md bg-indigo-600 py-2 text-sm font-semibold text-white shadow-sm disabled:bg-indigo-400'
					onClick={connectWallet}
					disabled={!!externalWallet}
				>
					{!externalWallet ? 'Connect a wallet' : 'Already connected!'}
				</button>
				<textarea
					value={
						externalWallet
							? JSON.stringify(externalWallet, null, 2)
							: 'No external wallet connected'
					}
					className='mt-4 h-fit w-full rounded-md bg-slate-700 p-4 font-mono text-xs text-slate-50'
					rows={9}
					disabled
				/>
				<p className='mt-2 text-sm text-gray-600'>
					Then, click the button below to transfer 0.005 Goerli ETH to your
					embedded wallet.
				</p>
				<button
					type='button'
					className='mt-2 w-full rounded-md bg-indigo-600 py-2 text-sm font-semibold text-white shadow-sm disabled:bg-indigo-400'
					onClick={onTransfer}
					disabled={!externalWallet || txIsLoading}
				>
					Transfer 0.005 ETH
				</button>
				{txHash && (
					<p className='mt-2 text-sm italic text-gray-600'>
						See your transaction on{' '}
						<a
							className='underline'
							href={`${links.goerli.transactionExplorer}${txHash}`}
							target='_blank'
							rel='noreferrer'
						>
							etherscan
						</a>
						.
					</p>
				)}
			</Section>
		</AuthenticatedPage>
	);
}

export default LoadAssets;
