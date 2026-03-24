import { Combobox } from '@headlessui/react';
import { Box, useTheme } from '@mui/system';
import React, { useState } from 'react';

import CrossIcon from '../assets/images/icons/crossIcon.svg';
import SearchIcon from '../assets/images/icons/search.svg';
import { FilterOption } from '../types';
import { ArrowAndCross } from './ArrowAndCross';
import { FieldWrapper } from './FieldWrapper';
import { IconBox } from './primitives/IconBox';
import { Input } from './primitives/Input';

interface AssetsSearchFieldProps {
  selectedSymbols: string[];
  setSelectedSymbols: (value: string[]) => void;
  symbols: FilterOption[];
}

export function AssetsSearchField({
  selectedSymbols,
  setSelectedSymbols,
  symbols,
}: AssetsSearchFieldProps) {
  const theme = useTheme();

  const [query, setQuery] = useState('');
  const options = symbols
    .filter(
      (option) =>
        !selectedSymbols.find(
          (symbol) => symbol.toLowerCase() === option.label.toLowerCase(),
        ),
    )
    .filter((option) => {
      return option.label.toLowerCase().includes(query.toLowerCase());
    });

  return (
    <Box
      sx={{
        maxWidth: '100%',
        ml: 0,
        [theme.breakpoints.up('md')]: {
          ml: 12,
        },
        [theme.breakpoints.up('lg')]: {
          ml: 24,
        },
        hover: {
          '.AssetsSearchField__select--item': {
            backgroundColor: theme.palette.$middleLight,
          },
          '.AssetsSearchField__search--icon': {
            '> svg': {
              path: {
                strokeWidth: 2,
              },
            },
          },
        },
        '&:focus-within': {
          '.AssetsSearchField__select--item': {
            backgroundColor: theme.palette.$middleLight,
          },
          '.AssetsSearchField__search--icon': {
            '> svg': {
              path: {
                strokeWidth: 2,
              },
            },
          },
        },
      }}>
      <Combobox
        as={Box}
        sx={{ position: 'relative' }}
        value={selectedSymbols}
        onChange={(value) => {
          setSelectedSymbols(value);
          setTimeout(() => {
            if (typeof document !== 'undefined') {
              const elements = document.getElementsByClassName(
                'AssetsSearchField__assetsWrapper',
              );
              const element = elements[elements.length - 1];
              if (element) {
                element.scrollLeft = element.scrollWidth;
              }
            }
          }, 10);
        }}
        multiple>
        {({ open }) => (
          <>
            <FieldWrapper
              sx={{ '.FieldWrapper__wrapper': { minWidth: 'unset' } }}>
              <Combobox.Button
                as={Box}
                sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                {selectedSymbols.length > 0 && (
                  <Box
                    className="AssetsSearchField__assetsWrapper"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      overflowX: 'auto',
                      padding: '2px 5px',
                      width: '100%',
                      minHeight: 32,
                      height: '100%',
                      maxWidth: '100dvw',
                      position: 'relative',
                      [theme.breakpoints.up('md')]: {
                        maxWidth: '31dvw',
                      },
                      [theme.breakpoints.up('lg')]: {
                        maxWidth: '45dvw',
                      },
                    }}>
                    {selectedSymbols.map((symbol, index) => (
                      <Box
                        className="AssetsSearchField__select--item"
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '7px',
                          backgroundColor: '$light',
                          padding: '2px 4px',
                          position: 'relative',
                          height: 24,
                          zIndex: 2,
                          mr: 4,
                          transition: 'all 0.2s ease',
                          '&:last-of-type': { mr: 0 },
                          hover: {
                            path: {
                              stroke: theme.palette.$mainRed,
                            },
                          },
                        }}
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedSymbols(
                            selectedSymbols.filter(
                              (symbl) =>
                                symbl.toLowerCase() !== symbol.toLowerCase(),
                            ),
                          );
                        }}>
                        <Box>{symbol}</Box>
                        <IconBox
                          sx={{
                            width: 8,
                            height: 8,
                            ml: 4,
                          }}>
                          <Box
                            sx={(theme) => ({
                              '> svg': {
                                width: 8,
                                height: 8,
                                path: {
                                  transition: 'all 0.2s ease',
                                  stroke: theme.palette.$main,
                                },
                              },
                            })}>
                            <CrossIcon />
                          </Box>
                        </IconBox>
                      </Box>
                    ))}
                  </Box>
                )}

                <Box
                  className="AssetsSearchField__input--wrapper"
                  sx={{
                    pl: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: !selectedSymbols.length ? '100%' : 'auto',
                    position: 'relative',
                    minHeight: 36,
                    '&:after': {
                      content: "''",
                      position: 'absolute',
                      left: 0,
                      height: '100%',
                      width: '1px',
                      backgroundColor:
                        open && !!selectedSymbols.length
                          ? '$mainBorder'
                          : 'transparent',
                    },
                  }}>
                  <Combobox.Input
                    as={Input}
                    value={query}
                    className="AssetsSearchField__input"
                    placeholder="Asset"
                    onChange={(e) => setQuery(e.target.value)}
                    sx={{
                      p: 0,
                      display: open
                        ? 'block'
                        : !selectedSymbols.length
                          ? 'block'
                          : 'none',
                      width: open
                        ? '100%'
                        : !selectedSymbols.length
                          ? '100%'
                          : '0',
                      [theme.breakpoints.up('md')]: {
                        width: open
                          ? '100px'
                          : !selectedSymbols.length
                            ? '100px'
                            : '0',
                      },
                    }}
                  />

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconBox
                      sx={{
                        width: 16,
                        height: 16,
                        transition: 'all 0.2s ease',
                        mx: 8,
                      }}>
                      <Box
                        className="AssetsSearchField__search--icon"
                        sx={(theme) => ({
                          width: 16,
                          height: 16,
                          transform:
                            !open && !!selectedSymbols.length
                              ? 'rotate(45deg)'
                              : undefined,
                          position: 'relative',
                          top: !open && !!selectedSymbols.length ? 1 : 0,
                          left: !open && !!selectedSymbols.length ? 4 : 0,
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
                        {!open && !!selectedSymbols.length ? (
                          <ArrowAndCross isCross size={10} />
                        ) : (
                          <SearchIcon />
                        )}
                      </Box>
                    </IconBox>

                    {selectedSymbols.length > 1 && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 28,
                          minHeight: 34,
                          position: 'relative',
                          zIndex: 3,
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedSymbols([]);
                        }}>
                        <ArrowAndCross isCross size={11} />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Combobox.Button>
            </FieldWrapper>

            {!(!selectedSymbols.length && !query.length) && (
              <Combobox.Options
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                as={Box}
                sx={{
                  maxHeight: 220,
                  overflowY: 'auto',
                  position: 'absolute',
                  right: 1,
                  width: '100%',
                  maxWidth: 310,
                  top: 36,
                  backgroundColor: '$light',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '4px',
                  p: 4,
                  border: `1px solid ${theme.palette.$mainBorder}`,
                }}>
                {options.length ? (
                  options.map((option, index) => (
                    <Combobox.Option
                      as={Box}
                      key={index}
                      value={option.id}
                      sx={{
                        borderRadius: '7px',
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? '$textSecondary'
                            : '$middleLight',
                        cursor: 'pointer',
                        padding: '2px 4px',
                        transition: 'all 0.2s ease',
                        textAlign: 'center',
                        hover: {
                          transform: 'scale(1.1)',
                          opacity: '0.7',
                        },
                      }}>
                      {option.label}
                    </Combobox.Option>
                  ))
                ) : (
                  <Box sx={{ textAlign: 'center', width: '100%' }}>
                    No assets
                  </Box>
                )}
              </Combobox.Options>
            )}
          </>
        )}
      </Combobox>
    </Box>
  );
}
