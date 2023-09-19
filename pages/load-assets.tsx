import AuthenticatedPage from '@/components/authenticated-page'
import Section from '@/components/section'
import { links } from '@/lib/links'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useState } from 'react'
import { createWalletClient, custom, parseEther } from 'viem'
import { baseGoerli } from 'viem/chains'

const LoadAssets = () => {
	const { connectWallet } = usePrivy()
	const { wallets } = useWallets()
	const embeddedWallet = wallets.find(
		(wallet) => wallet.walletClientType === 'privy'
	)
	const externalWallet = wallets.find(
		(wallet) => wallet.walletClientType !== 'privy'
	)
	const [txIsLoading, setTxIsLoading] = useState(false)
	const [txHash, setTxHash] = useState<string | undefined>()

	const onTransfer = async () => {
		if (!externalWallet || !embeddedWallet) return
		try {
			// Switch chain to Base Goerli
			await externalWallet.switchChain(baseGoerli.id)

			// Build viem wallet client for external wallet
			const provider = await externalWallet.getEthereumProvider()
			const walletClient = createWalletClient({
				account: externalWallet.address as `0x${string}`,
				chain: baseGoerli,
				transport: custom(provider),
			})

			// Send transaction from external wallet
			setTxIsLoading(true)
			const _txHash = await walletClient.sendTransaction({
				account: externalWallet.address as `0x${string}`,
				to: embeddedWallet.address as `0x${string}`,
				value: parseEther('0.005'),
			})
			setTxHash(_txHash)
		} catch (e) {
			console.error('Transfer failed with error ', e)
		}
		setTxIsLoading(false)
	}

	const onAddNetwork = async () => {
		if (!externalWallet) return
		const provider = await externalWallet.getEthereumProvider()
		await provider.request({
			method: 'wallet_addEthereumChain',
			params: [
				{
					chainId: `0x${baseGoerli.id.toString(16)}`,
					chainName: baseGoerli.name,
					nativeCurrency: baseGoerli.nativeCurrency,
					rpcUrls: [baseGoerli.rpcUrls.public?.http[0] ?? ''],
					blockExplorerUrls: [baseGoerli.blockExplorers?.default.url ?? ''],
				},
			],
		})
	}

	return (
		<AuthenticatedPage>
			<Section>
				<p className='text-md mt-2 font-bold uppercase text-gray-700'>
					Fund your embedded wallet
				</p>
				<p className='mt-2 text-sm text-gray-600'>
					First, connect an external wallet to send assets to your embedded
					wallet. The wallet <span className='font-bold'>must</span> support the
					Base Goerli network. We recommend MetaMask.
				</p>
				<p className='mt-2 text-sm text-gray-600'></p>
				<button
					type='button'
					className='mt-2 w-full rounded-md bg-indigo-600 py-2 text-sm font-semibold text-white shadow-sm disabled:bg-indigo-400'
					onClick={connectWallet}
				>
					{!externalWallet ? 'Connect a wallet' : 'Connect another wallet?'}
				</button>
				<textarea
					value={
						externalWallet
							? JSON.stringify(externalWallet, null, 2)
							: 'No external wallet connected'
					}
					className='mt-4 h-fit w-full rounded-md bg-slate-700 p-4 font-mono text-xs text-slate-50'
					rows={9}
					readOnly
				/>
				<p className='mt-2 text-sm text-gray-600'>
					Next, add the Base Goerli network to your wallet.
				</p>
				<button
					type='button'
					className='mt-2 w-full rounded-md bg-indigo-600 py-2 text-sm font-semibold text-white shadow-sm disabled:bg-indigo-400'
					onClick={onAddNetwork}
					disabled={!externalWallet}
				>
					Add Base Goerli Network
				</button>
				<p className='mt-2 text-sm text-gray-600'>
					Lastly, click the button below to transfer 0.005 Goerli ETH to your
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
							href={`${links.baseGoerli.transactionExplorer}${txHash}`}
							target='_blank'
							rel='noreferrer noopener'
						>
							etherscan
						</a>
						.
					</p>
				)}
			</Section>
		</AuthenticatedPage>
	)
}

export default LoadAssets
