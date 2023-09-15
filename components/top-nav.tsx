import { useLogout, usePrivy } from '@privy-io/react-auth'

const TopNav = () => {
	const { ready, authenticated } = usePrivy()
	const { logout } = useLogout()

	return (
		<div className='fixed top-0 left-0 z-20 w-full bg-zinc-900 pt-safe'>
			<header className='border-b bg-zinc-100 px-safe dark:border-zinc-800 dark:bg-zinc-900'>
				<div className='mx-auto flex h-20 max-w-screen-md items-center justify-between px-6'>
					<h1 className='font-medium'>Build a PWA with Privy</h1>

					<nav className='flex items-center space-x-6'>
						<div className='flex items-center space-x-6'>
							{ready && authenticated && (
								<div
									className='cursor-pointer text-sm text-gray-600'
									onClick={logout}
								>
									Logout
								</div>
							)}
						</div>
					</nav>
				</div>
			</header>
		</div>
	)
}

export default TopNav
