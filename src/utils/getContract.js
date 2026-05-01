import { ethers } from "ethers";

export const getContract = async () => {
  if (!window.ethereum) return null;

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(
    import.meta.env.VITE_CONTRACT_ADDRESS,
    [], // add ABI later
    signer
  );
};
