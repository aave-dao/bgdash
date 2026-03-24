// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.10;

import {IERC20Detailed} from 'aave-v3-origin/contracts/dependencies/openzeppelin/contracts/IERC20Detailed.sol';
import {IPoolAddressesProvider} from 'aave-v3-origin/contracts/interfaces/IPoolAddressesProvider.sol';
import {IPool} from 'aave-v3-origin/contracts/interfaces/IPool.sol';
import {IAaveOracle} from 'aave-v3-origin/contracts/interfaces/IAaveOracle.sol';
import {IAToken} from 'aave-v3-origin/contracts/interfaces/IAToken.sol';
import {IVariableDebtToken} from 'aave-v3-origin/contracts/interfaces/IVariableDebtToken.sol';
import {IDefaultInterestRateStrategyV2} from 'aave-v3-origin/contracts/interfaces/IDefaultInterestRateStrategyV2.sol';
import {IPoolConfigurator} from 'aave-v3-origin/contracts/interfaces/IPoolConfigurator.sol';
import {IPoolDataProvider} from 'aave-v3-origin/contracts/interfaces/IPoolDataProvider.sol';
import {AaveProtocolDataProvider} from 'aave-v3-origin/contracts/helpers/AaveProtocolDataProvider.sol';
import {WadRayMath} from 'aave-v3-origin/contracts/protocol/libraries/math/WadRayMath.sol';
import {ReserveConfiguration} from 'aave-v3-origin/contracts/protocol/libraries/configuration/ReserveConfiguration.sol';
import {UserConfiguration} from 'aave-v3-origin/contracts/protocol/libraries/configuration/UserConfiguration.sol';
import {DataTypes} from 'aave-v3-origin/contracts/protocol/libraries/types/DataTypes.sol';
import {AggregatorInterface} from 'aave-v3-origin/contracts/dependencies/chainlink/AggregatorInterface.sol';
import {IERC20DetailedBytes} from 'aave-v3-origin/contracts/helpers/interfaces/IERC20DetailedBytes.sol';
import {IUiPoolDataProviderV3} from './IUiPoolDataProviderV3.sol';

