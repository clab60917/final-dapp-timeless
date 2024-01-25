import React from "react";
import { useAccount } from "wagmi";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const MyAccount = () => {
  const { address: connectedAddress } = useAccount();

  const { data: tokenInfos } = useScaffoldContractRead({
    contractName: "LuxuryWatch",
    functionName: "getTokensInfosOfOwner",
    args: [connectedAddress],
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold">My Collection Of NFTs</h1>
      <br />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tokenInfos &&
          tokenInfos.map((token, index) => (
            <div
              key={index}
              className="relative border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 bg-white dark:bg-gray-800"
            >
              <img
                src={token.uriMetadata}
                alt={`NFT ${index}`}
                style={{ width: "250px", height: "300px", objectFit: "cover" }}
              />
              <div className="p-4">
                <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100">{token.model}</h2>
                <p className="text-gray-700 dark:text-gray-300">{token.brand}</p>
                <p className="text-gray-700 dark:text-gray-300">{token.price.toString()}</p>
                <div className="mt-4">
                  <a href="http://localhost:3000/trades" className="pt-12" target="_blank" rel="noopener noreferrer">
                    <button className="btn btn-outline btn-info">Trade It!</button>
                  </a>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MyAccount;
