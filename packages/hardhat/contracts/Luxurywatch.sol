// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract LuxuryWatch is ERC721, Ownable {
	uint256 private _tokenIds;
	// Watch structure for NFT
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

	// Arrays containing the watch nft
	mapping(uint256 => Watch) private watchInfo;
	// Array containing the exchanges propositions
	mapping(uint256 => uint256) private exchanges;
	// Arry containing the number of owner for each nft
	mapping(uint256 => uint256) private nbOwners;

	// Custom error
	error Unauthorized(address caller);
	error PriceTooLow(uint256 requestedPrice, uint256 currentPrice);
	error TokenNotExist(uint256 tokenId);
	error NotOwner(address owner, address caller);
	error InsufficientFunds(uint256 available, uint256 required);
	error NotTokenOwner(address caller, uint256 tokenId);

	// Custom event
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

	constructor() ERC721("LuxuryWatch", "GEAR") {}

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
	 * @param mineNftId NFT I want to exchange
	 * @param otherNftId NFT I want
	 */
	function proposeExchange(uint256 mineNftId, uint256 otherNftId) public {
		require(
			ownerOf(mineNftId) == msg.sender,
			"You are not the owner of this NFT"
		);
		require(
			ownerOf(otherNftId) != msg.sender,
			"You are the owner of this NFT"
		);
		require(exchanges[mineNftId] == 0, "My NFT is already in an exchange");
		require(
			exchanges[otherNftId] == 0,
			"The other NFT is already in an exchange"
		);
		exchanges[mineNftId] = otherNftId;
		exchanges[otherNftId] = mineNftId;

		approve(ownerOf(otherNftId), mineNftId);
		emit ExchangeProposed(mineNftId, otherNftId);
	}

	/**
	 * Function to accept an exchange
	 * @param mineNftId NFT the other want
	 * @param otherNftId NFT the other proposed to me
	 */
	function acceptExchange(uint256 mineNftId, uint256 otherNftId) public {
		require(
			ownerOf(mineNftId) == msg.sender,
			"You are not the owner of this NFT"
		);
		require(
			ownerOf(otherNftId) != msg.sender,
			"You are the owner of this NFT"
		);
		require(
			exchanges[mineNftId] == otherNftId,
			"This NFT is not in this exchange"
		);
		require(
			exchanges[otherNftId] == mineNftId,
			"This NFT is not in this exchange"
		);

		address me = ownerOf(mineNftId);
		address other = ownerOf(otherNftId);

		approve(ownerOf(otherNftId), mineNftId);

		safeTransferFrom(me, other, mineNftId);
		safeTransferFrom(other, me, otherNftId);

		exchanges[mineNftId] = 0;
		exchanges[otherNftId] = 0;
		nbOwners[mineNftId] += 1;
		nbOwners[otherNftId] += 1;

		emit ExchangeAccepted(mineNftId, otherNftId);
	}

	/**
	 * Remove proposition
	 * @param mineNftId mine nft id
	 * @param otherNftId the other nft id
	 */
	function removeExchange(uint256 mineNftId, uint256 otherNftId) public {
		require(
			ownerOf(mineNftId) == msg.sender,
			"You are not the owner of this NFT"
		);
		require(
			ownerOf(otherNftId) != msg.sender,
			"You are the owner of this NFT"
		);
		require(exchanges[mineNftId] == 0, "My NFT is already in an exchange");
		require(
			exchanges[otherNftId] == 0,
			"The other NFT is already in an exchange"
		);
		exchanges[mineNftId] = 0;
		exchanges[otherNftId] = 0;

		approve(address(0), mineNftId);
	}

	/**
	 * Function call to refuse Exchange
	 * @param mineNftId mine nft id
	 * @param otherNftId the other nft id
	 */
	function refuseExchange(uint256 mineNftId, uint256 otherNftId) public {
		require(
			ownerOf(mineNftId) == msg.sender,
			"You are not the owner of this NFT"
		);
		require(
			ownerOf(otherNftId) != msg.sender,
			"You are the owner of this NFT"
		);
		require(
			exchanges[mineNftId] == otherNftId,
			"This NFT is not in this exchange"
		);
		require(
			exchanges[otherNftId] == mineNftId,
			"This NFT is not in this exchange"
		);

		exchanges[mineNftId] = 0;
		exchanges[otherNftId] = 0;

		emit ExchangeRefused(mineNftId, otherNftId);
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

	/**
	 * Function to get the number of owner a nft has had
	 * @param nft id of the nft
	 */
	function getNbOwners(uint256 nft) public view returns (uint256) {
		return nbOwners[nft];
	}

	/**
	 * @dev Retourne tous les tokenIds possédés par une adresse donnée.
	 * @param owner L'adresse du propriétaire des NFTs.
	 * @return Une liste de tous les tokenIds possédés par l'adresse donnée.
	 */
	function getTokensOfOwner(
		address owner
	) external view returns (uint256[] memory) {
		uint256 totalTokens = _tokenIds;
		uint256[] memory temp = new uint256[](totalTokens);
		uint256 count = 0;
		for (uint256 i = 1; i <= totalTokens; i++) {
			if (ownerOf(i) == owner) {
				temp[count] = i;
				count++;
			}
		}

		uint256[] memory tokensId = new uint256[](count);
		for (uint256 i = 0; i < count; i++) {
			tokensId[i] = temp[i];
		}
		return tokensId;
	}
    /**
	 * @dev Retourne tous les tokens possédés par une adresse donnée.
	 * @param owner L'adresse du propriétaire des NFTs.
	 * @return Une liste de tous les tokens possédés par l'adresse donnée.
	 */
	function getTokensInfosOfOwner(
		address owner
	) external view returns (Watch[] memory) {
		uint256 totalTokens = _tokenIds;
		uint256[] memory temp = new uint256[](totalTokens);
		uint256 count = 0;
		for (uint256 i = 1; i <= totalTokens; i++) {
			if (ownerOf(i) == owner) {
				temp[count] = i;
				count++;
			}
		}

		Watch[] memory tokensInfo = new Watch[](count);
		for (uint256 i = 0; i < count; i++) {
			tokensInfo[i] = watchInfo[temp[i]];
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



}
