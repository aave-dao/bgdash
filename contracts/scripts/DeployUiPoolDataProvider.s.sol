// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import {Script} from 'forge-std/Script.sol';
import {
  UiPoolDataProviderV3,
  AggregatorInterface
} from '../src/contracts/data-fetching/UiPoolDataProviderV3.sol';

abstract contract DeployAaveV3MarketBatchedBase is Script {
  function getNetworkBaseTokenPriceInUsdProxyAggregator() public pure virtual returns (address);
  function getMarketReferenceCurrencyPriceInUsdProxyAggregator()
    public
    pure
    virtual
    returns (address);

  function run() public {
    vm.startBroadcast();
    new UiPoolDataProviderV3(
      AggregatorInterface(getNetworkBaseTokenPriceInUsdProxyAggregator()),
      AggregatorInterface(getMarketReferenceCurrencyPriceInUsdProxyAggregator())
    );
    vm.stopBroadcast();
  }
}

// make deploy-ledger contract=scripts/DeployUiPoolDataProvider.s.sol:Ethereum chain=mainnet
// verify-command: npx catapulta-verify -b broadcast/DeployUiPoolDataProvider.s.sol/1/run-latest.json
contract Ethereum is DeployAaveV3MarketBatchedBase {
  function getNetworkBaseTokenPriceInUsdProxyAggregator() public pure override returns (address) {
    return 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;
  }
  function getMarketReferenceCurrencyPriceInUsdProxyAggregator()
    public
    pure
    override
    returns (address)
  {
    return 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;
  }
}

// make deploy-ledger contract=scripts/DeployUiPoolDataProvider.s.sol:Ethereum chain=mainnet
// verify-command: npx catapulta-verify -b broadcast/DeployUiPoolDataProvider.s.sol/1/run-latest.json
contract EthereumLido is DeployAaveV3MarketBatchedBase {
  function getNetworkBaseTokenPriceInUsdProxyAggregator() public pure override returns (address) {
    return 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;
  }
  function getMarketReferenceCurrencyPriceInUsdProxyAggregator()
    public
    pure
    override
    returns (address)
  {
    return 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;
  }
}

// make deploy-ledger contract=scripts/DeployUiPoolDataProvider.s.sol:EthereumSepolia chain=ethereum_sepolia
// verify-command: npx catapulta-verify -b broadcast/DeployUiPoolDataProvider.s.sol/1/run-latest.json
contract EthereumSepolia is DeployAaveV3MarketBatchedBase {
  function getNetworkBaseTokenPriceInUsdProxyAggregator() public pure override returns (address) {
    return 0x694AA1769357215DE4FAC081bf1f309aDC325306;
  }
  function getMarketReferenceCurrencyPriceInUsdProxyAggregator()
    public
    pure
    override
    returns (address)
  {
    return 0x694AA1769357215DE4FAC081bf1f309aDC325306;
  }
}

// make deploy-ledger contract=scripts/DeployUiPoolDataProvider.s.sol:Polygon chain=polygon
// verify-command: npx catapulta-verify -b broadcast/DeployUiPoolDataProvider.s.sol/137/run-latest.json
contract Polygon is DeployAaveV3MarketBatchedBase {
  function getNetworkBaseTokenPriceInUsdProxyAggregator() public pure override returns (address) {
    return 0xAB594600376Ec9fD91F8e885dADF0CE036862dE0;
  }
  function getMarketReferenceCurrencyPriceInUsdProxyAggregator()
    public
    pure
    override
    returns (address)
  {
    return 0xF9680D99D6C9589e2a93a78A04A279e509205945;
  }
}

// make deploy-ledger contract=scripts/DeployUiPoolDataProvider.s.sol:Avalanche chain=avalanche
// verify-command: npx catapulta-verify -b broadcast/DeployUiPoolDataProvider.s.sol/43114/run-latest.json
contract Avalanche is DeployAaveV3MarketBatchedBase {
  function getNetworkBaseTokenPriceInUsdProxyAggregator() public pure override returns (address) {
    return 0x0A77230d17318075983913bC2145DB16C7366156;
  }
  function getMarketReferenceCurrencyPriceInUsdProxyAggregator()
    public
    pure
    override
    returns (address)
  {
    return 0x976B3D034E162d8bD72D6b9C989d545b839003b0;
  }
}

