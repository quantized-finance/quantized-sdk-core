'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var invariant = _interopDefault(require('tiny-invariant'));
var address = require('@ethersproject/address');
var warning = _interopDefault(require('tiny-warning'));
var sdkCore = require('@uniswap/sdk-core');
var solidity = require('@ethersproject/solidity');

(function (QuantizeType) {
  QuantizeType[QuantizeType["QUANTIZE"] = 0] = "QUANTIZE";
  QuantizeType[QuantizeType["QUANTIZE_ETH"] = 1] = "QUANTIZE_ETH";
  QuantizeType[QuantizeType["DEQUANTIZE"] = 2] = "DEQUANTIZE";
  QuantizeType[QuantizeType["DEQUANTIZE_ETH"] = 3] = "DEQUANTIZE_ETH";
})(exports.QuantizeType || (exports.QuantizeType = {}));

var FACTORY_ADDRESS = '0x1da48ae241B984C8BA795677616DCc13b93e4d60';
var INIT_CODE_HASH = '0xfae899166b643caca96e31150882fba4e4f9081412d03b8c39cc844124b91e22';

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function validateAndParseAddress(address$1) {
  try {
    var checksummedAddress = address.getAddress(address$1);
    "development" !== "production" ? warning(address$1 === checksummedAddress, address$1 + " is not checksummed.") : void 0;
    return checksummedAddress;
  } catch (error) {
      invariant(false, address$1 + " is not a valid address.")  ;
  }
}

var _WETH;
var computeQuantizedAddress = function computeQuantizedAddress(_ref) {
  var factoryAddress = _ref.factoryAddress,
      tokenAddress = _ref.tokenAddress;
  return address.getCreate2Address(factoryAddress, solidity.keccak256(['bytes'], [solidity.pack(['address'], [tokenAddress])]), INIT_CODE_HASH);
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
    !(this.chainId === other.chainId) ?  invariant(false, 'CHAIN_IDS')  : void 0;
    !(this.address !== other.address) ?  invariant(false, 'ADDRESSES')  : void 0;
    return this.address.toLowerCase() < other.address.toLowerCase();
  };

  return QuantizedToken;
}(sdkCore.Currency);
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
var WETH9 = (_WETH = {}, _WETH[sdkCore.ChainId.MAINNET] = /*#__PURE__*/new QuantizedToken(sdkCore.ChainId.MAINNET, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH9', 'Wrapped Ether'), _WETH[sdkCore.ChainId.ROPSTEN] = /*#__PURE__*/new QuantizedToken(sdkCore.ChainId.ROPSTEN, '0xc778417E063141139Fce010982780140Aa0cD5Ab', 18, 'WETH9', 'Wrapped Ether'), _WETH[sdkCore.ChainId.RINKEBY] = /*#__PURE__*/new QuantizedToken(sdkCore.ChainId.RINKEBY, '0xc778417E063141139Fce010982780140Aa0cD5Ab', 18, 'WETH9', 'Wrapped Ether'), _WETH[sdkCore.ChainId.GÖRLI] = /*#__PURE__*/new QuantizedToken(sdkCore.ChainId.GÖRLI, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 18, 'WETH9', 'Wrapped Ether'), _WETH[sdkCore.ChainId.KOVAN] = /*#__PURE__*/new QuantizedToken(sdkCore.ChainId.KOVAN, '0xd0A1E359811322d97991E03f863a0C30C2cF029C', 18, 'WETH9', 'Wrapped Ether'), _WETH);

exports.FACTORY_ADDRESS = FACTORY_ADDRESS;
exports.INIT_CODE_HASH = INIT_CODE_HASH;
exports.QuantizedToken = QuantizedToken;
exports.WETH9 = WETH9;
exports.computeQuantizedAddress = computeQuantizedAddress;
exports.currencyEquals = currencyEquals;
exports.validateAndParseAddress = validateAndParseAddress;
//# sourceMappingURL=sdk-core.cjs.development.js.map
