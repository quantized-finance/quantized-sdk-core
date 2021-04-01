import { ChainId } from '@uniswap/sdk-core';
import { Currency } from '@uniswap/sdk-core';
export declare const computeQuantizedAddress: ({ factoryAddress, tokenAddress }: {
    factoryAddress: string;
    tokenAddress: string;
}) => string;
/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export declare class QuantizedToken extends Currency {
    readonly chainId: ChainId | number;
    readonly address: string;
    readonly qaddress: string;
    static getQuantizedAddress(address: string): string;
    constructor(chainId: ChainId | number, address: string, decimals: number, symbol?: string, name?: string);
    /**
     * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
     * @param other other token to compare
     */
    equals(other: QuantizedToken): boolean;
    /**
     * Returns true if the address of this token sorts before the address of the other token
     * @param other other token to compare
     * @throws if the tokens have the same address
     * @throws if the tokens are on different chains
     */
    sortsBefore(other: QuantizedToken): boolean;
}
/**
 * Compares two currencies for equality
 */
export declare function currencyEquals(currencyA: Currency, currencyB: Currency): boolean;
export declare const WETH9: {
    [chainId in ChainId]: QuantizedToken;
};