// make deploy-ledger contract=scripts/DeployUiPoolDataProvider.s.sol:AvalancheFuji chain=avalanche_fuji
// verify-command: npx catapulta-verify -b broadcast/DeployUiPoolDataProvider.s.sol/43113/run-latest.json
contract AvalancheFuji is DeployAaveV3MarketBatchedBase {
  function getNetworkBaseTokenPriceInUsdProxyAggregator() public pure override returns (address) {
    return 0x5498BB86BC934c8D34FDA08E81D444153d0D06aD;
  }
  function getMarketReferenceCurrencyPriceInUsdProxyAggregator()
    public
    pure
    override
    returns (address)
  {
    return 0x5498BB86BC934c8D34FDA08E81D444153d0D06aD;
  }
}

// make deploy-ledger contract=scripts/DeployUiPoolDataProvider.s.sol:Binance chain=bnb
// verify-command: npx catapulta-verify -b broadcast/DeployUiPoolDataProvider.s.sol/56/run-latest.json
contract Binance is DeployAaveV3MarketBatchedBase {
  function getNetworkBaseTokenPriceInUsdProxyAggregator() public pure override returns (address) {
    return 0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE;
  }
  function getMarketReferenceCurrencyPriceInUsdProxyAggregator()
    public
    pure
    override
    returns (address)
  {
    return 0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e;
  }
}

// make deploy-ledger contract=scripts/DeployUiPoolDataProvider.s.sol:Gnosis chain=gnosis
// verify-command: npx catapulta-verify -b broadcast/DeployUiPoolDataProvider.s.sol/100/run-latest.json
contract Gnosis is DeployAaveV3MarketBatchedBase {
  function getNetworkBaseTokenPriceInUsdProxyAggregator() public pure override returns (address) {
    return 0x678df3415fc31947dA4324eC63212874be5a82f8;
  }
  function getMarketReferenceCurrencyPriceInUsdProxyAggregator()
    public
    pure
    override
    returns (address)
  {
    return 0xa767f745331D267c7751297D982b050c93985627;
  }
}

// make deploy-ledger contract=scripts/DeployUiPoolDataProvider.s.sol:Metis chain=metis
// verify-command: npx catapulta-verify -b broadcast/DeployUiPoolDataProvider.s.sol/1088/run-latest.json
contract Metis is DeployAaveV3MarketBatchedBase {
  function getNetworkBaseTokenPriceInUsdProxyAggregator() public pure override returns (address) {
    return 0xD4a5Bb03B5D66d9bf81507379302Ac2C2DFDFa6D;
  }
  function getMarketReferenceCurrencyPriceInUsdProxyAggregator()
    public
    pure
    override
    returns (address)
  {
    return 0x3BBe70e2F96c87aEce7F67A2b0178052f62E37fE;
  }
}

// make deploy-ledger contract=scripts/DeployUiPoolDataProvider.s.sol:Arbitrum chain=arbitrum
// verify-command: npx catapulta-verify -b broadcast/DeployUiPoolDataProvider.s.sol/42161/run-latest.json
contract Arbitrum is DeployAaveV3MarketBatchedBase {
  function getNetworkBaseTokenPriceInUsdProxyAggregator() public pure override returns (address) {
    return 0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612;
  }
  function getMarketReferenceCurrencyPriceInUsdProxyAggregator()
    public
    pure
    override
    returns (address)
  {
    return 0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612;
  }
}

// make deploy-ledger contract=scripts/DeployUiPoolDataProvider.s.sol:Optimism chain=optimism
// verify-command: npx catapulta-verify -b broadcast/DeployUiPoolDataProvider.s.sol/10/run-latest.json
contract Optimism is DeployAaveV3MarketBatchedBase {
  function getNetworkBaseTokenPriceInUsdProxyAggregator() public pure override returns (address) {
    return 0xA969bEB73d918f6100163Cd0fba3C586C269bee1;
  }
  function getMarketReferenceCurrencyPriceInUsdProxyAggregator()
    public
    pure
    override
    returns (address)
  {
    return 0xA969bEB73d918f6100163Cd0fba3C586C269bee1;
  }
}

