import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { ReservePool } from '../constants';
import { EmodeColumnKeys } from '../helpers/eModeTableHelpers';
import { formatEmodeAPIData } from '../helpers/formatEmodesData';
import { customEmodesSorting, sortItems } from '../helpers/sorting';
import { updateUrlParams } from '../helpers/tableHelpers';
import { RouterOutputs } from '../providers/TRPCReactProvider';
import {
  Emode,
  FilterOption,
  SortConfig,
  SortDirection,
  StoreSlice,
} from '../types';
import { IReserveSlice } from './reservesSlice';
import { filteredEmodes, getEmodesFiltersOptions } from './utils';

export type EmodesSelectedFilters = {
  emodeChainId: string[];
  emodePool: ReservePool[];
  collateralAssets: string[];
  borrowableAssets: string[];
};

export interface IEModesSlice {
  initialEmodes: Emode[];
  sortedFilteredEmodes: Emode[];

  emodesSortConfig: SortConfig;
  setEmodesSortConfig: ({
    key,
    direction,
    router,
  }: {
    key: EmodeColumnKeys | null;
    direction?: SortDirection;
    router?: AppRouterInstance;
  }) => void;

  emodesAreLoading: boolean;
  fillEmodes: (
    requestedEmodes: RouterOutputs['emodes']['getAll'],
    router?: AppRouterInstance,
  ) => void;

  emodesSelectedFilters: EmodesSelectedFilters;
  emodesFilterOptions: {
    emodeChainId: FilterOption[];
    emodePool: FilterOption[];
    collateralAssets: FilterOption[];
    borrowableAssets: FilterOption[];
  };

  emodesSetFilters: ({
    router,
    key,
    values,
  }: {
    router?: AppRouterInstance;
    key: string;
    values: string[];
  }) => void;
  emodesSetFilterOptions: () => void;

  emodesSetSelectedFiltersToQuery: ({
    router,
    pathName,
    additionalParams,
    fromEmpty,
  }: {
    router?: AppRouterInstance;
    pathName?: string;
    additionalParams?: Record<string, string[]>;
    fromEmpty?: boolean;
  }) => void;
}

export const createEmodesSlice: StoreSlice<IEModesSlice, IReserveSlice> = (
  set,
  get,
) => ({
  initialEmodes: [],
  sortedFilteredEmodes: [],

  emodesSortConfig: {
    key: null,
    direction: SortDirection.Ascending,
  },
  setEmodesSortConfig: ({ key, direction, router }) => {
    const { emodesSortConfig } = get();
    const directionLocal =
      direction ??
      (emodesSortConfig.key === key &&
      emodesSortConfig.direction === SortDirection.Descending
        ? SortDirection.Ascending
        : SortDirection.Descending);
    set({ emodesSortConfig: { key, direction: directionLocal } });
    const sortedItems = sortItems(
      get().sortedFilteredEmodes,
      { key, direction: directionLocal },
      customEmodesSorting,
    );
    set({ sortedFilteredEmodes: sortedItems });
    if (router) {
      updateUrlParams(router, {
        emodesSortConfig: [key ?? '', directionLocal],
      });
    }
  },

  emodesAreLoading: false,
  fillEmodes: (requestedEmodes, router) => {
    const reserves = get().initialReserves;
    if (reserves.length === 0) throw new Error('Reserves empty');
    set({ emodesAreLoading: true });

    const emodes = requestedEmodes.map((emode) =>
      formatEmodeAPIData({ emode, reserves }),
    );
    set({ initialEmodes: emodes });
    get().emodesSetFilterOptions();

    if (router) {
      // initialize filters from query
      const search = window.location.search.substr(1);
      const queryParams = new URLSearchParams(search);
      for (const [key, value] of queryParams.entries()) {
        if (value) {
          const values = value.split(',');
          get().emodesSetFilters({
            key,
            values,
          });
        }
      }
    }

    set({
      sortedFilteredEmodes: sortItems(
        filteredEmodes(emodes, get().emodesSelectedFilters),
        get().emodesSortConfig,
        customEmodesSorting,
      ),
      emodesAreLoading: false,
    });

    get().emodesSetSelectedFiltersToQuery({ router });
  },

  emodesSelectedFilters: {
    emodeChainId: [],
    emodePool: [],
    collateralAssets: [],
    borrowableAssets: [],
  },
  emodesFilterOptions: {
    emodeChainId: [],
    emodePool: [],
    collateralAssets: [],
    borrowableAssets: [],
  },

  emodesSetFilters: ({ router, key, values }) => {
    const selectedValues = Array.from(new Set(values));
    set((state) => ({
      emodesSelectedFilters: {
        ...state.emodesSelectedFilters,
        [key]: selectedValues,
      },
    }));
    set({
      sortedFilteredEmodes: sortItems(
        filteredEmodes(get().initialEmodes, get().emodesSelectedFilters),
        get().emodesSortConfig,
        customEmodesSorting,
      ),
    });
    get().emodesSetSelectedFiltersToQuery({ router });
  },

  emodesSetFilterOptions: () => {
    const { emodeChainId, emodePool, collateralAssets, borrowableAssets } =
      getEmodesFiltersOptions(get().initialEmodes);
    set(() => ({
      emodesFilterOptions: {
        emodeChainId,
        emodePool,
        collateralAssets,
        borrowableAssets,
      },
      emodesSelectedFilters: {
        emodeChainId: emodeChainId.map((emode) => emode.id),
        emodePool: emodePool.map((emode) => emode.id as ReservePool),
        collateralAssets: [],
        borrowableAssets: [],
      },
    }));
  },

  emodesSetSelectedFiltersToQuery: ({
    router,
    pathName,
    additionalParams,
    fromEmpty,
  }) => {
    const { emodeChainId, emodePool, collateralAssets, borrowableAssets } =
      get().emodesSelectedFilters;

    if (router) {
      updateUrlParams(
        router,
        {
          emodeChainId,
          emodePool,
          collateralAssets,
          borrowableAssets,
          ...additionalParams,
        },
        pathName,
        fromEmpty,
      );
    }
  },
});
