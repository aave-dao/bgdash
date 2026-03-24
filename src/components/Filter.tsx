import { Combobox } from '@headlessui/react';
import { Box, useTheme } from '@mui/system';
import React, { useCallback, useEffect, useState } from 'react';

import SearchIcon from '../assets/images/icons/search.svg';
import { FilterOption } from '../types';
import { ArrowAndCross } from './ArrowAndCross';
import { CheckBox } from './CheckBox';
import { FieldWrapper } from './FieldWrapper';
import { IconBox } from './primitives/IconBox';
import { Input } from './primitives/Input';

interface FilterProps {
  label: string;
  options: FilterOption[];
  selected: FilterOption[];
  onChange: (selected: string[]) => void;
  withSearch?: boolean;
  isPanelOpen?: boolean;
  allOptions?: string[];
  withClean?: boolean;
}

export function Filter({
  label,
  options,
  selected,
  onChange,
  withSearch,
  isPanelOpen,
  allOptions,
  withClean,
}: FilterProps) {
  const theme = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setIsOpen(false);
    setSearchValue('');
  }, [isPanelOpen]);

  // improve performance by using useCallback on re-renders
  const handleOptionChange = useCallback(
    (option: FilterOption) => {
      const isSelected = !!selected.find((item) => item.id === option.id);
      const newSelected = isSelected
        ? selected.filter((s) => s.id !== option.id)
        : [...selected, option];
      onChange(newSelected.map((item) => item.id));
    },
    [selected, onChange],
  );

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <Box sx={{ marginBottom: 16 }}>
      <Combobox
        as={Box}
        sx={{ position: 'relative' }}
        value={selected}
        onChange={(values) =>
          values.forEach((value) => handleOptionChange(value))
        }
        multiple>
        <Box sx={{ position: 'relative', zIndex: isOpen ? 2 : 1 }}>
          <Combobox.Button
            onClick={() => {
              setIsOpen((prevIsOpen) => {
                if (
                  !prevIsOpen &&
                  typeof document !== 'undefined' &&
                  withSearch
                ) {
                  setTimeout(() => {
                    const element = document.getElementById(
                      `Filter__search--input-${label}`,
                    );
                    if (element) {
                      element.focus();
                    }
                    return;
                  }, 1);
                }
                return !prevIsOpen;
              });
            }}
            as={Box}
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 8,
              typography: 'body',
              cursor: 'pointer',
              borderBottom: `1px solid ${theme.palette.$main}`,
              mb: 8,
              transition: 'all 0.2s ease',
              '&:after': {
                content: "''",
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: isOpen ? '100%' : '0',
                height: 2,
                background: theme.palette.$main,
                transition: 'all 0.2s ease',
              },
              hover: {
                '&:after': {
                  width: '100%',
                },
                '.Filter__label': {
                  fontWeight: 700,
                },
                '.ArrowAndCross': {
                  div: {
                    height: 2,
                  },
                },
              },
            }}>
            <Box
              className="Filter__label"
              sx={{
                transition: 'all 0.2s ease',
                fontWeight: isOpen ? 700 : undefined,
              }}>
              {label}
            </Box>
            <ArrowAndCross isCross={isOpen} />
          </Combobox.Button>

          <Box
            sx={{
              mt: 4,
              mb: 12,
              display: 'flex',
              justifyContent: 'flex-end',
              color: '$textSecondary',
              typography: 'descriptor',
              alignItems: 'center',
            }}>
            {allOptions?.length && isOpen && (
              <Box
                onClick={() => onChange(allOptions)}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  hover: {
                    opacity: 0.4,
                  },
                }}>
                All
              </Box>
            )}

            {withClean &&
              isOpen &&
              (label === 'Fields'
                ? selected.length > 1
                : selected.length >= 1) && (
                <Box
                  onClick={() => onChange([])}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    ml: 8,
                    hover: {
                      opacity: 0.4,
                    },
                  }}>
                  None
                </Box>
              )}
          </Box>

          {withSearch && isOpen && (
            <Box
              sx={{
                position: 'relative',
                p: 1,
                hover: {
                  '.Filter__search--icon': {
                    '> svg': {
                      path: {
                        strokeWidth: 2,
                      },
                    },
                  },
                },
                '&:focus-within': {
                  '.Filter__search--icon': {
                    '> svg': {
                      path: {
                        strokeWidth: 2,
                      },
                    },
                  },
                },
              }}>
              <FieldWrapper>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Input
                    id={`Filter__search--input-${label}`}
                    value={searchValue}
                    placeholder="Search"
                    onChange={(e) => setSearchValue(e.target.value)}
                    sx={{
                      pl: 12,
                      width: '100%',
                    }}
                  />

                  <IconBox
                    sx={{
                      width: 16,
                      height: 16,
                      transition: 'all 0.2s ease',
                      mx: 8,
                    }}>
                    <Box
                      className="Filter__search--icon"
                      sx={(theme) => ({
                        '> svg': {
                          width: 16,
                          height: 16,
                          path: {
                            transition: 'all 0.2s ease',
                            stroke: theme.palette.$main,
                            strokeWidth: 1,
                          },
                        },
                      })}>
                      <SearchIcon />
                    </Box>
                  </IconBox>
                </Box>
              </FieldWrapper>
            </Box>
          )}

          {isOpen && (
            <Combobox.Options
              static
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              as={Box}
              sx={{
                mt: 16,
                maxHeight: 270,
                overflowY: 'auto',
                width: '100%',
              }}>
              {filteredOptions.length ? (
                filteredOptions.map((option, index) => (
                  <Combobox.Option
                    as={Box}
                    key={index}
                    value={option}
                    sx={{
                      position: 'relative',
                      mb: 8,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      hover: {
                        fontWeight: 700,
                        '.CheckBox': {
                          background: theme.palette.$disabled,
                        },
                      },
                    }}>
                    <CheckBox
                      value={selected.map((s) => s.id).includes(option.id)}
                    />
                    {option.label}
                  </Combobox.Option>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', width: '100%' }}>
                  No elements
                </Box>
              )}
            </Combobox.Options>
          )}
        </Box>
      </Combobox>
    </Box>
  );
}
