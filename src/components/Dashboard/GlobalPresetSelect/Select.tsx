import { Listbox } from '@headlessui/react';
import { Box, useTheme } from '@mui/system';
import React, { useEffect, useState } from 'react';

import CrossIcon from '../../../assets/images/icons/crossIcon.svg';
import DeleteIcon from '../../../assets/images/icons/delete.svg';
import ConfirmIcon from '../../../assets/images/icons/tick.svg';
import { globalPresets } from '../../../helpers/presetsHelpers';
import { getTextWidth } from '../../../helpers/tableHelpers';
import { ArrowAndCross } from '../../ArrowAndCross';
import { FieldWrapper } from '../../FieldWrapper';
import { IconBox } from '../../primitives/IconBox';

const font = '13px Inter';
const containerWidth = 150;
function SelectButton({ value, open }: { value: string; open: boolean }) {
  const textWidth = getTextWidth(value, font);
  const additionalStyles = {
    textIndent: 0,
    transition: 'text-indent 1.5s ease',
    hover: {
      textIndent:
        textWidth > containerWidth ? `${containerWidth - textWidth}px` : 0,
    },
  };

  return (
    <FieldWrapper isFocused={open} small>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 'inherit',
          p: '4px 12px',
        }}>
        <Box
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flexBasis: '90%',
            textAlign: 'left',
            color: '$text',
            ...additionalStyles,
          }}>
          {value}
        </Box>
        <ArrowAndCross sx={{ flexBasis: '10%', ml: 8 }} isCross={open} />
      </Box>
    </FieldWrapper>
  );
}

function OptionItem({
  option,
  onDelete,
  open,
  handleDeleteClick,
  isDisabled,
}: {
  option: string;
  onDelete?: (option: string) => void;
  handleDeleteClick: (
    e: React.MouseEvent<HTMLDivElement>,
    option: string,
  ) => void;
  open: boolean;
  isDisabled?: boolean;
}) {
  const theme = useTheme();

  const [isDeleteMode, setIsDeleteMode] = useState(false);

  useEffect(() => {
    setIsDeleteMode(false);
  }, [open]);

  const toggleDeleteMode = (
    e: React.MouseEvent<HTMLDivElement>,
    flag: boolean,
  ) => {
    e.stopPropagation();
    setIsDeleteMode(flag);
  };

  const textWidth = getTextWidth(option, font);
  const additionalStyles = {
    textIndent: 0,
    transition: 'text-indent 1.5s ease',
    hover: {
      textIndent:
        textWidth > containerWidth ? `${containerWidth - textWidth}px` : 0,
    },
  };

  const isPredefined = Object.keys(globalPresets).includes(option);
  const showDelete = !isPredefined && !!onDelete;

  return (
    <Listbox.Option
      disabled={isDisabled}
      as={Box}
      sx={{
        display: 'flex',
        cursor: isDisabled
          ? showDelete
            ? 'default'
            : 'not-allowed'
          : 'pointer',
        width: '100%',
        p: '6px 12px',
        transition: 'all 0.2s ease',
        background: isDisabled ? theme.palette.$light : theme.palette.$paper,
        hover: { background: theme.palette.$light },
      }}
      value={option}>
      <Box
        sx={{
          typography: 'body',
          flexBasis: '75%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          ...additionalStyles,
        }}>
        {option}
      </Box>

      {showDelete && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexBasis: '25%',
          }}>
          {isDeleteMode && (
            <IconBox
              as="button"
              onClick={(e) => {
                toggleDeleteMode(e, false);
              }}
              sx={{
                width: 12,
                height: 12,
                cursor: 'pointer',
                flexBasis: '10%',
                transition: 'all 0.2s ease',
                mr: 8,
                hover: {
                  opacity: '0.7',
                },
              }}>
              <Box
                sx={(theme) => ({
                  '> svg': {
                    width: 12,
                    height: 12,
                    path: {
                      stroke: theme.palette.$main,
                    },
                  },
                })}>
                <CrossIcon />
              </Box>
            </IconBox>
          )}

          <IconBox
            as="button"
            onClick={(e) => {
              if (isDeleteMode) {
                handleDeleteClick(e, option);
              } else {
                toggleDeleteMode(e, true);
              }
            }}
            sx={{
              width: 14,
              height: 14,
              cursor: 'pointer',
              flexBasis: '10%',
              transition: 'all 0.2s ease',
              hover: {
                opacity: '0.7',
              },
            }}>
            <Box
              sx={(theme) => ({
                '> svg': {
                  width: 14,
                  height: 14,
                  path: {
                    stroke: theme.palette.$main,
                  },
                },
              })}>
              {isDeleteMode ? <ConfirmIcon /> : <DeleteIcon />}
            </Box>
          </IconBox>
        </Box>
      )}
    </Listbox.Option>
  );
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  onDelete?: (option: string) => void;
}

export function Select({ options, onChange, value, onDelete }: SelectProps) {
  const theme = useTheme();

  const handleDeleteClick = (
    e: React.MouseEvent<HTMLDivElement>,
    option: string,
  ) => {
    e.stopPropagation();
    onDelete!(option);
  };

  return (
    <Listbox
      as={Box}
      sx={{ position: 'relative', zIndex: 2 }}
      value={value}
      onChange={onChange}>
      {({ open }) => (
        <>
          <Listbox.Button>
            <SelectButton value={value} open={open} />
          </Listbox.Button>

          <Listbox.Options
            as={Box}
            sx={{
              left: -1,
              width: '100%',
              position: 'absolute',
              backgroundColor: '$paper',
              border: `1px solid ${theme.palette.$mainBorder}`,
              overflowY: 'auto',
              maxHeight: 250,
            }}>
            {options.map((option) => (
              <OptionItem
                key={option}
                option={option}
                onDelete={onDelete}
                isDisabled={option.toLowerCase() === value.toLowerCase()}
                handleDeleteClick={handleDeleteClick}
                open={open}
              />
            ))}
          </Listbox.Options>
        </>
      )}
    </Listbox>
  );
}
