// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract ProxyContract is ERC1967Proxy {
    /**
    @notice Constructor
     */
    constructor(address _implementationContractAddr)
        ERC1967Proxy(
            _implementationContractAddr,
            abi.encodeWithSignature("initialize(uint256)", 1)
        )
    {}
}
