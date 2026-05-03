import React from 'react';

const EXPLORER_URLS: Record<string, string> = {
  Polygon: 'https://polygonscan.com',
  Base: 'https://basescan.org',
  Ethereum: 'https://etherscan.io',
  Sepolia: 'https://sepolia.etherscan.io',
  Mumbai: 'https://mumbai.polygonscan.com',
};

function explorerUrl(network: string, path: string): string | null {
  const base = EXPLORER_URLS[network];
  return base ? `${base}/${path}` : null;
}

export const BlockchainVerification: React.FC = () => {
  const contract = import.meta.env.VITE_CONTRACT_ADDRESS as string | undefined;
  const txHash = import.meta.env.VITE_TX_HASH as string | undefined;
  const network = (import.meta.env.VITE_NETWORK as string | undefined) ?? 'Polygon';

  const contractHref = contract ? explorerUrl(network, `address/${contract}`) : null;
  const txHref = txHash ? explorerUrl(network, `tx/${txHash}`) : null;

  return (
    <div className="blockchain-verification">
      <div className="section-title">⛓ Blockchain Verification</div>
      <div className="bv-rows">
        <div className="bv-row">
          <span className="label">Contract</span>
          {contract ? (
            contractHref ? (
              <a className="value mono bv-link" href={contractHref} target="_blank" rel="noreferrer">
                {contract}
              </a>
            ) : (
              <span className="value mono">{contract}</span>
            )
          ) : (
            <span className="value mono bv-placeholder">Not configured</span>
          )}
        </div>
        <div className="bv-row">
          <span className="label">Tx Hash</span>
          {txHash ? (
            txHref ? (
              <a className="value mono bv-link" href={txHref} target="_blank" rel="noreferrer">
                {txHash}
              </a>
            ) : (
              <span className="value mono">{txHash}</span>
            )
          ) : (
            <span className="value mono bv-placeholder">Not configured</span>
          )}
        </div>
        <div className="bv-row">
          <span className="label">Network</span>
          <span className="value bv-network-badge">{network}</span>
        </div>
      </div>
    </div>
  );
};
