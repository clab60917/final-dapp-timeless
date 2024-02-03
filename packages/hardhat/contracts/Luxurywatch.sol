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
	mapping(uint256 => Watch) private _watchInfo;
	// Array containing the number of owner for each nft
	mapping(uint256 => uint256) private _nbOwners;
	// Array containing all nftID owned by an address
	mapping(address => uint256[]) private _nftOwnedBy;
	//Array with an exchange for each nft 
	mapping(uint256 => Exchange) private _exchanges;

	/*____________Event definitions_________________*/	
	event WatchNFTCreated(
		address sender,
		uint256 indexed tokenId,
		string brand,
		string model,
		string serialNumber
	);
	event ExchangeProposed(uint256 proposed, uint256 wanted);
	event ExchangeAccepted(uint256 proposed, uint256 wanted);
	event ExchangeRefused(uint256 proposed, uint256 wanted);
	event ExchangeRemoved(uint256 proposed, uint256 wanted);
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
	modifier NFTNotInExchange(uint256 nft){
		require(_exchanges[nft].progress,"NFT not in an exchange");
		_;
	}
	modifier NFTInExchange(uint256 nft){
		require(!_exchanges[nft].progress,"NFT in an exchange");
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
	) external {
		
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
		_watchInfo[_tokenIds] = newWatch;
		// Set number of owner for the nft to 1
		_nbOwners[_tokenIds] = 1;
		_nftOwnedBy[msg.sender].push(_tokenIds);

		// Change the state of the token
		_exchanges[_tokenIds].progress = false;
		

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

	/**
	* Function to propose an exchange
	* @param proposed id of the proposed token
	* @param wanted id of the wanted token
	*/
	function proposeExchange(uint256 proposed, uint256 wanted)

	external {
		_exchanges[wanted].progress = true;
		_exchanges[wanted].exchangeWith = _watchInfo[proposed];
		_exchanges[wanted].currentWatch = _watchInfo[wanted];
		_exchanges[wanted].proposedBy = msg.sender;

		_exchanges[proposed].progress = true;
		_exchanges[proposed].exchangeWith = _watchInfo[wanted];
		_exchanges[proposed].currentWatch = _watchInfo[proposed];
		_exchanges[proposed].proposedBy = msg.sender;

		approve(ownerOf(wanted), proposed);
		emit ExchangeProposed(proposed, wanted);
	}

	/**
	* Function to accept an exchange between two token
	* @param proposed id of the proposed token
	* @param wanted id of the wanted token
	*/
	function acceptExchange(uint256 proposed, uint256 wanted)
	external{
		
		address me = ownerOf(wanted);
		address other = ownerOf(proposed);

		// Approve the transaction
		approve(ownerOf(proposed), wanted);

		// Transfert both nft
		safeTransferFrom(me, other, wanted);
		safeTransferFrom(other, me, proposed);

		// Remove nft from the collection of the old owners
		removeNFTFromCollection(proposed, other);
		removeNFTFromCollection(wanted, me);

		// add nft to the collections of the new owners
		_nftOwnedBy[me].push(proposed);
		_nftOwnedBy[other].push(wanted);

		// Change state of the both nfts
		_exchanges[wanted].progress = false;
		_exchanges[proposed].progress = false;

		emit ExchangeAccepted(proposed, wanted);
	}

	/**
	* Function to remove a proposed exchange
	* @param proposed id of the proposed token
	* @param wanted id of the wanted token
	*/
	function removeExchange(uint256 proposed, uint256 wanted) 
	external{
		// Change state of the both nfts
		_exchanges[wanted].progress = false;
		_exchanges[proposed].progress = false;

		// Disaprove the transaction
		approve(address(0), proposed);

		emit ExchangeRemoved(proposed, wanted);
	}

	/**
	* Function to refuse a proposed exchange
	* @param proposed id of the proposed token
	* @param wanted id of the wanted token
	*/
	function refuseExchange(uint256 proposed, uint256 wanted) external{
		_exchanges[wanted].progress = false;
		_exchanges[proposed].progress = false;

		emit ExchangeRefused(proposed, wanted);
	}

	/**
	* Function to returns all exchanges for or by a address
	* @param owner address of the account we want to analyse
	* @param by bool to know if we want to know : 
	*	true  -> the exchanges propsed BY the owner
	*	false -> the exchanges propsed FOR the owner
	* @return Array with all exchanges by or for an owner
	*/
	function getExchanges(address owner, bool by ) internal view returns(Exchange[] memory){
		// Get the max lenght of the nft owned by the owner
		uint256 nbNFT = _nftOwnedBy[owner].length;
		uint256 count = 0;
		Exchange[] memory tmp = new Exchange[](nbNFT);

		// Iterate over the nft owned by the owner
		for(uint256 i = 0; i < nbNFT; i++){
			uint256 currentNft = _nftOwnedBy[owner][i]; 
			if(by){
				// If the current nft is in exchange and proposed by the owner 
				// then store current exchange in temp
				if(_exchanges[currentNft].proposedBy == owner && _exchanges[currentNft].progress){
					tmp[count++] = _exchanges[currentNft];
				}
			}else{
				// If the current nft is in exchange and proposed for the owner 
				// then store current exchange in temp
				if(_exchanges[currentNft].proposedBy != owner && _exchanges[currentNft].progress){
					tmp[count++] = _exchanges[currentNft];
				}
			}
			
		}

		// Diminition of the array size for the return
		Exchange[] memory exchangesProposedBy = new Exchange[](count);
		for(uint256 i = 0; i < count; i++){
			exchangesProposedBy[i] = tmp[i];
		}

		return exchangesProposedBy;
	}

	/**
	* Function to get all the exchanges proposed by the owner
	* @param owner address used to get the exchanges
	* @return Array with all exchanges by an owner
	*/
	function getExchangesProposedBy(address owner) public view returns(Exchange[] memory){
		return getExchanges(owner, true);
	}

	/**
	* Function to get all the exchanges proposed for the owner
	* @param owner address used to get the exchanges
	* @return Array with all exchanges for an owner
	*/
	function getExchangesFor(address owner) public view returns(Exchange[] memory){
		return getExchanges(owner, false);
	}

	/*____________Functions utils_________________*/
	/**
	 * Function to get the number of owner a nft has had
	 * @param nft id of the nft
	 */
	function getNbOwners(uint256 nft) public view returns (uint256) {
		return _nbOwners[nft];
	}

	/**
	* Function to remove a nft of an owner collection
	* @param nft id to remove
	* @param owner address of the owner
	*/
	function removeNFTFromCollection(uint256 nft, address owner) private{
		bool found = false;
		uint numberOfNFT = _nftOwnedBy[owner].length;

		// Iteration over the nft of an owner
		for (uint i = 0; i<numberOfNFT-1; i++){

			// If the current nft is the one wanted
			// then delete it
            if(_nftOwnedBy[owner][i] == nft){
				delete _nftOwnedBy[owner][i];
				found = true;
			}
			// If the nft has been found translate the nft
			if(found){
				_nftOwnedBy[owner][i] = _nftOwnedBy[owner][i+1];
			}
        }

		// If nft has been found or the last is the wanted one
		// Then pop it
		if(found || _nftOwnedBy[owner][numberOfNFT-1] == nft){
			_nftOwnedBy[owner].pop();
		}
	}

	/**
	 * Function to get all the tokens owned by an owner
	 * @param owner address of the owner
	 * @return array of the id
	 */
	function getTokensOfOwner(address owner) public view returns (uint256[] memory) {
		return _nftOwnedBy[owner];
	}
    /**
	 * Function to get all infos of the tokens owned by an owner
	 * @param owner address of the owner
	 * @return array of the infos
	 */
	function getTokensInfosOfOwner(address owner) external view returns (Watch[] memory) {
		Watch[] memory tokensInfo = new Watch[](_nftOwnedBy[owner].length);
		for (uint256 i = 0; i < _nftOwnedBy[owner].length; i++) {
			tokensInfo[i] = _watchInfo[_nftOwnedBy[owner][i]];
		}
		return tokensInfo;
	}

    /**
     * Function to get all the watch infos
	 * @return array with all watch infos
     */
    function getAllWatches() public view returns(Watch[] memory){
        Watch[] memory tokensInfo = new Watch[](_tokenIds);
		for (uint256 i = 1; i <= _tokenIds; i++) {
			tokensInfo[i-1] = _watchInfo[i];
		}
		return tokensInfo;
    }

	/**
	* Function to get the number of nft owned by a owner
	* @param owner address of the owner
	* @return number of nft owned by an owner
	*/
	function getNumberNftOwnedBy(address owner) public view returns(uint256){
		return _nftOwnedBy[owner].length;
	}


}