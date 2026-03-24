import { StoreSlice } from '../types';

export interface IUISlice {
  isRendered: boolean;
  setIsRendered: () => void;

  isFiltersOpenForLayout: boolean;
  setIsFiltersOpenForLayout: (value: boolean) => void;
}

export const createUISlice: StoreSlice<IUISlice> = (set) => ({
  isRendered: false,
  setIsRendered: () => set({ isRendered: true }),

  isFiltersOpenForLayout: false,
  setIsFiltersOpenForLayout: (value: boolean) =>
    set({ isFiltersOpenForLayout: value }),
});
