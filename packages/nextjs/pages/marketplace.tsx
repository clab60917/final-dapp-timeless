import React from "react";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Marketplace = () => {
  const {
    data: nfts,
    isError,
    isLoading,
  } = useScaffoldContractRead({
    contractName: "LuxuryWatch",
    functionName: "getAllWatches",
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !nfts) return <div>Error loading NFTs.</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-4">NFT Marketplace</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {nfts.map((nft, index) => (
          <div
            key={index}
            className="relative border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 bg-white dark:bg-gray-800"
          >
            <img
              src={nft.uriMetadata}
              alt={`NFT ${index}`}
              style={{ width: "250px", height: "300px", objectFit: "cover" }}
            />
            <div className="p-4">
              <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100">{nft.model}</h2>
              <p className="text-gray-700 dark:text-gray-300">{nft.brand}</p>
              <p className="text-gray-700 dark:text-gray-300">{nft.price.toString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
