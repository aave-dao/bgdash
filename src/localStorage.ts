import { GlobalPresets } from './helpers/presetsHelpers';

export enum LocalStorageKeys {
  UserGlobalPresets = 'UserGlobalPresets',
}

export const getUserGlobalPresets = (): GlobalPresets => {
  const presets = localStorage.getItem(LocalStorageKeys.UserGlobalPresets);
  return presets ? JSON.parse(presets) : {};
};

export const setUserGlobalPresets = (presets: GlobalPresets) => {
  localStorage.setItem(
    LocalStorageKeys.UserGlobalPresets,
    JSON.stringify(presets),
  );
};

export const removeUserGlobalPreset = (presetName: string) => {
  const presets = getUserGlobalPresets();
  delete presets[presetName];
  setUserGlobalPresets(presets);
};
