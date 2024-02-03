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
              className="border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white dark:bg-gray-800"
            >
              <img src={token.uriMetadata} alt={`NFT ${index}`} className="w-full h-64 object-cover" />
              <div className="p-4">
                <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100">Model: {token.model}</h2>
                <p className="text-gray-700 dark:text-gray-300">Brand: {token.brand}</p>
                <p className="text-gray-700 dark:text-gray-300">{token.price.toString()} ETH</p>
                <p className="text-gray-700 dark:text-gray-300">Token id: {token.id.toString()}</p>

              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MyAccount;
