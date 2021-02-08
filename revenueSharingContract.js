// Rinkeby
const address = "0xD6024cccBE557B62AB530D4Ce990427b2C38e212";
// Thundercore
// const address = "0x28f1Af96138896b0c2F61a728C1c6EA61e43e77a"
const ABI = [
	{
		inputs: [
			{
				internalType: "uint256",
				name: "key",
				type: "uint256"
			},
			{
				internalType: "string",
				name: "paymentPointerName",
				type: "string"
			},
			{
				internalType: "uint256",
				name: "revShareValue",
				type: "uint256"
			}
		],
		name: "add",
		outputs: [
			{
				internalType: "uint256",
				name: "size",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "key",
				type: "uint256"
			}
		],
		name: "remove",
		outputs: [
			{
				internalType: "uint256",
				name: "size",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [],
		name: "getArraySize",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "getArrayStart",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "index",
				type: "uint256"
			}
		],
		name: "getOneEntry",
		outputs: [
			{
				internalType: "uint256",
				name: "key",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			},
			{
				internalType: "string",
				name: "name",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "getTotalPercentage",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "choice",
				type: "uint256"
			}
		],
		name: "pickPointer",
		outputs: [
			{
				internalType: "string",
				name: "paymentPointerName",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	}
]

module.exports = {
  address: address,
  ABI: ABI
};