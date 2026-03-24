import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { ReservePool, ReserveVersion } from '../constants';
import {
  assetsPresets,
  chainIdsPresets,
  fieldsPresets,
  GlobalPresets,
  globalPresets,
  initialColumns,
  PresetType,
} from '../helpers/presetsHelpers';
import { customReservesSorting, sortItems } from '../helpers/sorting';
import { ColumnKeys, columns, updateUrlParams } from '../helpers/tableHelpers';
import {
  getUserGlobalPresets,
  removeUserGlobalPreset,
  setUserGlobalPresets,
} from '../localStorage';
import { api } from '../trpc/client';
import {
  FilterOption,
  ReserveItem,
  SortConfig,
  SortDirection,
  StoreSlice,
} from '../types';
import { IEModesSlice } from './emodesSlice';
import { filteredReserves, getReservesFiltersOptions } from './utils';

export type ReservesSelectedFilters = {
  version: ReserveVersion[];
  pool: ReservePool[];
  chainId: string[];
  symbol: string[];
  columns: Array<{ key: ColumnKeys; label: string }>;
};

export interface IReserveSlice {
  initialReserves: ReserveItem[];
  sortedFilteredReserves: ReserveItem[];

  reservesAreLoading: boolean;
  fillReserves: (
    requestedReserves: ReserveItem[],
    router?: AppRouterInstance,
  ) => void;

  reservesDataInterval: number | undefined;
  startReservesDataPolling: () => Promise<void>;
  stopReservesDataPolling: () => void;

  sortConfig: SortConfig;
  setSortConfig: ({
    key,
    direction,
    router,
  }: {
    key: ColumnKeys | null;
    direction?: SortDirection;
    router?: AppRouterInstance;
  }) => void;

