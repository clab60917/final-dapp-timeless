// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract LuxuryWatch is ERC721 {
	uint256 private _tokenIds;
	/*____________Structure definitions_________________*/
	struct Watch {
		string brand;
		string model;
		string serialNumber;
		uint256 price;
		string uriMetadata;
	}

    struct Exchange{
        Watch first;
        Watch second;
    }
	/*____________Mapping definitions_________________*/	
	// Arrays containing the watch nft
	mapping(uint256 => Watch) private watchInfo;
	// Array containing the exchanges propositions
	mapping(uint256 => uint256) private exchanges;
	// Arry containing the number of owner for each nft
	mapping(uint256 => uint256) private nbOwners;
	// Arry containing all nftID owned by an address
	mapping(address => uint256[]) private nftOwnedBy;

	/*____________Error definitions_________________*/	
	error Unauthorized(address caller);
	error PriceTooLow(uint256 requestedPrice, uint256 currentPrice);
	error TokenNotExist(uint256 tokenId);
	error NotOwner(address owner, address caller);
	error InsufficientFunds(uint256 available, uint256 required);
	error NotTokenOwner(address caller, uint256 tokenId);

	/*____________Event definitions_________________*/	
	event WatchNFTCreated(
		address sender,
		uint256 indexed tokenId,
		string brand,
		string model,
		string serialNumber
	);
	event ExchangeProposed(uint256 mineNFT, uint256 otherNFT);
	event ExchangeAccepted(uint256 mineNFT, uint256 otherNFT);
	event ExchangeRefused(uint256 mineNFT, uint256 otherNFT);
	event ownerChanged(address indexed newOwner);

	// Constructor
	constructor() ERC721("LuxuryWatch", "GEAR") {}

	/*____________Modifier definitions_________________*/

	modifier notMyNFT(uint256 nft){
		require(ownerOf(nft) != msg.sender,"You are the owner of this NFT");
		_;
	}
	modifier myNFT(uint256 nft){
		require(ownerOf(nft) == msg.sender,"You are not the owner of this NFT");
		_;
	}
	modifier NFTavailable(uint256 nft){
		require(exchanges[nft] == 0, "NFT is already in an exchange");
		_;
	}
	modifier NFTbusy(uint256 nft){
		require(exchanges[nft] != 0, "NFT is not in an exchange");
		_;
	}
	
	/*____________Functions definitions_________________*/

	/*____________Functions for the exchange_________________*/

	/**
	 *  Function to create a nft
	 * @param _brand Name of the nft
	 * @param _model Model of the wwatch
	 * @param _serialNumber serial nulber of the watch
	 * @param _price price of the watch
	 * @param _metadataURI image of the watch
	 */
	function createWatchNFT(
		string memory _brand,
		string memory _model,
		string memory _serialNumber,
		uint256 _price,
		string memory _metadataURI
	) public {
		// Incrementation of the id token
		_tokenIds++;
		// Minting of our new nft
		_mint(msg.sender, _tokenIds);

		// Creation of the content of the NFT
		Watch memory newWatch = Watch({
			brand: _brand,
			model: _model,
			serialNumber: _serialNumber,
			price: _price,
			uriMetadata: _metadataURI
		});

		// Save content of the NFT in the contract memory
		watchInfo[_tokenIds] = newWatch;
		// Set exchange to current NFT to 0
		exchanges[_tokenIds] = 0;
		// Set number of owner for the nft to 1
		nbOwners[_tokenIds] = 1;
		nftOwnedBy[msg.sender].push(_tokenIds);
		// Emit
		emit WatchNFTCreated(
			msg.sender,
			_tokenIds,
			_brand,
			_model,
			_serialNumber
		);
	}

	/**
	 * Function to propose an exchange between two NFT
	 * @param proposed NFT I want to exchange
	 * @param wanted NFT I want
	 */
	function proposeExchange(uint256 proposed, uint256 wanted) 
	myNFT(proposed) 
	notMyNFT(wanted) 
	NFTavailable(proposed)  
	NFTavailable(wanted) 
	public {
		exchanges[wanted] = proposed;

		approve(ownerOf(wanted), proposed);
		emit ExchangeProposed(proposed, wanted);
	}

	/**
	 * Function to accept an exchange
	 * @param wanted NFT the other want
	 * @param proposed NFT the other proposed to me
	 */
	function acceptExchange(uint256 wanted, uint256 proposed)
	myNFT(proposed) 
	notMyNFT(wanted) 
	NFTbusy(proposed)  
	NFTbusy(wanted) 
	public {

		address me = ownerOf(wanted);
		address other = ownerOf(proposed);

		approve(ownerOf(proposed), wanted);

		safeTransferFrom(me, other, wanted);
		safeTransferFrom(other, me, proposed);

		exchanges[wanted] = 0;
		exchanges[proposed] = 0;
		nbOwners[wanted] += 1;
		nbOwners[proposed] += 1;

		removeNFTFromCollection(proposed, other);
		removeNFTFromCollection(wanted, me);

		nftOwnedBy[me].push(proposed);
		nftOwnedBy[other].push(wanted);

		emit ExchangeAccepted(wanted, proposed);
	}

	/**
	 * Remove proposition
	 * @param proposed mine nft id
	 * @param wanted the other nft id
	 */
	function removeExchange(uint256 proposed, uint256 wanted) 
	myNFT(proposed) 
	notMyNFT(wanted) 
	NFTbusy(proposed)  
	NFTbusy(wanted)
	public {
	
		exchanges[wanted] = 0;

		approve(address(0), proposed);
	}

	/**
	 * Function call to refuse Exchange
	 * @param wanted mine nft id
	 * @param proposed the other nft id
	 */
	function refuseExchange(uint256 wanted, uint256 proposed) 
	myNFT(proposed) 
	notMyNFT(wanted) 
	NFTbusy(proposed)  
	NFTbusy(wanted)
	public {

		exchanges[wanted] = 0;

		emit ExchangeRefused(wanted, proposed);
	}

	/**
	 * Function to update metadata
	 * @param _tokenId id of the NFT to update
	 * @param _newMetadataURI String containing the new metadatas
	 */
	function updateMetadataURI(
		uint256 _tokenId,
		string memory _newMetadataURI
	) public {
		if (ownerOf(_tokenId) != msg.sender)
			revert NotTokenOwner(msg.sender, _tokenId);
		watchInfo[_tokenId].uriMetadata = _newMetadataURI;
	}


	/*____________Functions utils_________________*/
	/**
	 * Function to get the number of owner a nft has had
	 * @param nft id of the nft
	 */
	function getNbOwners(uint256 nft) public view returns (uint256) {
		return nbOwners[nft];
	}
	function removeNFTFromCollection(uint256 nft, address owner) private{
		bool found = false;
		uint numberOfNFT = nftOwnedBy[owner].length;
		for (uint i = 0; i<numberOfNFT-1; i++){
            if(nftOwnedBy[owner][i] == nft){
				delete nftOwnedBy[owner][i];
				found = true;
			}
			if(found){
				nftOwnedBy[owner][i] = nftOwnedBy[owner][i+1];
			}
        }
		if(found || nftOwnedBy[owner][numberOfNFT] == nft){
			nftOwnedBy[owner].pop();
		}
	}


	/**
	 * @dev Retourne tous les tokenIds possédés par une adresse donnée.
	 * @param owner L'adresse du propriétaire des NFTs.
	 * @return Une liste de tous les tokenIds possédés par l'adresse donnée.
	 */
	function getTokensOfOwner(
		address owner
	) public view returns (uint256[] memory) {
		return nftOwnedBy[owner];
	}
    /**
	 * @dev Retourne tous les tokens possédés par une adresse donnée.
	 * @param owner L'adresse du propriétaire des NFTs.
	 * @return Une liste de tous les tokens possédés par l'adresse donnée.
	 */
	function getTokensInfosOfOwner(
		address owner
	) external view returns (Watch[] memory) {
		Watch[] memory tokensInfo = new Watch[](nftOwnedBy[owner].length);
		for (uint256 i = 0; i < nftOwnedBy[owner].length; i++) {
			tokensInfo[i] = watchInfo[nftOwnedBy[owner][i]];
		}
		return tokensInfo;
	}


    /**
     * Function that return an array with all watches created
     */
    function getAllWatches() public view returns(Watch[] memory){
        Watch[] memory tokensInfo = new Watch[](_tokenIds);
		for (uint256 i = 0; i < _tokenIds; i++) {
			tokensInfo[i] = watchInfo[i];
		}
		return tokensInfo;
    }

	function getExchangeOfOwner(address owner) public view returns(Exchange[] memory){
		uint256[] memory nfts = getTokensOfOwner(owner);
		uint count = nfts.length;
		// Count how many nfts are in exchange
		for(uint i = 0; i < nfts.length; i++){
			if(exchanges[nfts[i]]==0){
				nfts[i] = 0;
				count --;
			}
		}
		// Create array with the right size
		Exchange[] memory temp_exchanges = new Exchange[](count);
		uint j = 0;
		for(uint i = 0; i < nfts.length; i++){

			// If nft is in exchange modify exchange array for return 
			if(nfts[i] != 0){
				// first will be the watch of the owner (wanted)
				temp_exchanges[j].first = watchInfo[nfts[i]];
				// second will be the watch of the other (proposed)
				temp_exchanges[j].second = watchInfo[exchanges[nfts[i]]];
				j++;
			}
		}
		return temp_exchanges;
	}


}
