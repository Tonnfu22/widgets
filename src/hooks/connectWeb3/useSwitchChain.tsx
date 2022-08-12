import { useWeb3React } from '@web3-react/core'
import { Network } from '@web3-react/network'
import { Connector } from '@web3-react/types'
import { WalletConnect } from '@web3-react/walletconnect'
import { getChainInfo } from 'constants/chainInfo'
import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId } from 'constants/chains'
import { useAtomValue } from 'jotai/utils'
import { useCallback, useState } from 'react'

import { jsonRpcUrlMapAtom } from './useWeb3React'

// when adding a new chain, Metamask makes a eth_chainId check from its background page, which is not on our Infura RPC origin allowlist
// so we need to use public RPC endpoints to add a new chain
function useRpcUrlsForAddChain(chainId?: SupportedChainId): string[] {
  const jsonRpcUrlMap = useAtomValue(jsonRpcUrlMapAtom)
  if (!chainId) return []
  switch (chainId) {
    case SupportedChainId.MAINNET:
    case SupportedChainId.RINKEBY:
    case SupportedChainId.ROPSTEN:
    case SupportedChainId.KOVAN:
    case SupportedChainId.GOERLI:
      return jsonRpcUrlMap[chainId]
    case SupportedChainId.OPTIMISM:
      return ['https://mainnet.optimism.io']
    case SupportedChainId.OPTIMISTIC_KOVAN:
      return ['https://kovan.optimism.io']
    case SupportedChainId.ARBITRUM_ONE:
      return ['https://arb1.arbitrum.io/rpc']
    case SupportedChainId.ARBITRUM_RINKEBY:
      return ['https://rinkeby.arbitrum.io/rpc']
    case SupportedChainId.POLYGON:
      return ['https://polygon-rpc.com/']
    case SupportedChainId.POLYGON_MUMBAI:
      return ['https://rpc-endpoints.superfluid.dev/mumbai']
    default:
  }
  // Our API-keyed URLs will fail security checks when used with external wallets.
  throw new Error('RPC URLs must use public endpoints')
}

const switchChain = async (connector: Connector, rpcUrls: string[], chainId: SupportedChainId) => {
  if (!ALL_SUPPORTED_CHAIN_IDS.includes(chainId)) {
    throw new Error(`Chain ${chainId} not supported`)
  } else if (connector instanceof WalletConnect || connector instanceof Network) {
    await connector.activate(chainId)
  } else {
    const info = getChainInfo(chainId)
    const addChainParameter = {
      chainId,
      chainName: info.label,
      rpcUrls,
      nativeCurrency: info.nativeCurrency,
      blockExplorerUrls: [info.explorer],
    }
    await connector.activate(addChainParameter)
  }
}

export default function useSwitchChain(desiredChainId?: number): [(() => Promise<void>) | undefined, boolean] {
  const { connector } = useWeb3React()
  const rpcUrls = useRpcUrlsForAddChain(desiredChainId)

  const [isPending, setIsPending] = useState(false)
  const onSwitchChain = useCallback(async () => {
    if (desiredChainId) {
      setIsPending(true)
      try {
        await switchChain(connector, rpcUrls, desiredChainId)
        setIsPending(false)
      } catch {
        setIsPending(false)
      }
    }
  }, [connector, rpcUrls, desiredChainId])

  return [onSwitchChain, isPending]
}
