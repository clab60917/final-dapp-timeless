// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract LuxuryWatch is ERC721 {
	uint256 private _tokenIds = 0;
	/*____________Structure definitions_________________*/
	struct Watch {
		string brand;
		string model;
		string serialNumber;
		uint256 price;
		string uriMetadata;
		uint256 id;
	}
	struct Exchange{
		Watch exchangeWith;
		Watch currentWatch;
		address proposedBy;
		bool progress;
	}


	/*____________Mapping definitions_________________*/	
	// Array containing the watch nft
	mapping(uint256 => Watch) private watchInfo;
	// Array containing the number of owner for each nft
	mapping(uint256 => uint256) private nbOwners;
	// Array containing all nftID owned by an address
	mapping(address => uint256[]) private nftOwnedBy;
	//Array with an exchange for each nft 
	mapping(uint256 => Exchange) private exchanges;
	
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
	event ExchangeAccepted(uint256 id);
	event ExchangeRefused(uint256 id);
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
	
	/*____________Functions definitions_________________*/

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
			uriMetadata: _metadataURI,
			id: _tokenIds
		});

		// Save content of the NFT in the contract memory
		watchInfo[_tokenIds] = newWatch;
		// Set number of owner for the nft to 1
		nbOwners[_tokenIds] = 1;
		nftOwnedBy[msg.sender].push(_tokenIds);

		// Set the 
		exchanges[_tokenIds].progress = false;
		

		// Emit
		emit WatchNFTCreated(
			msg.sender,
			_tokenIds,
			_brand,
			_model,
			_serialNumber
		);
	}

	/*____________Functions for the exchange_________________*/

	function proposeExchange(uint256 proposed, uint256 wanted) public {
		exchanges[wanted].progress = true;
		exchanges[wanted].exchangeWith = watchInfo[proposed];
		exchanges[wanted].currentWatch = watchInfo[wanted];
		exchanges[wanted].proposedBy = msg.sender;

		exchanges[proposed].progress = true;
		exchanges[proposed].exchangeWith = watchInfo[wanted];
		exchanges[proposed].currentWatch = watchInfo[proposed];
		exchanges[proposed].proposedBy = msg.sender;

		approve(ownerOf(wanted), proposed);

	}

	function acceptExchange(uint256 proposed, uint256 wanted) public{
		exchanges[wanted].progress = false;
		exchanges[proposed].progress = false;
		address me = ownerOf(wanted);
		address other = ownerOf(proposed);

		approve(ownerOf(proposed), wanted);

		safeTransferFrom(me, other, wanted);
		safeTransferFrom(other, me, proposed);

		removeNFTFromCollection(proposed, other);
		removeNFTFromCollection(wanted, me);

		nftOwnedBy[me].push(proposed);
		nftOwnedBy[other].push(wanted);
	}

	function removeExchange(uint256 proposed, uint256 wanted) public{
		exchanges[wanted].progress = false;
		exchanges[proposed].progress = false;

		approve(address(0), proposed);
	}

	function refuseExchange(uint256 proposed, uint256 wanted) public{
		exchanges[wanted].progress = false;
		exchanges[proposed].progress = false;
	}

	function getExchanges(address owner, bool by ) public view returns(Exchange[] memory){
		uint256 nbNFT = nftOwnedBy[owner].length;
		uint256 count = 0;
		Exchange[] memory tmp = new Exchange[](nbNFT);
		for(uint256 i = 0; i < nbNFT; i++){
			uint256 currentNft = nftOwnedBy[owner][i]; 
			if(by){
				if(exchanges[currentNft].proposedBy == owner && exchanges[currentNft].progress){
					tmp[count++] = exchanges[currentNft];
				}
			}else{
				if(exchanges[currentNft].proposedBy != owner && exchanges[currentNft].progress){
					tmp[count++] = exchanges[currentNft];
				}
			}
			
		}
		Exchange[] memory exchangesProposedBy = new Exchange[](count);
		for(uint256 i = 0; i < count; i++){
			exchangesProposedBy[i] = tmp[i];
		}

		return exchangesProposedBy;
	}

	function getExchangesProposedBy(address owner) public view returns(Exchange[] memory){
		return getExchanges(owner, true);
	}

	function getExchangesFor(address owner) public view returns(Exchange[] memory){
		return getExchanges(owner, false);
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
		if(found || nftOwnedBy[owner][numberOfNFT-1] == nft){
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
		for (uint256 i = 1; i <= _tokenIds; i++) {
			tokensInfo[i-1] = watchInfo[i];
		}
		return tokensInfo;
    }

	function getNumberNftOwnedBy(address owner) public view returns(uint256){
		return nftOwnedBy[owner].length;
	}


}
