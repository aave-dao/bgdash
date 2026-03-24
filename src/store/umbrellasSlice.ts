import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { updateUrlParams } from '../helpers/tableHelpers';
import {
  UmbrellaColumnKeys,
  umbrellaColumns,
} from '../helpers/umbrellaTableHelpers';
import { StoreSlice, UmbrellaMarket } from '../types';

export type UmbrellaSelectedFilters = {
  columns: Array<{ key: UmbrellaColumnKeys; label: string }>;
};

export interface IUmbrellasSlice {
  initialUmbrellas: (UmbrellaMarket | null)[];
  umbrellasAreLoading: boolean;
  fillUmbrellas: (requestedUmbrellas: (UmbrellaMarket | null)[]) => void;

  umbrellaSelectedFilters: UmbrellaSelectedFilters;
  umbrellaFilterOptions: {
    fields: Array<{ id: string; label: string }>;
  };
  setUmbrellaFilters: ({
    router,
    key,
    values,
  }: {
    router?: AppRouterInstance;
    key: string;
    values: string[];
  }) => void;
  setUmbrellaFilterOptions: () => void;
  initUmbrellaSelectedColumns: (router?: AppRouterInstance) => void;
  setUmbrellaSelectedFiltersToQuery: ({
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

const initialUmbrellaColumns = umbrellaColumns;

export const createUmbrellasSlice: StoreSlice<IUmbrellasSlice> = (
  set,
  get,
) => ({
  initialUmbrellas: [],
  umbrellasAreLoading: true,
  fillUmbrellas: (requestedUmbrellas) => {
    set({ umbrellasAreLoading: true });
    set({
      initialUmbrellas: requestedUmbrellas,
      umbrellasAreLoading: false,
    });
  },

  umbrellaSelectedFilters: {
    columns: initialUmbrellaColumns,
  },
  umbrellaFilterOptions: {
    fields: [],
  },

  setUmbrellaFilters: ({ router, key, values }) => {
    const selectedValues = Array.from(new Set(values));
    if (key === 'columns') {
      set((state) => ({
        umbrellaSelectedFilters: {
          ...state.umbrellaSelectedFilters,
          [key]: umbrellaColumns.filter((column) =>
            selectedValues.includes(column.key),
          ),
        },
      }));
    }

    get().setUmbrellaSelectedFiltersToQuery({ router });
  },

  setUmbrellaFilterOptions: () => {
    set(() => ({
      umbrellaFilterOptions: {
        fields: umbrellaColumns.map((column) => ({
          id: column.key,
          label: column.label,
        })),
      },
    }));
  },

  initUmbrellaSelectedColumns: (router) => {
    let selectedFields: string[] = [];

    if (typeof window !== 'undefined') {
      const search = window.location.search.substr(1);
      const queryParams = new URLSearchParams(search);
      for (const [key, value] of queryParams.entries()) {
        if (value && key === 'umbrellaFields') {
          selectedFields = value.split(',');
          break;
        }
      }
    }

    if (selectedFields.length === 0) {
      if (router) {
        updateUrlParams(router, {
          umbrellaFields: initialUmbrellaColumns.map((column) => column.key),
        });
      }
      set({
        umbrellaSelectedFilters: {
          columns: initialUmbrellaColumns,
        },
      });
      get().setUmbrellaFilterOptions();
      return;
    }

    const newSelectedColumns = umbrellaColumns.filter((column) =>
      selectedFields.includes(column.key),
    );

    const hasStakeTokenSymbol = newSelectedColumns.some(
      (col) => col.key === UmbrellaColumnKeys.STAKE_TOKEN_SYMBOL,
    );

    if (!hasStakeTokenSymbol) {
      const stakeTokenColumn = umbrellaColumns.find(
        (col) => col.key === UmbrellaColumnKeys.STAKE_TOKEN_SYMBOL,
      );
      if (stakeTokenColumn) {
        newSelectedColumns.unshift(stakeTokenColumn);
      }
    }

    if (router) {
      updateUrlParams(router, {
        umbrellaFields: newSelectedColumns.map((column) => column.key),
      });
    }

    set({
      umbrellaSelectedFilters: {
        columns: newSelectedColumns,
      },
    });
    get().setUmbrellaFilterOptions();
  },

  setUmbrellaSelectedFiltersToQuery: ({
    router,
    pathName,
    additionalParams,
    fromEmpty,
  }) => {
    const { columns } = get().umbrellaSelectedFilters;

    // Ensure we have columns selected
    if (!columns.length) {
      get().setUmbrellaFilters({
        key: 'columns',
        values: initialUmbrellaColumns.map((column) => column.key),
      });
    }

    // Update URL parameters
    if (router) {
      updateUrlParams(
        router,
        {
          umbrellaFields: columns.map((column) => column.key),
          ...additionalParams,
        },
        pathName,
        fromEmpty,
      );
    }
  },
});
