// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract LuxuryWatch is ERC721, Ownable {
    uint256 private _tokenIds;

    struct Watch {
        string brand;
        string model;
        string serialNumber;
        uint256 price;
    }

    uint256 constant royaltyPercentage = 5;
    mapping(uint256 => Watch) private watchInfo;
    mapping(uint256 => address[]) private watchOwnershipHistory;
    mapping(uint256 => string) private watchMetadataURI;

    error Unauthorized(address caller);
    error PriceTooLow(uint256 requestedPrice, uint256 currentPrice);
    error TokenNotExist(uint256 tokenId);
    error NotOwner(address owner, address caller);
    error InsufficientFunds(uint256 available, uint256 required);
    error NotTokenOwner(address caller, uint256 tokenId);

    event WatchNFTCreated(uint256 indexed tokenId, string brand, string model, string serialNumber);
    event WatchNFTSold(uint256 indexed tokenId, address from, address to, uint256 price);
    event ApprovalForSale(uint256 indexed tokenId, address indexed approved, uint256 price);

    constructor() ERC721("LuxuryWatch", "MTK") {}

    function createWatchNFT(string memory _brand, string memory _model, string memory _serialNumber, uint256 _price, string memory _metadataURI) public {
        _tokenIds++;
        uint256 newItemId = _tokenIds;
        _mint(msg.sender, newItemId);

        Watch memory newWatch = Watch({
            brand: _brand,
            model: _model,
            serialNumber: _serialNumber,
            price: _price
        });

        watchInfo[newItemId] = newWatch;
        watchOwnershipHistory[newItemId].push(msg.sender);
        watchMetadataURI[newItemId] = _metadataURI;

        emit WatchNFTCreated(newItemId, _brand, _model, _serialNumber);
    }

    function approveForSale(uint256 _tokenId, address _approved, uint256 _price) public {
        if (ownerOf(_tokenId) != msg.sender) revert NotOwner(ownerOf(_tokenId), msg.sender);
        approve(_approved, _tokenId);
        watchInfo[_tokenId].price = _price;
        emit ApprovalForSale(_tokenId, _approved, _price);
    }

    function sellWatchNFT(uint256 _tokenId, address _buyer) public payable {
        if (getApproved(_tokenId) != _buyer) revert Unauthorized(msg.sender);
        if (msg.value < watchInfo[_tokenId].price) revert InsufficientFunds(msg.value, watchInfo[_tokenId].price);

        uint256 salePrice = watchInfo[_tokenId].price;
        uint256 royaltyFee = (salePrice * royaltyPercentage) / 100;

        address payable creator = payable(ownerOf(_tokenId));
        address payable seller = payable(msg.sender);

        // Transferring royalty to the creator
        (bool sent, ) = creator.call{value: royaltyFee}("");
        require(sent, "Failed to send Ether");

        // Transferring remaining funds to the seller
        (sent, ) = seller.call{value: salePrice - royaltyFee}("");
        require(sent, "Failed to send Ether");

        watchOwnershipHistory[_tokenId].push(_buyer);
        _transfer(msg.sender, _buyer, _tokenId);

        emit WatchNFTSold(_tokenId, msg.sender, _buyer, salePrice);
    }

    function getWatchOwnershipHistory(uint256 _tokenId) public view returns (address[] memory) {
        return watchOwnershipHistory[_tokenId];
    }

    function updateMetadataURI(uint256 _tokenId, string memory _newMetadataURI) public {
        if (ownerOf(_tokenId) != msg.sender) revert NotTokenOwner(msg.sender, _tokenId);
        watchMetadataURI[_tokenId] = _newMetadataURI;
    }

    // Vous pouvez ajouter plus de fonctions si nécessaire
}
