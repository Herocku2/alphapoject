import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { bsc, bscTestnet } from 'viem/chains'
import { WagmiProvider } from 'wagmi'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = '8741f2ea9c2e0650bddc342445cbafbe'

// 2. Create wagmiConfig
const metadata = {
    name: 'Smart Solutions',
    description: 'AppKit Example',
    url: 'https://reown.com/appkit', // origin must match your domain & subdomain
    icons: ['https://assets.reown.com/reown-profile-pic.png']
}

const chains = [bsc] //bscTestnet
export const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
})

// 3. Create modal
createWeb3Modal({
    metadata,
    wagmiConfig: config,
    projectId,
})

export default function Web3Context({children}) {
    return (
        <div>
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </WagmiProvider>
        </div>
    )
}
