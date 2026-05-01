import { useState } from 'react'
import { ethers } from 'ethers'
import './App.css'

function App() {
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [balance, setBalance] = useState<string>('')
  const [status, setStatus] = useState<string>('')

  async function connectWallet() {
    if (!window.ethereum) {
      setStatus('MetaMask not detected. Please install MetaMask.')
      return
    }

    try {
      setStatus('Connecting…')
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      const address = accounts[0] as string
      setWalletAddress(address)

      const rawBalance = await provider.getBalance(address)
      setBalance(ethers.formatEther(rawBalance))
      setStatus('Connected')
    } catch (err) {
      setStatus(`Error: ${(err as Error).message}`)
    }
  }

  return (
    <div className="app">
      <h1>☀️ Solaris Demo</h1>
      <p className="subtitle">Proof of Function – Ethereum Wallet Connect</p>

      <button onClick={connectWallet} disabled={!!walletAddress}>
        {walletAddress ? 'Wallet Connected' : 'Connect Wallet'}
      </button>

      {walletAddress && (
        <div className="info">
          <p><strong>Address:</strong> {walletAddress}</p>
          <p><strong>Balance:</strong> {balance} ETH</p>
        </div>
      )}

      {status && <p className="status">{status}</p>}
    </div>
  )
}

export default App
