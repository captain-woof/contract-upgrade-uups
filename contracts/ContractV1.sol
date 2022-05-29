// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract ContractV1 is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    ////////////////////
    // STORAGE
    ////////////////////
    uint256 public number;

    ////////////////////
    // FUNCTIONS
    ////////////////////

    /**
    @notice Initializer
     */
    function initialize(uint256 _number) external initializer {
        __Ownable_init();
        number = _number;
    }

    /**
    @notice Called when contract is to be upgraded
     */
    function _authorizeUpgrade(address) internal override onlyOwner {}

    /**
    @notice Function to get contract version
     */
    function getVersionString() external pure returns (string memory) {
        return "Contract V1";
    }
}