// make deploy-ledger contract=scripts/DeployUiPoolDataProvider.s.sol:Base chain=base
// verify-command: npx catapulta-verify -b broadcast/DeployUiPoolDataProvider.s.sol/8453/run-latest.json
contract Base is DeployAaveV3MarketBatchedBase {
  function getNetworkBaseTokenPriceInUsdProxyAggregator() public pure override returns (address) {
    return 0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70;
  }
  function getMarketReferenceCurrencyPriceInUsdProxyAggregator()
    public
    pure
    override
    returns (address)
  {
    return 0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70;
  }
}

// make deploy-ledger contract=scripts/DeployUiPoolDataProvider.s.sol:BaseSepolia chain=base_sepolia
// verify-command: npx catapulta-verify -b broadcast/DeployUiPoolDataProvider.s.sol/8453/run-latest.json
contract BaseSepolia is DeployAaveV3MarketBatchedBase {
  function getNetworkBaseTokenPriceInUsdProxyAggregator() public pure override returns (address) {
    return 0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1;
  }
  function getMarketReferenceCurrencyPriceInUsdProxyAggregator()
    public
    pure
    override
    returns (address)
  {
    return 0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1;
  }
}

// make deploy-ledger contract=scripts/DeployUiPoolDataProvider.s.sol:Scroll chain=scroll
// verify-command: npx catapulta-verify -b broadcast/DeployUiPoolDataProvider.s.sol/534352/run-latest.json
contract Scroll is DeployAaveV3MarketBatchedBase {
  function getNetworkBaseTokenPriceInUsdProxyAggregator() public pure override returns (address) {
    return 0x6bF14CB0A831078629D993FDeBcB182b21A8774C;
  }
  function getMarketReferenceCurrencyPriceInUsdProxyAggregator()
    public
    pure
    override
    returns (address)
  {
    return 0x6bF14CB0A831078629D993FDeBcB182b21A8774C;
  }
}

// make deploy-pk contract=scripts/DeployUiPoolDataProvider.s.sol:Zksync chain=zksync
// verify-command: npx catapulta-verify -b broadcast/DeployUiPoolDataProvider.s.sol/324/run-latest.json
contract Zksync is DeployAaveV3MarketBatchedBase {
  function getNetworkBaseTokenPriceInUsdProxyAggregator() public pure override returns (address) {
    return 0x6D41d1dc818112880b40e26BD6FD347E41008eDA;
  }
  function getMarketReferenceCurrencyPriceInUsdProxyAggregator()
    public
    pure
    override
    returns (address)
  {
    return 0x6D41d1dc818112880b40e26BD6FD347E41008eDA;
  }
}

// make deploy-ledger contract=scripts/DeployUiPoolDataProvider.s.sol:Linea chain=linea
// verify-command: npx catapulta-verify -b broadcast/DeployUiPoolDataProvider.s.sol/59144/run-latest.json
contract Linea is DeployAaveV3MarketBatchedBase {
  function getNetworkBaseTokenPriceInUsdProxyAggregator() public pure override returns (address) {
    return 0x3c6Cd9Cc7c7a4c2Cf5a82734CD249D7D593354dA;
  }
  function getMarketReferenceCurrencyPriceInUsdProxyAggregator()
    public
    pure
    override
    returns (address)
  {
    return 0x3c6Cd9Cc7c7a4c2Cf5a82734CD249D7D593354dA;
  }
}

// make deploy-ledger contract=scripts/DeployUiPoolDataProvider.s.sol:Sonic chain=sonic
// verify-command: npx catapulta-verify -b broadcast/DeployUiPoolDataProvider.s.sol/146/run-latest.json
contract Sonic is DeployAaveV3MarketBatchedBase {
  function getNetworkBaseTokenPriceInUsdProxyAggregator() public pure override returns (address) {
    return 0xc76dFb89fF298145b417d221B2c747d84952e01d;
  }
  function getMarketReferenceCurrencyPriceInUsdProxyAggregator()
    public
    pure
    override
    returns (address)
  {
    return 0x824364077993847f71293B24ccA8567c00c2de11;
  }
}

