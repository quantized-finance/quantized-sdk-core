import invariant from 'tiny-invariant';
import { getAddress, getCreate2Address } from '@ethersproject/address';
import warning from 'tiny-warning';
import { ChainId, Currency } from '@uniswap/sdk-core';
import { keccak256, pack } from '@ethersproject/solidity';

var QuantizeType;

(function (QuantizeType) {
  QuantizeType[QuantizeType["QUANTIZE"] = 0] = "QUANTIZE";
  QuantizeType[QuantizeType["QUANTIZE_ETH"] = 1] = "QUANTIZE_ETH";
  QuantizeType[QuantizeType["DEQUANTIZE"] = 2] = "DEQUANTIZE";
  QuantizeType[QuantizeType["DEQUANTIZE_ETH"] = 3] = "DEQUANTIZE_ETH";
})(QuantizeType || (QuantizeType = {}));

var FACTORY_ADDRESS = '0x1da48ae241B984C8BA795677616DCc13b93e4d60';
var INIT_CODE_HASH = '0xfae899166b643caca96e31150882fba4e4f9081412d03b8c39cc844124b91e22';

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function validateAndParseAddress(address) {
  try {
    var checksummedAddress = getAddress(address);
    process.env.NODE_ENV !== "production" ? warning(address === checksummedAddress, address + " is not checksummed.") : void 0;
    return checksummedAddress;
  } catch (error) {
     process.env.NODE_ENV !== "production" ? invariant(false, address + " is not a valid address.") : invariant(false) ;
  }
}

var _WETH;
var computeQuantizedAddress = function computeQuantizedAddress(_ref) {
  var factoryAddress = _ref.factoryAddress,
      tokenAddress = _ref.tokenAddress;
  return getCreate2Address(factoryAddress, keccak256(['bytes'], [pack(['address'], [tokenAddress])]), INIT_CODE_HASH);
};
/**
 * Represents an ERC20 token with a unique address and some metadata.
 */

var QuantizedToken = /*#__PURE__*/function (_Currency) {
  _inheritsLoose(QuantizedToken, _Currency);

  function QuantizedToken(chainId, address, decimals, symbol, name) {
    var _this;

    _this = _Currency.call(this, decimals, symbol, name) || this;
    _this.chainId = chainId;
    _this.address = validateAndParseAddress(address);
    _this.qaddress = QuantizedToken.getQuantizedAddress(validateAndParseAddress(address));
    return _this;
  }

  QuantizedToken.getQuantizedAddress = function getQuantizedAddress(address) {
    return computeQuantizedAddress({
      factoryAddress: FACTORY_ADDRESS,
      tokenAddress: address
    });
  }
  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  ;

  var _proto = QuantizedToken.prototype;

  _proto.equals = function equals(other) {
    // short circuit on reference equality
    if (this === other) {
      return true;
    }

    return this.chainId === other.chainId && this.address === other.address;
  }
  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  ;

  _proto.sortsBefore = function sortsBefore(other) {
    !(this.chainId === other.chainId) ? process.env.NODE_ENV !== "production" ? invariant(false, 'CHAIN_IDS') : invariant(false) : void 0;
    !(this.address !== other.address) ? process.env.NODE_ENV !== "production" ? invariant(false, 'ADDRESSES') : invariant(false) : void 0;
    return this.address.toLowerCase() < other.address.toLowerCase();
  };

  return QuantizedToken;
}(Currency);
/**
 * Compares two currencies for equality
 */

function currencyEquals(currencyA, currencyB) {
  if (currencyA instanceof QuantizedToken && currencyB instanceof QuantizedToken) {
    return currencyA.equals(currencyB);
  } else if (currencyA instanceof QuantizedToken) {
    return false;
  } else if (currencyB instanceof QuantizedToken) {
    return false;
  } else {
    return currencyA === currencyB;
  }
}
var WETH9 = (_WETH = {}, _WETH[ChainId.MAINNET] = /*#__PURE__*/new QuantizedToken(ChainId.MAINNET, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH9', 'Wrapped Ether'), _WETH[ChainId.ROPSTEN] = /*#__PURE__*/new QuantizedToken(ChainId.ROPSTEN, '0xc778417E063141139Fce010982780140Aa0cD5Ab', 18, 'WETH9', 'Wrapped Ether'), _WETH[ChainId.RINKEBY] = /*#__PURE__*/new QuantizedToken(ChainId.RINKEBY, '0xc778417E063141139Fce010982780140Aa0cD5Ab', 18, 'WETH9', 'Wrapped Ether'), _WETH[ChainId.GÖRLI] = /*#__PURE__*/new QuantizedToken(ChainId.GÖRLI, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 18, 'WETH9', 'Wrapped Ether'), _WETH[ChainId.KOVAN] = /*#__PURE__*/new QuantizedToken(ChainId.KOVAN, '0xd0A1E359811322d97991E03f863a0C30C2cF029C', 18, 'WETH9', 'Wrapped Ether'), _WETH);

export { FACTORY_ADDRESS, INIT_CODE_HASH, QuantizeType, QuantizedToken, WETH9, computeQuantizedAddress, currencyEquals, validateAndParseAddress };
//# sourceMappingURL=sdk-core.esm.js.map
