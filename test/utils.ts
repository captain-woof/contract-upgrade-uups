import { Contract, providers, Signer } from "ethers"
import { ethers } from "hardhat"

/**
 * @notice Calculates the function selector
 * @param functionSig Signature of a function
 * @return Selector
 */
export const calculateFunctionSelector = (functionSig: string) => {
    return (
        ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes(functionSig)
        ).slice(0, 10)
    )
}

/**
 * @notice Calls a function on contract with its selector
 * @param contractAddr Address of the contract
 * @param functionSig Signature of the function
 * @param signerOrProvider Signer or Provider
 * @param inputArgsType Array of input arg values' types
 * @param inputArgs Array of input args
 * @param returnArgsType Array of return arg values' types
 * @returns Result
 */
export const callFunctionOnContractWithSelector = async (contractAddr: string, functionSig: string, signerOrProvider: Signer | providers.Provider, inputArgsType: Array<string>, inputArgs: Array<any>, returnArgsType: Array<string>) => {
    const dataToSend = calculateFunctionSelector(functionSig)
        + ethers.utils.defaultAbiCoder.encode(inputArgsType, inputArgs).slice(2);

    const data = await signerOrProvider.call({
        to: contractAddr,
        data: dataToSend
    });

    const dataDecoded = ethers.utils.defaultAbiCoder.decode(
        returnArgsType,
        data
    );

    return dataDecoded;
}

/**
 * @notice Calls a function on contract with its selector
 * @param contractAddr Address of the contract
 * @param functionSig Signature of the function
 * @param signerOrProvider Signer or Provider
 * @param inputArgsType Array of input arg values' types
 * @param inputArgs Array of input args
 * @returns Transaction receipt
 */
export const sendTransactionToFunctionOnContractWithSelector = async (contractAddr: string, functionSig: string, signerOrProvider: Signer | providers.Provider, inputArgsType: Array<string>, inputArgs: Array<any>) => {
    const dataToSend = calculateFunctionSelector(functionSig)
        + ethers.utils.defaultAbiCoder.encode(inputArgsType, inputArgs).slice(2);

    const data = await signerOrProvider.sendTransaction({
        to: contractAddr,
        data: dataToSend
    } as any);
    const rcpt = await data.wait();

    return rcpt;
}