  selectedFilters: ReservesSelectedFilters;
  filterOptions: {
    version: FilterOption[];
    pool: FilterOption[];
    chainId: FilterOption[];
    symbol: FilterOption[];
    fields: FilterOption[];
  };
  setFilters: ({
    router,
    key,
    values,
    withDataRefresh,
  }: {
    router?: AppRouterInstance;
    key: string;
    values: string[];
    withDataRefresh?: boolean;
  }) => void;
  setFilterOptions: (router?: AppRouterInstance) => void;
  setSelectedFiltersToQuery: ({
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

  initSelectedColumns: (router?: AppRouterInstance) => void;

  fieldsPresets: Record<string, string[]>;
  initFieldsPreset: () => void;

  assetsPresets: Record<string, string[]>;
  initAssetsPreset: () => void;

  chainIdsPresets: Record<string, string[]>;
  initChainIdsPreset: () => void;

  globalPresets: GlobalPresets;
  initGlobalPreset: () => void;
  addGlobalPreset: (presetName: PresetType | string) => void;
  removeGlobalPreset: (presetName: PresetType | string) => void;
  renameGlobalPreset: (presetName: PresetType | string) => void;
}

export const createReservesSlice: StoreSlice<
  IReserveSlice,
  IEModesSlice
> = (set, get) => ({
  initialReserves: [],
  sortedFilteredReserves: [],

  reservesAreLoading: false,
  fillReserves: (requestedReserves, router) => {
    if (router) {
      set({ reservesAreLoading: true });
      get().initSelectedColumns(router);
    }
    const reserves = requestedReserves.sort(
      (a, b) => +b.version.split('v').join('') - +a.version.split('v').join(''),
    );
    set({ initialReserves: reserves });
    get().setFilterOptions(router);
    // initialize filters from query
    if (router) {
      const search = window.location.search.substr(1);
      const queryParams = new URLSearchParams(search);
      for (const [key, value] of queryParams.entries()) {
        if (value) {
          const values = value.split(',');
          if (key === 'fields') {
            get().setFilters({
              key: 'columns',
              values,
            });
          } else {
            get().setFilters({
              key,
              values,
            });
          }
        }
      }
    }

    set({
      sortedFilteredReserves: sortItems(
        filteredReserves(reserves, get().selectedFilters),
        get().sortConfig,
        customReservesSorting,
        get().initialEmodes,
      ),
      reservesAreLoading: false,
    });
    get().setSelectedFiltersToQuery({ router });
  },

  reservesDataInterval: undefined,
  startReservesDataPolling: async () => {
    const currentInterval = get().reservesDataInterval;
    clearInterval(currentInterval);
    const interval = setInterval(async () => {
      const requestedReserves = await api.reserves.getAll.query({});
      get().fillReserves(requestedReserves);
    }, 60 * 1010);
    set({ reservesDataInterval: Number(interval) });
  },
  stopReservesDataPolling: () => {
    const interval = get().reservesDataInterval;
    if (interval) {
      clearInterval(interval);
      set({ reservesDataInterval: undefined });
    }
  },

  sortConfig: {
    key: null,
    direction: SortDirection.Ascending,
  },
  setSortConfig: ({ key, direction, router }) => {
    const { sortConfig } = get();
    const directionLocal =
      direction ??
      (sortConfig.key === key &&
      sortConfig.direction === SortDirection.Descending
        ? SortDirection.Ascending
        : SortDirection.Descending);
    set({ sortConfig: { key, direction: directionLocal } });
    const sortedItems = sortItems(
      get().sortedFilteredReserves,
      { key, direction: directionLocal },
      customReservesSorting,
      get().initialEmodes,
    );
    set({ sortedFilteredReserves: sortedItems });
    if (router) {
      updateUrlParams(router, {
        sortConfig: [key ?? '', directionLocal],
      });
    }
  },

  selectedFilters: {
    chainId: [],
    version: [],
    symbol: [],
    pool: [],
    columns: [],
  },
  filterOptions: {
    chainId: [],
    version: [],
    symbol: [],
    pool: [],
    fields: [],
  },

  setFilters: ({ router, key, values, withDataRefresh }) => {
    const selectedValues = Array.from(new Set(values));
    if (key === 'columns') {
      set((state) => ({
        selectedFilters: {
          ...state.selectedFilters,
          [key]: columns.filter((column) =>
            selectedValues.includes(column.key),
          ),
        },
      }));
      if (withDataRefresh && router) {
        set({ sortConfig: { key: null, direction: SortDirection.Ascending } });
        const sortedItems = sortItems(
          get().initialReserves,
          get().sortConfig,
          customReservesSorting,
          get().initialEmodes,
        );
        set({ sortedFilteredReserves: sortedItems });
        updateUrlParams(router, { sortConfig: ['', ''] });
      }
    } else {
      set((state) => ({
        selectedFilters: { ...state.selectedFilters, [key]: selectedValues },
      }));
    }

    set({
      sortedFilteredReserves: sortItems(
        filteredReserves(get().initialReserves, get().selectedFilters),
        get().sortConfig,
        customReservesSorting,
        get().initialEmodes,
      ),
    });
    get().setSelectedFiltersToQuery({ router });
  },

  setFilterOptions: (router) => {
    const { chainIds, versions, pools, assets } = getReservesFiltersOptions(
      get().initialReserves,
    );
    set(() => ({
      filterOptions: {
        chainId: chainIds,
        version: versions,
        symbol: assets,
        pool: pools,
        fields: columns.map((column) => {
          return { id: column.key, label: column.label };
        }),
      },
    }));
    if (router) {
      set(() => ({
        selectedFilters: {
          chainId: globalPresets.Default.chainIds,
          version: globalPresets.Default.version,
          symbol: globalPresets.Default.assets,
          pool: globalPresets.Default.pool,
          columns: columns.filter((column) =>
            globalPresets.Default.fields.includes(column.key),
          ),
        },
      }));
    }
  },

  setSelectedFiltersToQuery: ({
    router,
    pathName,
    additionalParams,
    fromEmpty,
  }) => {
    const { chainId, version, symbol, pool, columns } = get().selectedFilters;

    if (!columns.length) {
      get().setFilters({
        key: 'columns',
        values: globalPresets.Empty.fields,
      });
    }

    // adding selected filters to the URL
    if (router) {
      updateUrlParams(
        router,
        {
          chainId,
          version,
          symbol,
          pool,
          fields: columns.map((column) => column.key),
          ...additionalParams,
        },
        pathName,
        fromEmpty,
      );
    }
  },

  initSelectedColumns: (router) => {
    let selectedFields: string[] = [];
    const search = window.location.search.substr(1);
    const queryParams = new URLSearchParams(search);
    for (const [key, value] of queryParams.entries()) {
      if (value) {
        const values = value.split(',');
        if (key === 'fields') {
          selectedFields = values;
        }
      }
    }
    if (selectedFields.length === 0) {
      if (router) {
        updateUrlParams(router, {
          fields: initialColumns.map((column) => column.key),
        });
      }
      set({
        selectedFilters: {
          ...get().selectedFilters,
          columns: initialColumns,
        },
      });
      return;
    }
    const newSelectedColumns = columns.filter((column) =>
      selectedFields.includes(column.key),
    );

    if (router) {
      updateUrlParams(router, {
        fields: newSelectedColumns.map((column) => column.key),
      });
    }

    set({
      selectedFilters: {
        ...get().selectedFilters,
        columns: newSelectedColumns,
      },
    });
  },

  fieldsPresets: {},
  initFieldsPreset: () => {
    set(() => {
      const presets = { ...fieldsPresets };
      return { fieldsPresets: presets };
    });
  },

  assetsPresets: {},
  initAssetsPreset: () => {
    set(() => {
      const presets = { ...assetsPresets };
      return { assetsPresets: presets };
    });
  },

  chainIdsPresets: {},
  initChainIdsPreset: () => {
    set(() => {
      const presets = { ...chainIdsPresets };
      return { chainIdsPresets: presets };
    });
  },

  globalPresets: {},
  initGlobalPreset: () => {
    const userGlobalPresets = getUserGlobalPresets();
    // merge default presets with user presets
    set((state) => {
      const presets = {
        ...state.globalPresets,
        ...userGlobalPresets,
        ...globalPresets,
      };
      return { globalPresets: presets };
    });
  },

  addGlobalPreset: (presetName) => {
    set((state) => {
      const newPreset = {
        [presetName]: {
          assets: get().selectedFilters.symbol,
          fields: get().selectedFilters.columns.map((column) => column.key),
          chainIds: get().selectedFilters.chainId,
          version: get().selectedFilters.version,
          pool: get().selectedFilters.pool,
          sortConfig: get().sortConfig,
        },
      };
      const updatedPresets = { ...state.globalPresets, ...newPreset };
      setUserGlobalPresets(updatedPresets);
      return { globalPresets: updatedPresets };
    });
  },

  removeGlobalPreset: (presetName) => {
    set((state) => {
      const updatedPresets = { ...state.globalPresets };
      delete updatedPresets[presetName];
      return { globalPresets: updatedPresets };
    });
    removeUserGlobalPreset(presetName);
  },

  renameGlobalPreset: (presetName) => {
    get().removeGlobalPreset(presetName);
    get().addGlobalPreset(presetName);
  },
});
