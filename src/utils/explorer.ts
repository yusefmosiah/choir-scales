import { PublicKey } from '@solana/web3.js';

export const getExplorerUrl = (
  endpoint: string,
  viewTypeOrItemAddress: 'inspector' | PublicKey | string,
  itemType = 'address'
) => {
  const getClusterUrlParam = () => {
    const url = new URL(endpoint);
    if (url.hostname.includes('devnet')) {
      return 'devnet';
    } else if (url.hostname.includes('testnet')) {
      return 'testnet';
    }
    return 'mainnet-beta';
  };

  const getUrl = (
    viewType: 'inspector' | 'tx' | 'address',
    address: string
  ) => {
    if (viewType === 'inspector') {
      return `https://explorer.solana.com/inspector?cluster=${getClusterUrlParam()}`;
    } else {
      return `https://explorer.solana.com/${viewType}/${address}?cluster=${getClusterUrlParam()}`;
    }
  };

  if (viewTypeOrItemAddress === 'inspector') {
    return getUrl('inspector', '');
  } else {
    return getUrl(
      itemType as 'tx' | 'address',
      viewTypeOrItemAddress.toString()
    );
  }
};
