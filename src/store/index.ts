'use client';

import { StoreApi } from 'zustand';

import { createEmodesSlice, IEModesSlice } from './emodesSlice';
import {
  createReservesModalSlice,
  IReserveModalSlice,
} from './reservesModalSlice';
import { createReservesSlice, IReserveSlice } from './reservesSlice';
import { createUISlice, IUISlice } from './uiSlice';
import { createUmbrellasSlice, IUmbrellasSlice } from './umbrellasSlice';

export type RootState = IReserveSlice &
  IReserveModalSlice &
  IEModesSlice &
  IUISlice &
  IUmbrellasSlice;

export const createRootSlice = (
  set: StoreApi<RootState>['setState'],
  get: StoreApi<RootState>['getState'],
) => ({
  ...createReservesSlice(set, get),
  ...createReservesModalSlice(set, get),
  ...createEmodesSlice(set, get),
  ...createUISlice(set, get),
  ...createUmbrellasSlice(set, get),
});
