import { assert } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";
import { ContractV1, ContractV2, Proxy } from "../typechain";
import { calculateFunctionSelector, callFunctionOnContractWithSelector, sendTransactionToFunctionOnContractWithSelector } from "./utils";

describe("Proxy", function () {

  let proxyContract: Proxy;
  let contractV1: ContractV1;
  let contractV2: ContractV2;
  let signers: Array<Signer>;
  let owner: Signer;

  before(async () => {
    // Get signers
    signers = await ethers.getSigners();
    owner = signers[0];

    // Deploy implementation contracts
    const [contractV1Factory, contractV2Factory] = await Promise.all([
      ethers.getContractFactory("ContractV1"),
      ethers.getContractFactory("ContractV2")
    ]);

    [contractV1, contractV2] = await Promise.all([contractV1Factory, contractV2Factory].map(async (contractFactory, index) => {
      const contract = await contractFactory.deploy();
      await contract.deployed();
      return contract;
    }));

    // Deploy proxy contract
    const proxyContractFactory = await ethers.getContractFactory("ProxyContract");
    proxyContract = await proxyContractFactory.deploy(contractV1.address);
    await proxyContract.deployed();
  });

  it("Proxy should have its implementation correctly upgraded", async function () {
    const versionRespInitial = (await callFunctionOnContractWithSelector(proxyContract.address, "getVersionString()", owner, [], [], ["string"]))[0];

    await sendTransactionToFunctionOnContractWithSelector(proxyContract.address, "upgradeTo(address)", owner, ["address"], [contractV2.address]);

    const versionRespFinal = (await callFunctionOnContractWithSelector(proxyContract.address, "getVersionString()", owner, [], [], ["string"]))[0];

    assert.equal(versionRespInitial, "Contract V1", "Initial contract version came incorrect!");
    assert.equal(versionRespFinal, "Contract V2", "Final contract version came incorrect!");
  });
});
