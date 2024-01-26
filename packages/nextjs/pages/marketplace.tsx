import React, { useState } from "react";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const Marketplace = () => {
  const [nftToPropose, setNftToPropose] = useState({ with: "", current: "" });

  const { write: proposeExchange } = useScaffoldContractWrite({
    contractName: "LuxuryWatch",
    functionName: "proposeExchange",
    args: [BigInt(nftToPropose.with), BigInt(nftToPropose.current)],
  });

  const {
    data: nfts,
    isError,
    isLoading,
  } = useScaffoldContractRead({
    contractName: "LuxuryWatch",
    functionName: "getAllWatches",
  });
  const handleInputChange = e => {
    setNftToPropose({ with: e.target.value, current: nftToPropose.current });
  };
  const handleProposeExchange = () => {
    proposeExchange();
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !nfts) return <div>Error loading NFTs.</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-4">NFT Marketplace</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {nfts.map((nft, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white dark:bg-gray-800"
          >
            <img src={nft.uriMetadata} alt={`NFT ${index}`} className="w-full h-64 object-cover" />
            <div className="p-4 flex flex-col justify-between md:grid-cols-2">
              <div>
                <div>
                  <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{nft.model}</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Brand: {nft.brand}</p>
                </div>
                <div className="mt-2">
                  <p className="text-gray-700 dark:text-gray-300 font-bold">Price: {nft.price.toString()} ETH</p>
                  <p className="text-gray-700 dark:text-gray-300 font-bold">Id: {nft.id.toString()}</p>
                </div>
              </div>
              <div>
                <input
                  className="p-2 m-2 border rounded"
                  type="text"
                  name="nftToPropose"
                  placeholder="nftToPropose"
                  onChange={handleInputChange}
                />
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
                  onClick={() => {
                    setNftToPropose({ current: nft.id.toString(), with: nftToPropose.with }), handleProposeExchange();
                  }}
                >
                  Send Exchange
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
