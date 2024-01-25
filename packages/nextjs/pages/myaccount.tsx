import React, { useEffect, useState } from "react";
import LuxuryWatchABI from "../../hardhat/artifacts/contracts/Luxurywatch.sol/LuxuryWatch.json";
import { useAccount, useContractRead } from "wagmi";

const MyAccount = () => {
  const { address } = useAccount();
  const [myNFTs, setMyNFTs] = useState([]);

  // Adresse du contrat LuxuryWatch
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Hook pour lire les NFTs du wallet connecté
  const {
    data: nfts,
    isError,
    isLoading,
  } = useContractRead({
    address: contractAddress,
    // contractInterface: LuxuryWatchABI,
    functionName: "getMyNFTs", // Assurez-vous que cette fonction existe dans votre contrat
    args: [address],
  });

  useEffect(() => {
    if (nfts) {
      setMyNFTs(myNFTs);
    }
  }, [nfts]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading NFTs</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My NFT Watches</h1>
      <div>
        {myNFTs.length === 0 ? (
          <p>You dont own any NFT watches.</p>
        ) : (
          myNFTs.map((nft, index) => (
            <div key={index} className="p-4 border rounded mb-2">
              <p>Brand: {nft.brand}</p>
              <p>Model: {nft.model}</p>
              {/* Autres trucs nft */}
            </div>
          ))
        )}
      </div>
      {/* Boutons pour interagir avec le contrat */}
      <div className="flex space-x-4 mt-4">
        <button className="btn btn-primary">Propose Exchange</button>
        <button className="btn btn-secondary">Accept Exchange</button>
        <button className="btn btn-accent">Refuse Exchange</button>
      </div>
    </div>
  );
};

export default MyAccount;
