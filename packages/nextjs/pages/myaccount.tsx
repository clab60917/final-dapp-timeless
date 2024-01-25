import React, { useEffect, useState } from "react";
import LuxuryWatchABI from "../../hardhat/artifacts/contracts/Luxurywatch.sol/LuxuryWatch.json";
import { MetaHeader } from "../components/MetaHeader";
import type { NextPage } from "next";
import { useContractRead, useContractWrite, useWalletClient } from "wagmi";
import { useAccount } from "wagmi";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const MyAccount = () => {
  const contractAddress = "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c";
  const { address: connectedAddress } = useAccount();

  const { data: tokenIds } = useScaffoldContractRead({
    contractName: "LuxuryWatch",
    functionName: "getTokensOfOwner",
    args: [connectedAddress],
  });

  const { data: tokenInfos } = useScaffoldContractRead({
    contractName: "LuxuryWatch",
    functionName: "getTokensInfosOfOwner",
    args: [connectedAddress],
  });

  // Gestionnaire pour les actions de l'utilisateur (à implémenter)
  const handleExchange = action => {
    console.log(`Exchange action: ${action}`);
    // Ici, ajouter la logique pour interagir avec le contrat
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My NFT Watches</h1>
      <div className="flex space-x-4 mt-4">
        <p>Token Ids : {tokenIds && tokenIds.map(id => <span key={id}>{id.toString()}, </span>)}</p>
        <p>Token Info : {tokenInfos && tokenInfos.map((token, index) => <span key={index}>{token.brand}, </span>)}</p>
        <p>
          Token Image : {tokenInfos && tokenInfos.map((token, index) => <image key={index} src={token.uriMetadata} />)}
        </p>
        <button className="btn btn-primary" onClick={() => handleExchange("propose")}>
          Propose Exchange
        </button>
        <button className="btn btn-secondary" onClick={() => handleExchange("accept")}>
          Accept Exchange
        </button>
        <button className="btn btn-accent" onClick={() => handleExchange("refuse")}>
          Refuse Exchange
        </button>
      </div>
      {tokenInfos &&
        tokenInfos.map((token, index) => (
          <div className="relative border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 bg-white dark:bg-gray-800" key={index}>
            <p>
              {" "}
              Image:{" "}
              <div>
                <img src={token.uriMetadata} alt={`NFT `} width={250} height={300} />
                <div className="p-4">
                  <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100">{token.model}</h2>
                  <p className="text-gray-700 dark:text-gray-300">{token.brand}</p>
                  <p className="text-gray-700 dark:text-gray-300">{token.price.toString()}</p>
                </div>
              </div>
            </p>
          </div>
        ))}
    </div>
  );
};

export default MyAccount;
