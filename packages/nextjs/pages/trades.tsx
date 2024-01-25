import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const Trades = () => {
  const { address: connectedAddress } = useAccount();
  const [nftData, setNftData] = useState({ brand: "", model: "", serialNumber: "", price: "", uriMetadata: "" });
  const [exchangeData, setExchangeData] = useState({ myNftId: "", otherNftId: "" });

  // Création d'un NFT
  const { write: createWatchNFT } = useScaffoldContractWrite({
    contractName: "LuxuryWatch",
    functionName: "createWatchNFT",
    args: [nftData.brand, nftData.model, nftData.serialNumber, nftData.price, nftData.uriMetadata],
  });

  // Autres fonctions pour gérer les échanges...

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNftData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCreateNFT = () => {
    createWatchNFT();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Trade NFTs</h1>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Create NFT</h2>
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

      <div>
        <h2 className="text-xl font-bold mb-2">Manage Trades</h2>
        <div className="flex justify-between items-center mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
            onClick={() => handleExchange("propose")}
          >
            Propose Exchange
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
            onClick={() => handleExchange("accept")}
          >
            Accept Exchange
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
            onClick={() => handleExchange("refuse")}
          >
            Refuse Exchange
          </button>
        </div>
      </div>
    </div>
  );
};

export default Trades;
