import Blobby from '@/components/svg/blobby'
import { useLogin, usePrivy } from '@privy-io/react-auth'
import Head from 'next/head'
import { useRouter } from 'next/router'

const Index = () => {
	const router = useRouter()
	const { ready, authenticated } = usePrivy()
	const { login } = useLogin({
		// Set up an `onComplete` callback to run when `login` completes
		onComplete(user, isNewUser, wasPreviouslyAuthenticated) {
			console.log('🔑 ✅ Login success', {
				user,
				isNewUser,
				wasPreviouslyAuthenticated,
			})
			router.push('/dashboard')
		},
		// Set up an `onError` callback to run when there is a `login` error
		onError(error) {
			console.log('🔑 🚨 Login error', { error })
		},
	})

	return (
		<>
			<Head>
				<title>Privy PWA Template</title>
			</Head>
			<main>
				<div className='flex h-screen w-screen flex-col items-center justify-center'>
					<Blobby />
					<h2 className='my-4 text-xl font-semibold text-gray-800'>
						Privy PWA Template
					</h2>
					<h2 className='my-4 text-md text-gray-800'>
						You can install this app directly to your mobile device.
					</h2>
					<div className='mt-2 w-1/2'>
						{/* Always check that Privy is `ready` and the user is not `authenticated` before calling `login` */}
						<button
							className='my-4 w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm disabled:bg-indigo-400'
							onClick={login}
							disabled={!ready || authenticated}
						>
							Login
						</button>
					</div>
				</div>
			</main>
		</>
	)
}

export default Index
