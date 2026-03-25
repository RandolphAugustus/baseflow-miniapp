import { createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';
import { Attribution } from 'ox/erc8021';

const builderCodes = [];

const dataSuffix = builderCodes.length
  ? Attribution.toDataSuffix({
      codes: builderCodes,
    })
  : undefined;

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({ appName: 'BaseFlow' }),
    injected(),
  ],
  transports: {
    [base.id]: http(),
  },
  ssr: true,
  ...(dataSuffix ? { dataSuffix } : {}),
});
