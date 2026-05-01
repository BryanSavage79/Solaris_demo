import { ethers } from "ethers";

export const getContract = async () => {
  if (!window.ethereum) return null;

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("VITE_CONTRACT_ADDRESS is not defined. Check your .env file.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(
    contractAddress,
    [], // add ABI later
    signer
  );
};
