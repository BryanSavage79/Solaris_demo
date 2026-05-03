import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: ethers.Eip1193Provider;
  }
}

export const getContract = async () => {
  if (!window.ethereum) return null;

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  if (!contractAddress || !ethers.isAddress(contractAddress)) {
    throw new Error("VITE_CONTRACT_ADDRESS is missing or not a valid Ethereum address.");
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    return new ethers.Contract(
      contractAddress,
      [], // add ABI later
      signer
    );
  } catch (err) {
    console.error("Failed to connect wallet or instantiate contract:", err);
    return null;
  }
};
