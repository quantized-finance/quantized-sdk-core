import invariant from 'tiny-invariant'
import validateAndParseAddress from '../utils/validateAndParseAddress'
import { ChainId } from '@uniswap/sdk-core'
import { Currency } from '@uniswap/sdk-core'
import { pack, keccak256 } from '@ethersproject/solidity'
import { getCreate2Address } from '@ethersproject/address'

import { FACTORY_ADDRESS, INIT_CODE_HASH } from '../constants'

export const computeQuantizedAddress = ({
  factoryAddress,
  tokenAddress
}: {
  factoryAddress: string
  tokenAddress: string
}): string => {
  return getCreate2Address(
    factoryAddress,
    keccak256(['bytes'], [pack(['address'], [tokenAddress])]),
    INIT_CODE_HASH
  )
}

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class QuantizedToken extends Currency {
  public readonly chainId: ChainId | number
  public readonly address: string
  public readonly qaddress: string

  public static getQuantizedAddress(address: string): string {
    return computeQuantizedAddress({ factoryAddress: FACTORY_ADDRESS, tokenAddress: address })
  }

  public constructor(chainId: ChainId | number, address: string, decimals: number, symbol?: string, name?: string) {
    super(decimals, symbol, name)
    this.chainId = chainId
    this.address = validateAndParseAddress(address)
    this.qaddress = QuantizedToken.getQuantizedAddress(validateAndParseAddress(address))
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: QuantizedToken): boolean {
    // short circuit on reference equality
    if (this === other) {
      return true
    }
    return this.chainId === other.chainId && this.address === other.address
  }

  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  public sortsBefore(other: QuantizedToken): boolean {
    invariant(this.chainId === other.chainId, 'CHAIN_IDS')
    invariant(this.address !== other.address, 'ADDRESSES')
    return this.address.toLowerCase() < other.address.toLowerCase()
  }
}

/**
 * Compares two currencies for equality
 */
export function currencyEquals(currencyA: Currency, currencyB: Currency): boolean {
  if (currencyA instanceof QuantizedToken && currencyB instanceof QuantizedToken) {
    return currencyA.equals(currencyB)
  } else if (currencyA instanceof QuantizedToken) {
    return false
  } else if (currencyB instanceof QuantizedToken) {
    return false
  } else {
    return currencyA === currencyB
  }
}

export const WETH9: { [chainId in ChainId]: QuantizedToken } = {
  [ChainId.MAINNET]: new QuantizedToken(
    ChainId.MAINNET,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH9',
    'Wrapped Ether'
  ),
  [ChainId.ROPSTEN]: new QuantizedToken(
    ChainId.ROPSTEN,
    '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    18,
    'WETH9',
    'Wrapped Ether'
  ),
  [ChainId.RINKEBY]: new QuantizedToken(
    ChainId.RINKEBY,
    '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    18,
    'WETH9',
    'Wrapped Ether'
  ),
  [ChainId.GÖRLI]: new QuantizedToken(ChainId.GÖRLI, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 18, 'WETH9', 'Wrapped Ether'),
  [ChainId.KOVAN]: new QuantizedToken(ChainId.KOVAN, '0xd0A1E359811322d97991E03f863a0C30C2cF029C', 18, 'WETH9', 'Wrapped Ether')
}
