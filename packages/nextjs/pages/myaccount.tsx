import React, { useEffect, useState } from "react";


// Remplacez '../api' par le chemin vers votre fichier d'API

const MyAccount: React.FC = () => {
  const [ownedNFTs, setOwnedNFTs] = useState([]);

  useEffect(() => {
    // Appel à l'API pour récupérer les NFT possédés
    const fetchOwnedNFTs = async () => {
      try {
        const nfts = await getOwnedNFTs(); // Remplacez 'getOwnedNFTs' par la fonction d'appel à l'API appropriée
        setOwnedNFTs(nfts);
      } catch (error) {
        console.error("Erreur lors de la récupération des NFT possédés :", error);
      }
    };

    fetchOwnedNFTs();
  }, []);

  return (
    <div>
      <h1>My Account</h1>
      <h2>My Owned NFTs</h2>
      <div>
        {ownedNFTs.map(nft => (
          <div key={nft.id}>
            <img src={nft.image} alt={nft.name} />
            <p>{nft.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAccount;