// make deploy-ledger contract=scripts/DeployUiPoolDataProvider.s.sol:Mantle chain=mantle
// verify-command: npx catapulta-verify -b broadcast/DeployUiPoolDataProvider.s.sol/5000/run-latest.json
contract Mantle is DeployAaveV3MarketBatchedBase {
  function getNetworkBaseTokenPriceInUsdProxyAggregator() public pure override returns (address) {
    return 0xD97F20bEbeD74e8144134C4b148fE93417dd0F96;
  }
  function getMarketReferenceCurrencyPriceInUsdProxyAggregator()
    public
    pure
    override
    returns (address)
  {
    return 0x5bc7Cf88EB131DB18b5d7930e793095140799aD5;
  }
}

// make deploy-ledger contract=scripts/DeployUiPoolDataProvider.s.sol:Celo chain=celo
// verify-command: npx catapulta-verify -b broadcast/DeployUiPoolDataProvider.s.sol/42220/run-latest.json
contract Celo is DeployAaveV3MarketBatchedBase {
  function getNetworkBaseTokenPriceInUsdProxyAggregator() public pure override returns (address) {
    return 0x0568fD19986748cEfF3301e55c0eb1E729E0Ab7e;
  }
  function getMarketReferenceCurrencyPriceInUsdProxyAggregator()
    public
    pure
    override
    returns (address)
  {
    return 0x1FcD30A73D67639c1cD89ff5746E7585731c083B;
  }
}

// make deploy-ledger contract=scripts/DeployUiPoolDataProvider.s.sol:Ink chain=ink
// verify-command: npx catapulta-verify -b broadcast/DeployUiPoolDataProvider.s.sol/57073/run-latest.json
contract Ink is DeployAaveV3MarketBatchedBase {
  function getNetworkBaseTokenPriceInUsdProxyAggregator() public pure override returns (address) {
    return 0x163131609562E578754aF12E998635BfCa56712C;
  }
  function getMarketReferenceCurrencyPriceInUsdProxyAggregator()
    public
    pure
    override
    returns (address)
  {
    return 0x163131609562E578754aF12E998635BfCa56712C;
  }
}

// make deploy-ledger contract=scripts/DeployUiPoolDataProvider.s.sol:Plasma chain=plasma
// verify-command: npx catapulta-verify -b broadcast/DeployUiPoolDataProvider.s.sol/57073/run-latest.json
contract Plasma is DeployAaveV3MarketBatchedBase {
  function getNetworkBaseTokenPriceInUsdProxyAggregator() public pure override returns (address) {
    return 0xF932477C37715aE6657Ab884414Bd9876FE3f750;
  }
  function getMarketReferenceCurrencyPriceInUsdProxyAggregator()
    public
    pure
    override
    returns (address)
  {
    return 0x43A7dd2125266c5c4c26EB86cd61241132426Fe7;
  }
}

// make deploy-ledger contract=scripts/DeployUiPoolDataProvider.s.sol:Xlayer chain=xlayer
// verify-command: npx catapulta-verify -b broadcast/DeployUiPoolDataProvider.s.sol/196/run-latest.json
contract Xlayer is DeployAaveV3MarketBatchedBase {
  function getNetworkBaseTokenPriceInUsdProxyAggregator() public pure override returns (address) {
    return 0x4Ff345b18a2bF894F8627F41501FBf30d5C5e7BE;
  }
  function getMarketReferenceCurrencyPriceInUsdProxyAggregator()
    public
    pure
    override
    returns (address)
  {
    return 0x8b85b50535551F8E8cDAF78dA235b5Cf1005907b;
  }
}

// make deploy-ledger contract=scripts/DeployUiPoolDataProvider.s.sol:Megaeth chain=megaeth
// verify-command: npx catapulta-verify -b broadcast/DeployUiPoolDataProvider.s.sol/4326/run-latest.json
contract Megaeth is DeployAaveV3MarketBatchedBase {
  function getNetworkBaseTokenPriceInUsdProxyAggregator() public pure override returns (address) {
    return 0xcA4e254D95637DE95E2a2F79244b03380d697feD;
  }
  function getMarketReferenceCurrencyPriceInUsdProxyAggregator()
    public
    pure
    override
    returns (address)
  {
    return 0xcA4e254D95637DE95E2a2F79244b03380d697feD;
  }
}
