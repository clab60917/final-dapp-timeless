import React, { useState } from "react";
import "tailwindcss/tailwind.css";
import { MetaHeader } from "~~/components/MetaHeader";

const nfts = [
  {
    id: 1,
    title: "Grand Seiko",
    description: "Spring Drive GMT",
    image: "img1.png", // Remplacez par le chemin d'accès après l'upload
    price: "5.0 ETH",
  },
  {
    id: 2,
    title: "Mido",
    description: "Baroncelli Heritage Automatic",
    image: "img2.webp", // Remplacez par le chemin d'accès après l'upload
    price: "2.5 ETH",
  },
  {
    id: 3,
    title: "Rolex",
    description: "Oyster Perpetual Datejust",
    image: "img3.jpg", // Remplacez par le chemin d'accès après l'upload
    price: "12.0 ETH",
  },
  {
    id: 1,
    title: "Grand Seiko",
    description: "Spring Drive GMT",
    image: "img4.png", // Remplacez par le chemin d'accès après l'upload
    price: "5.0 ETH",
  },
  {
    id: 2,
    title: "Mido",
    description: "Baroncelli Heritage Automatic",
    image: "img5.png", // Remplacez par le chemin d'accès après l'upload
    price: "2.5 ETH",
  },
  {
    id: 3,
    title: "Rolex",
    description: "Oyster Perpetual Datejust",
    image: "img6.jpg", // Remplacez par le chemin d'accès après l'upload
    price: "12.0 ETH",
  },
  {
    id: 1,
    title: "Grand Seiko",
    description: "Spring Drive GMT",
    image: "img7.png", // Remplacez par le chemin d'accès après l'upload
    price: "5.0 ETH",
  },
  {
    id: 2,
    title: "Mido",
    description: "Baroncelli Heritage Automatic",
    image: "img8.png", // Remplacez par le chemin d'accès après l'upload
    price: "2.5 ETH",
  },
  {
    id: 3,
    title: "Rolex",
    description: "Oyster Perpetual Datejust",
    image: "img9.jpg", // Remplacez par le chemin d'accès après l'upload
    price: "12.0 ETH",
  },
  {
    id: 3,
    title: "Rolex",
    description: "Oyster Perpetual Datejust",
    image: "img10.jpg", // Remplacez par le chemin d'accès après l'upload
    price: "12.0 ETH",
  },
  {
    id: 3,
    title: "Rolex",
    description: "Oyster Perpetual Datejust",
    image: "img3.jpg", // Remplacez par le chemin d'accès après l'upload
    price: "12.0 ETH",
  },
];
const NFTCard = ({ nft }) => (
  <div className="border border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 bg-transparent">
    <img src={nft.image} alt={`NFT ${nft.id}`} className="w-full h-360 object-cover" />
    <div className="p-2">
      <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100">{nft.title}</h2>
      <p className="text-gray-800 dark:text-gray-200">{nft.description}</p>
      <div className="flex justify-between items-center mt-3">
        <span className="font-semibold text-gray-900 dark:text-gray-100">{nft.price}</span>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200">
          Buy
        </button>
      </div>
    </div>
  </div>
);

const Marketplace = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
      <MetaHeader />
      <div className="bg-gray-800 dark:bg-gray-200 min-h-screen">
        <div className="container mx-auto py-8 px-4">
          <button onClick={() => setDarkMode(!darkMode)} className="text-white dark:text-gray-800">
            Buy the lastest Drops
          </button>
          <h1 className="text-4xl font-bold text-white dark:text-gray-900 mb-8">NFT Marketplace</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nfts.map(nft => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
