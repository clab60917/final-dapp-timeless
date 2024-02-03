import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const Trades = () => {
  const { address: connectedAddress } = useAccount();
  const [nftData, setNftData] = useState({ brand: "", model: "", serialNumber: "", price: "", uriMetadata: "" });
  const [exchange, setExchange] = useState({with: "", current: ""});


  const { write: createWatchNFT } = useScaffoldContractWrite({
    contractName: "LuxuryWatch",
    functionName: "createWatchNFT",
    args: [nftData.brand, nftData.model, nftData.serialNumber, nftData.price, nftData.uriMetadata],
  });


  const { write: acceptTrade } = useScaffoldContractWrite({
    contractName: "LuxuryWatch",
    functionName: "acceptExchange",
    args: [exchange.with, exchange.current],
  });


  const { write: refuseTrade } = useScaffoldContractWrite({
    contractName: "LuxuryWatch",
    functionName: "refuseExchange",
    args: [exchange.with, exchange.current],
  });


  const { write: deleteTrade } = useScaffoldContractWrite({
    contractName: "LuxuryWatch",
    functionName: "removeExchange",
    args: [exchange.current, exchange.with],
  });


  const { data: proposedByData } = useScaffoldContractRead({
    contractName: "LuxuryWatch",
    functionName: "getExchangesProposedBy",
    args: [connectedAddress],
  });

  const { data: proposedForData } = useScaffoldContractRead({
    contractName: "LuxuryWatch",
    functionName: "getExchangesFor",
    args: [connectedAddress],
  });

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNftData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAcceptExchange = () => {
    acceptTrade();
  }
  const handleRefuseExchange = () => {
    refuseTrade();
  }
  const handleDeleteExchange = () => {
    deleteTrade();
  }
  const handleCreateNFT = () => {
    createWatchNFT();
  };
  // Afficher les échanges proposés au wallet
  const renderExchangesProposedToMe = () => {
    return (
      proposedForData &&
      proposedForData.map((exchange, index) => (
        <div key={index}>
          <p>Exchange with NFT ID: {exchange.exchangeWith.toString()}</p>
          <p>Proposed by: {exchange.proposedBy}</p>

        </div>
      ))
    );
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold">Trade of NFTs</h1>
      <br />
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Create NFT</h2>
        <input
          className="p-2 m-2 border rounded"
          type="text"
          name="brand"
          placeholder="Brand"
          onChange={handleInputChange}
        />
        <input
          className="p-2 m-2 border rounded"
          type="text"
          name="model"
          placeholder="Model"
          onChange={handleInputChange}
        />
        <input
          className="p-2 m-2 border rounded"
          type="text"
          name="serialNumber"
          placeholder="Serial Number"
          onChange={handleInputChange}
        />
        <input
          className="p-2 m-2 border rounded"
          type="text"
          name="price"
          placeholder="Price"
          onChange={handleInputChange}
        />
        <input
          className="p-2 m-2 border rounded"
          type="text"
          name="uriMetadata"
          placeholder="Metadata URI"
          onChange={handleInputChange}
        />
        <button className="btn btn-primary" onClick={handleCreateNFT}>
          Create NFT
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Exchanges Proposed to Me</h2>
        <div className="space-y-4">
          {proposedForData && proposedForData.length > 0 ? (
            proposedForData.map((exchange, index) => (
              <div
                key={index}
                className="grid gap-4 lg:gap-8 md:grid-cols-2 p-8 relative border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white dark:bg-gray-800"
              >
                <div>
                  You receive
                  <div
                    key={index}
                    className="border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white dark:bg-gray-800"
                  >
                    <img
                      src={exchange.exchangeWith.uriMetadata}
                      alt={`NFT ${index}`}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100">
                        Model : {exchange.exchangeWith.model}
                      </h2>
                      <p className="text-gray-700 dark:text-gray-300">Brand : {exchange.exchangeWith.brand}</p>
                      <p className="text-gray-700 dark:text-gray-300">
                        Price : {exchange.exchangeWith.price.toString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  You give
                  <div
                    key={index}
                    className=" border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white dark:bg-gray-800"
                  >
                    <img
                      src={exchange.currentWatch.uriMetadata}
                      alt={`NFT ${index}`}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100">
                        Model : {exchange.currentWatch.model}
                      </h2>
                      <p className="text-gray-700 dark:text-gray-300">Brand : {exchange.currentWatch.brand}</p>
                      <p className="text-gray-700 dark:text-gray-300">
                        Price : {exchange.currentWatch.price.toString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
                    onClick={
                      () => {
                        setExchange({with: exchange.exchangeWith.id.toString(), current: exchange.currentWatch.id.toString()}),
                        handleAcceptExchange()
                      }
                    }
                  >
                    Accept Exchange
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
                    onClick={
                      () => {
                        setExchange({with: exchange.exchangeWith.id.toString(), current: exchange.currentWatch.id.toString()}),
                        handleRefuseExchange()
                      }
                    }
                  >
                    Refuse Exchange
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No exchanges proposed to me.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">My Exchange Proposals</h2>
        <div className="space-y-4">
          {proposedByData && proposedByData.length > 0 ? (
            proposedByData.map((exchange, index) => (
              <div
                key={index}
                className="grid gap-4 lg:gap-8 md:grid-cols-2 p-8 relative border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white dark:bg-gray-800"
              >
                <div>
                  You want
                  <div
                    key={index}
                    className="border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white dark:bg-gray-800"
                  >
                    <img
                      src={exchange.exchangeWith.uriMetadata}
                      alt={`NFT ${index}`}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100">
                        Model : {exchange.exchangeWith.model}
                      </h2>
                      <p className="text-gray-700 dark:text-gray-300">Brand : {exchange.exchangeWith.brand}</p>
                      <p className="text-gray-700 dark:text-gray-300">
                        Price : {exchange.exchangeWith.price.toString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  You propose
                  <div
                    key={index}
                    className=" border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white dark:bg-gray-800"
                  >
                    <img
                      src={exchange.currentWatch.uriMetadata}
                      alt={`NFT ${index}`}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100">
                        Model : {exchange.currentWatch.model}
                      </h2>
                      <p className="text-gray-700 dark:text-gray-300">Brand : {exchange.currentWatch.brand}</p>
                      <p className="text-gray-700 dark:text-gray-300">
                        Price : {exchange.currentWatch.price.toString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
                    onClick={
                      () => {
                        setExchange({with: exchange.exchangeWith.id.toString(), current: exchange.currentWatch.id.toString()}),
                        handleDeleteExchange()
                      }
                    }
                  >
                    Delete Exchange
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No exchange proposals by me.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trades;
