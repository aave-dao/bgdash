'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import SaveIcon from '../../../assets/images/icons/save.svg';
import { formatSymbol } from '../../../helpers/formatSymbol';
import { PresetType } from '../../../helpers/presetsHelpers';
import { ColumnKeys, compareArrays } from '../../../helpers/tableHelpers';
import { useStore } from '../../../providers/ZustandStoreProvider';
import { SortDirection } from '../../../types';
import { IconBox } from '../../primitives/IconBox';
import { ShareIcon } from '../../ShareIcon';
import { Select } from './Select';

interface PresetsSelectProps {
  savePreset: () => void;
  presetChangeCallback: (presetName: string) => void;
}

export function GlobalPresetSelect({
  savePreset,
  presetChangeCallback,
}: PresetsSelectProps) {
  const theme = useTheme();
  const router = useRouter();

  const [selectedPreset, setSelectedPreset] = useState<PresetType | string>(
    PresetType.Default,
  );
  const [isCopied, setIsCopied] = useState(false);

  const selectedFilters = useStore((store) => store.selectedFilters);
  const globalPresets = useStore((store) => store.globalPresets);
  const setFilters = useStore((store) => store.setFilters);
  const removeGlobalPreset = useStore((store) => store.removeGlobalPreset);
  const setSortConfig = useStore((store) => store.setSortConfig);
  const sortConfig = useStore((store) => store.sortConfig);

  useEffect(() => {
    // check if chosen preset exists
    const checkPresets = (): string | undefined => {
      return Object.keys(globalPresets).find((presetName) => {
        const preset = globalPresets[presetName];

        const presetColumns = preset.fields || [];
        const presetAssets =
          preset.assets.map((asset) => formatSymbol(asset)) || [];
        const presetChainIds = preset.chainIds || [];
        const presetPools = preset.pool || [];
        const presetVersions = preset.version || [];
        const presetSortConfig = preset.sortConfig;

        const columnsMatch = compareArrays(
          presetColumns,
          selectedFilters.columns.filter(Boolean).map((column) => column.key),
        );

        const assetsMatch = compareArrays(
          [...new Set(presetAssets)],
          [
            ...new Set(
              selectedFilters.symbol.map((symbol) => formatSymbol(symbol)),
            ),
          ],
        );

        const chainIdsMatch = compareArrays(
          presetChainIds,
          selectedFilters.chainId.length
            ? selectedFilters.chainId
            : globalPresets[presetName].chainIds,
        );

        const poolsMatch = compareArrays(
          presetPools,
          selectedFilters.pool.length
            ? selectedFilters.pool
            : globalPresets[presetName].pool,
        );

        const versionsMatch = compareArrays(
          presetVersions,
          selectedFilters.version.length
            ? selectedFilters.version
            : globalPresets[presetName].version,
        );

        const sortConfigMatch = presetSortConfig
          ? presetSortConfig.key === sortConfig.key &&
            presetSortConfig.direction === sortConfig.direction
          : sortConfig.key === null &&
            sortConfig.direction === SortDirection.Ascending;

        return columnsMatch &&
          assetsMatch &&
          chainIdsMatch &&
          poolsMatch &&
          versionsMatch &&
          sortConfigMatch
          ? presetName
          : '';
      });
    };

    const match = checkPresets();

    // if it exists, set it as selected
    setSelectedPreset(match || 'Custom');
    presetChangeCallback(match || 'Custom');
  }, [
    selectedFilters.columns,
    selectedFilters.symbol,
    selectedFilters.chainId,
    selectedPreset,
    globalPresets,
    selectedFilters.pool,
    selectedFilters.version,
    sortConfig,
    presetChangeCallback,
  ]);

  const applyPresets = (preset: string) => {
    setSelectedPreset(preset);
    presetChangeCallback(preset);
    const presetSortConfig = globalPresets[preset].sortConfig;
    setSortConfig({
      key: (presetSortConfig?.key as ColumnKeys | null) || null,
      direction: presetSortConfig?.direction || SortDirection.Ascending,
      router,
    });
    setFilters({
      router,
      key: 'columns',
      values: globalPresets[preset].fields,
    });
    setFilters({ router, key: 'symbol', values: globalPresets[preset].assets });
    setFilters({
      router,
      key: 'chainId',
      values: globalPresets[preset].chainIds,
    });
    setFilters({ router, key: 'pool', values: globalPresets[preset].pool });
    setFilters({
      router,
      key: 'version',
      values: globalPresets[preset].version,
    });
  };

  const copyPresetToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const deletePreset = (option: string) => {
    removeGlobalPreset(option);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.up('sm')]: { ml: 24 },
      }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            whiteSpace: 'nowrap',
            marginRight: 15,
          }}>
          Preset:
        </Box>
        <Select
          value={selectedPreset}
          onChange={applyPresets}
          options={Object.keys(globalPresets)}
          onDelete={deletePreset}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        {selectedPreset === 'Custom' && (
          <IconBox
            as="button"
            onClick={savePreset}
            sx={(theme) => ({
              width: 15,
              height: 15,
              marginLeft: 12,
              cursor: 'pointer',
              [theme.breakpoints.up('sm')]: {
                marginLeft: 16,
              },
              hover: {
                '> div': {
                  marginTop: -2,
                  paddingLeft: 2,
                },
              },
              '&:active': {
                '> div': {
                  marginTop: 0,
                  paddingLeft: 0,
                  '> svg': {
                    path: {
                      fill: theme.palette.$main,
                      '&:last-of-type': {
                        stroke: theme.palette.$paper,
                      },
                    },
                  },
                },
              },
            })}>
            <Box
              sx={(theme) => ({
                transition: 'all 0.3s ease',
                '> svg': {
                  width: 15,
                  height: 15,
                  path: {
                    stroke: theme.palette.$main,
                    strokeWidth: 1.7,
                  },
                },
              })}>
              <SaveIcon />
            </Box>
          </IconBox>
        )}

        <ShareIcon onClick={copyPresetToClipboard} isCopied={isCopied} />
      </Box>
    </Box>
  );
}
