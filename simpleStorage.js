// Thundercore
// const address = "0xbF4e73d4E60b90dBa5D7fA031BC3428EF7FB192E";
// Rinkeby
const address = "0x8205dea8F53F06A7b4Ea9BDA95D6088bbC6163c9"
// const address = "0x59a7bc1360A43ba1835249CA934Cfe7994966499";
const ABI = [
	{
		constant: false,
		inputs: [
			{
				name: "x",
				type: "uint256"
			}
		],
		name: "set",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: true,
		inputs: [],
		name: "get",
		outputs: [
			{
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	}
]


module.exports = {
  address: address,
  ABI: ABI
};