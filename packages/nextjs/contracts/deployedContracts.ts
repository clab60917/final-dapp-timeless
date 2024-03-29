/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  31337: {
    LuxuryWatch: {
      address: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "approved",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "Approval",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "approved",
              type: "bool",
            },
          ],
          name: "ApprovalForAll",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "proposed",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "wanted",
              type: "uint256",
            },
          ],
          name: "ExchangeAccepted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "proposed",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "wanted",
              type: "uint256",
            },
          ],
          name: "ExchangeProposed",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "proposed",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "wanted",
              type: "uint256",
            },
          ],
          name: "ExchangeRefused",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "proposed",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "wanted",
              type: "uint256",
            },
          ],
          name: "ExchangeRemoved",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "string",
              name: "brand",
              type: "string",
            },
            {
              indexed: false,
              internalType: "string",
              name: "model",
              type: "string",
            },
            {
              indexed: false,
              internalType: "string",
              name: "serialNumber",
              type: "string",
            },
          ],
          name: "WatchNFTCreated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "ownerChanged",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "proposed",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "wanted",
              type: "uint256",
            },
          ],
          name: "acceptExchange",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "_brand",
              type: "string",
            },
            {
              internalType: "string",
              name: "_model",
              type: "string",
            },
            {
              internalType: "string",
              name: "_serialNumber",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "_price",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "_metadataURI",
              type: "string",
            },
          ],
          name: "createWatchNFT",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "getAllWatches",
          outputs: [
            {
              components: [
                {
                  internalType: "string",
                  name: "brand",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "model",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "serialNumber",
                  type: "string",
                },
                {
                  internalType: "uint256",
                  name: "price",
                  type: "uint256",
                },
                {
                  internalType: "string",
                  name: "uriMetadata",
                  type: "string",
                },
                {
                  internalType: "uint256",
                  name: "id",
                  type: "uint256",
                },
              ],
              internalType: "struct LuxuryWatch.Watch[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "getApproved",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "getExchangesFor",
          outputs: [
            {
              components: [
                {
                  components: [
                    {
                      internalType: "string",
                      name: "brand",
                      type: "string",
                    },
                    {
                      internalType: "string",
                      name: "model",
                      type: "string",
                    },
                    {
                      internalType: "string",
                      name: "serialNumber",
                      type: "string",
                    },
                    {
                      internalType: "uint256",
                      name: "price",
                      type: "uint256",
                    },
                    {
                      internalType: "string",
                      name: "uriMetadata",
                      type: "string",
                    },
                    {
                      internalType: "uint256",
                      name: "id",
                      type: "uint256",
                    },
                  ],
                  internalType: "struct LuxuryWatch.Watch",
                  name: "exchangeWith",
                  type: "tuple",
                },
                {
                  components: [
                    {
                      internalType: "string",
                      name: "brand",
                      type: "string",
                    },
                    {
                      internalType: "string",
                      name: "model",
                      type: "string",
                    },
                    {
                      internalType: "string",
                      name: "serialNumber",
                      type: "string",
                    },
                    {
                      internalType: "uint256",
                      name: "price",
                      type: "uint256",
                    },
                    {
                      internalType: "string",
                      name: "uriMetadata",
                      type: "string",
                    },
                    {
                      internalType: "uint256",
                      name: "id",
                      type: "uint256",
                    },
                  ],
                  internalType: "struct LuxuryWatch.Watch",
                  name: "currentWatch",
                  type: "tuple",
                },
                {
                  internalType: "address",
                  name: "proposedBy",
                  type: "address",
                },
                {
                  internalType: "bool",
                  name: "progress",
                  type: "bool",
                },
              ],
              internalType: "struct LuxuryWatch.Exchange[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "getExchangesProposedBy",
          outputs: [
            {
              components: [
                {
                  components: [
                    {
                      internalType: "string",
                      name: "brand",
                      type: "string",
                    },
                    {
                      internalType: "string",
                      name: "model",
                      type: "string",
                    },
                    {
                      internalType: "string",
                      name: "serialNumber",
                      type: "string",
                    },
                    {
                      internalType: "uint256",
                      name: "price",
                      type: "uint256",
                    },
                    {
                      internalType: "string",
                      name: "uriMetadata",
                      type: "string",
                    },
                    {
                      internalType: "uint256",
                      name: "id",
                      type: "uint256",
                    },
                  ],
                  internalType: "struct LuxuryWatch.Watch",
                  name: "exchangeWith",
                  type: "tuple",
                },
                {
                  components: [
                    {
                      internalType: "string",
                      name: "brand",
                      type: "string",
                    },
                    {
                      internalType: "string",
                      name: "model",
                      type: "string",
                    },
                    {
                      internalType: "string",
                      name: "serialNumber",
                      type: "string",
                    },
                    {
                      internalType: "uint256",
                      name: "price",
                      type: "uint256",
                    },
                    {
                      internalType: "string",
                      name: "uriMetadata",
                      type: "string",
                    },
                    {
                      internalType: "uint256",
                      name: "id",
                      type: "uint256",
                    },
                  ],
                  internalType: "struct LuxuryWatch.Watch",
                  name: "currentWatch",
                  type: "tuple",
                },
                {
                  internalType: "address",
                  name: "proposedBy",
                  type: "address",
                },
                {
                  internalType: "bool",
                  name: "progress",
                  type: "bool",
                },
              ],
              internalType: "struct LuxuryWatch.Exchange[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "nft",
              type: "uint256",
            },
          ],
          name: "getNbOwners",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "getNumberNftOwnedBy",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "getTokensInfosOfOwner",
          outputs: [
            {
              components: [
                {
                  internalType: "string",
                  name: "brand",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "model",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "serialNumber",
                  type: "string",
                },
                {
                  internalType: "uint256",
                  name: "price",
                  type: "uint256",
                },
                {
                  internalType: "string",
                  name: "uriMetadata",
                  type: "string",
                },
                {
                  internalType: "uint256",
                  name: "id",
                  type: "uint256",
                },
              ],
              internalType: "struct LuxuryWatch.Watch[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "getTokensOfOwner",
          outputs: [
            {
              internalType: "uint256[]",
              name: "",
              type: "uint256[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
          ],
          name: "isApprovedForAll",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "name",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "ownerOf",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "proposed",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "wanted",
              type: "uint256",
            },
          ],
          name: "proposeExchange",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "proposed",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "wanted",
              type: "uint256",
            },
          ],
          name: "refuseExchange",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "proposed",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "wanted",
              type: "uint256",
            },
          ],
          name: "removeExchange",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "safeTransferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "safeTransferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              internalType: "bool",
              name: "approved",
              type: "bool",
            },
          ],
          name: "setApprovalForAll",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "symbol",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "tokenURI",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "transferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      inheritedFunctions: {},
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