contract UiPoolDataProviderV3 is IUiPoolDataProviderV3 {
  using WadRayMath for uint256;
  using ReserveConfiguration for DataTypes.ReserveConfigurationMap;
  using UserConfiguration for DataTypes.UserConfigurationMap;

  AggregatorInterface public immutable networkBaseTokenPriceInUsdProxyAggregator;
  AggregatorInterface public immutable marketReferenceCurrencyPriceInUsdProxyAggregator;
  uint256 public constant ETH_CURRENCY_UNIT = 1 ether;
  address public constant MKR_ADDRESS = 0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2;

  constructor(
    AggregatorInterface _networkBaseTokenPriceInUsdProxyAggregator,
    AggregatorInterface _marketReferenceCurrencyPriceInUsdProxyAggregator
  ) {
    networkBaseTokenPriceInUsdProxyAggregator = _networkBaseTokenPriceInUsdProxyAggregator;
    marketReferenceCurrencyPriceInUsdProxyAggregator = _marketReferenceCurrencyPriceInUsdProxyAggregator;
  }

  function getReservesList(
    IPoolAddressesProvider provider
  ) external view override returns (address[] memory) {
    IPool pool = IPool(provider.getPool());
    return pool.getReservesList();
  }

  function getReserveData(
    IPoolDataProvider poolDataProvider,
    IAaveOracle oracle,
    IPool pool,
    IPoolConfigurator poolConfigurator,
    address reserve
  ) public view returns (AggregatedReserveData memory) {
    AggregatedReserveData memory reserveData;
    reserveData.underlyingAsset = reserve;
    // reserve current state
    DataTypes.ReserveDataLegacy memory baseData = pool.getReserveData(
      reserveData.underlyingAsset
    );
    //the id of the reserve. Represents the position in the list of the active reserves
    reserveData.id = baseData.id;
    //the liquidity index. Expressed in ray
    reserveData.liquidityIndex = baseData.liquidityIndex;
    //variable borrow index. Expressed in ray
    reserveData.variableBorrowIndex = baseData.variableBorrowIndex;
    //the current supply rate. Expressed in ray
    reserveData.liquidityRate = baseData.currentLiquidityRate;
    //the current variable borrow rate. Expressed in ray
    reserveData.variableBorrowRate = baseData.currentVariableBorrowRate;
    reserveData.lastUpdateTimestamp = baseData.lastUpdateTimestamp;
    reserveData.aTokenAddress = baseData.aTokenAddress;
    reserveData.variableDebtTokenAddress = baseData.variableDebtTokenAddress;
    //address of the interest rate strategy
    reserveData.interestRateStrategyAddress = baseData.interestRateStrategyAddress;
    reserveData.priceInMarketReferenceCurrency = oracle.getAssetPrice(reserveData.underlyingAsset);
    reserveData.priceOracle = oracle.getSourceOfAsset(reserveData.underlyingAsset);
    reserveData.availableLiquidity = IERC20Detailed(reserveData.underlyingAsset).balanceOf(
      reserveData.aTokenAddress
    );
    reserveData.totalScaledATokenSupply = IVariableDebtToken(reserveData.aTokenAddress)
      .scaledTotalSupply();
    reserveData.totalScaledVariableDebt = IVariableDebtToken(reserveData.variableDebtTokenAddress)
      .scaledTotalSupply();

    // Due we take the symbol from underlying token we need a special case for $MKR as symbol() returns bytes32
    if (address(reserveData.underlyingAsset) == address(MKR_ADDRESS)) {
      bytes32 symbol = IERC20DetailedBytes(reserveData.underlyingAsset).symbol();
      bytes32 name = IERC20DetailedBytes(reserveData.underlyingAsset).name();
      reserveData.symbol = bytes32ToString(symbol);
      reserveData.name = bytes32ToString(name);
    } else {
      reserveData.symbol = IERC20Detailed(reserveData.underlyingAsset).symbol();
      reserveData.name = IERC20Detailed(reserveData.underlyingAsset).name();
    }

    //stores the reserve configuration
    DataTypes.ReserveConfigurationMap memory reserveConfigurationMap = baseData.configuration;
    (
      reserveData.baseLTVasCollateral,
      reserveData.reserveLiquidationThreshold,
      reserveData.reserveLiquidationBonus,
      reserveData.decimals,
      reserveData.reserveFactor
    ) = reserveConfigurationMap.getParams();
    reserveData.usageAsCollateralEnabled = reserveData.baseLTVasCollateral != 0;

    (
      reserveData.isActive,
      reserveData.isFrozen,
      reserveData.borrowingEnabled,
      reserveData.isPaused
    ) = reserveConfigurationMap.getFlags();

    // interest rates
    try
      IDefaultInterestRateStrategyV2(reserveData.interestRateStrategyAddress).getInterestRateData(
        reserveData.underlyingAsset
      )
    returns (IDefaultInterestRateStrategyV2.InterestRateDataRay memory res) {
      reserveData.baseVariableBorrowRate = res.baseVariableBorrowRate;
      reserveData.variableRateSlope1 = res.variableRateSlope1;
      reserveData.variableRateSlope2 = res.variableRateSlope2;
      reserveData.optimalUsageRatio = res.optimalUsageRatio;
    } catch {}

    // v3 only
    reserveData.debtCeiling = reserveConfigurationMap.getDebtCeiling();
    reserveData.debtCeilingDecimals = poolDataProvider.getDebtCeilingDecimals();
    (reserveData.borrowCap, reserveData.supplyCap) = reserveConfigurationMap.getCaps();

    reserveData.flashLoanEnabled = reserveConfigurationMap.getFlashLoanEnabled();
    reserveData.isSiloedBorrowing = reserveConfigurationMap.getSiloedBorrowing();
    reserveData.unbacked = baseData.unbacked;
    reserveData.isolationModeTotalDebt = baseData.isolationModeTotalDebt;
    reserveData.accruedToTreasury = baseData.accruedToTreasury;

    reserveData.borrowableInIsolation = reserveConfigurationMap.getBorrowableInIsolation();

    reserveData.virtualAccActive = true;
    reserveData.virtualUnderlyingBalance = pool.getVirtualUnderlyingBalance(reserve);

    reserveData.liquidationGracePeriodUntil = pool.getLiquidationGracePeriod(reserve);
    if (reserveData.isPaused) {
      reserveData.pendingLtv = poolConfigurator.getPendingLtv(reserve);
    }
    reserveData.deficit = uint128(pool.getReserveDeficit(reserveData.underlyingAsset));

    return reserveData;
  }

  function getReservesData(
    IPoolAddressesProvider provider
  ) public view returns (AggregatedReserveData[] memory, BaseCurrencyInfo memory) {
    IAaveOracle oracle = IAaveOracle(provider.getPriceOracle());
    IPool pool = IPool(provider.getPool());
    IPoolConfigurator poolConfigurator = IPoolConfigurator(provider.getPoolConfigurator());
    IPoolDataProvider poolDataProvider = IPoolDataProvider(provider.getPoolDataProvider());
    return getReservesData(oracle, pool, poolDataProvider, poolConfigurator);
  }

  function getReservesData(
    IAaveOracle oracle,
    IPool pool,
    IPoolDataProvider poolDataProvider,
    IPoolConfigurator poolConfigurator
  ) public view returns (AggregatedReserveData[] memory, BaseCurrencyInfo memory) {
    address[] memory reserves = pool.getReservesList();
    AggregatedReserveData[] memory reservesData = new AggregatedReserveData[](reserves.length);
    for (uint256 i = 0; i < reserves.length; i++) {
      reservesData[i] = getReserveData(
        poolDataProvider,
        oracle,
        pool,
        poolConfigurator,
        reserves[i]
      );
    }

    BaseCurrencyInfo memory baseCurrencyInfo;
    baseCurrencyInfo.networkBaseTokenPriceInUsd = networkBaseTokenPriceInUsdProxyAggregator
      .latestAnswer();
    baseCurrencyInfo.networkBaseTokenPriceDecimals = networkBaseTokenPriceInUsdProxyAggregator
      .decimals();

    try oracle.BASE_CURRENCY_UNIT() returns (uint256 baseCurrencyUnit) {
      baseCurrencyInfo.marketReferenceCurrencyUnit = baseCurrencyUnit;
      baseCurrencyInfo.marketReferenceCurrencyPriceInUsd = int256(baseCurrencyUnit);
    } catch (bytes memory /*lowLevelData*/) {
      baseCurrencyInfo.marketReferenceCurrencyUnit = ETH_CURRENCY_UNIT;
      baseCurrencyInfo
        .marketReferenceCurrencyPriceInUsd = marketReferenceCurrencyPriceInUsdProxyAggregator
        .latestAnswer();
    }

    return (reservesData, baseCurrencyInfo);
  }

  /// @inheritdoc IUiPoolDataProviderV3
  function getEModes(IPoolAddressesProvider provider) external view returns (Emode[] memory) {
    IPool pool = IPool(provider.getPool());
    Emode[] memory tempCategories = new Emode[](256);
    uint8 eModesFound = 0;
    uint8 missCounter = 0;
    for (uint8 i = 1; i < 256; i++) {
      DataTypes.CollateralConfig memory cfg = pool.getEModeCategoryCollateralConfig(i);
      if (cfg.liquidationThreshold != 0) {
        tempCategories[eModesFound] = Emode({
          eMode: DataTypes.EModeCategory({
            ltv: cfg.ltv,
            liquidationThreshold: cfg.liquidationThreshold,
            liquidationBonus: cfg.liquidationBonus,
            collateralBitmap: pool.getEModeCategoryCollateralBitmap(i),
            label: pool.getEModeCategoryLabel(i),
            borrowableBitmap: pool.getEModeCategoryBorrowableBitmap(i),
            ltvzeroBitmap: pool.getEModeCategoryLtvzeroBitmap(i)
          }),
          id: i
        });
        ++eModesFound;
        missCounter = 0;
      } else {
        ++missCounter;
      }
      // assumes there will never be a gap > 2 when setting eModes
      if (missCounter > 2) break;
    }
    Emode[] memory categories = new Emode[](eModesFound);
    for (uint8 i = 0; i < eModesFound; i++) {
      categories[i] = tempCategories[i];
    }
    return categories;
  }

  function getUserReserveData(
    IPool pool,
    address user,
    address reserve
  ) public view returns (UserReserveData memory) {
    address[] memory reserves = pool.getReservesList();
    DataTypes.UserConfigurationMap memory userConfig = pool.getUserConfiguration(user);
    for (uint256 i = 0; i < reserves.length; i++) {
      if (reserve == reserves[i]) {
        return getUserReserveData(pool, user, userConfig, reserve, i);
      }
    }
    revert('Reserve does not exist');
  }

  function getUserReserveData(
    IPool pool,
    address user,
    DataTypes.UserConfigurationMap memory userConfig,
    address reserve,
    uint256 reserveIndex
  ) public view returns (UserReserveData memory) {
    UserReserveData memory userReserveData;
    DataTypes.ReserveDataLegacy memory baseData = pool.getReserveData(reserve);

    // user reserve data
    userReserveData.underlyingAsset = reserve;
    userReserveData.scaledATokenBalance = IAToken(baseData.aTokenAddress).scaledBalanceOf(user);
    userReserveData.usageAsCollateralEnabledOnUser = userConfig.isUsingAsCollateral(reserveIndex);

    if (userConfig.isBorrowing(reserveIndex)) {
      userReserveData.scaledVariableDebt = IVariableDebtToken(baseData.variableDebtTokenAddress)
        .scaledBalanceOf(user);
    }

    return userReserveData;
  }

  function getUserReservesData(
    IPoolAddressesProvider provider,
    address user
  ) external view returns (UserReserveData[] memory, uint8) {
    IPool pool = IPool(provider.getPool());
    address[] memory reserves = pool.getReservesList();
    DataTypes.UserConfigurationMap memory userConfig = pool.getUserConfiguration(user);

    uint8 userEmodeCategoryId = uint8(pool.getUserEMode(user));

    UserReserveData[] memory userReservesData = new UserReserveData[](
      user != address(0) ? reserves.length : 0
    );

    for (uint256 i = 0; i < reserves.length; i++) {
      userReservesData[i] = getUserReserveData(pool, user, userConfig, reserves[i], i);
    }

    return (userReservesData, userEmodeCategoryId);
  }

  function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
    uint8 i = 0;
    while (i < 32 && _bytes32[i] != 0) {
      i++;
    }
    bytes memory bytesArray = new bytes(i);
    for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
      bytesArray[i] = _bytes32[i];
    }
    return string(bytesArray);
  }
}
