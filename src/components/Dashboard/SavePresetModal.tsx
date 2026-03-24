import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { Field, Form } from 'react-final-form';

import { useStore } from '../../providers/ZustandStoreProvider';
import { BasicModal } from '../BasicModal';
import { Button } from '../Button';
import { FieldWrapper } from '../FieldWrapper';
import { Input } from '../primitives/Input';

type FormProperties = {
  presetName: string;
};

interface SavePresetModalProps {
  isPresetModalOpen: boolean;
  setIsPresetModalOpen: (value: boolean) => void;
  presetName: string;
}

export function SavePresetModal({
  presetName,
  isPresetModalOpen,
  setIsPresetModalOpen,
}: SavePresetModalProps) {
  const globalPresets = useStore((store) => store.globalPresets);
  const addGlobalPreset = useStore((store) => store.addGlobalPreset);
  const renameGlobalPreset = useStore((store) => store.renameGlobalPreset);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [newPresetName, setNewPresetName] = useState(presetName);
  const [step, setStep] = useState(1);

  useEffect(() => {
    setStep(1);
    setIsInputFocused(false);
  }, [isPresetModalOpen]);

  const handleSetPresetNameFormSubmit = ({ presetName }: FormProperties) => {
    if (presetName in globalPresets) {
      setNewPresetName(presetName);
      setStep(2);
    } else {
      addGlobalPreset(presetName);
      setIsPresetModalOpen(false);
    }
  };

  return (
    <BasicModal
      isOpen={isPresetModalOpen}
      setIsOpen={setIsPresetModalOpen}
      minHeight={190}
      withCloseButton>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
        <Box component="h3" sx={{ typography: 'headline', my: 24 }}>
          {step === 1 ? 'Please, enter preset name' : 'Re-write preset?'}
        </Box>

        {step === 1 && (
          <Form<FormProperties>
            onSubmit={handleSetPresetNameFormSubmit}
            initialValues={{
              presetName,
            }}>
            {({ handleSubmit }) => (
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}>
                <Field name="presetName">
                  {(props) => (
                    <FieldWrapper isFocused={isInputFocused}>
                      <Input
                        type="text"
                        placeholder="Enter preset name"
                        {...props.input}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                      />
                    </FieldWrapper>
                  )}
                </Field>

                <Box
                  sx={{
                    display: 'flex',
                    mt: 24,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                  }}>
                  <Button
                    onClick={() => setIsPresetModalOpen(false)}
                    color="white">
                    Cancel
                  </Button>
                  <Button type="submit" css={{ ml: 24 }}>
                    Ok
                  </Button>
                </Box>
              </Box>
            )}
          </Form>
        )}

        {step === 2 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}>
            <Button color="white" onClick={() => setIsPresetModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              css={{ ml: 24 }}
              onClick={() => {
                renameGlobalPreset(newPresetName);
                setIsPresetModalOpen(false);
              }}>
              Ok
            </Button>
          </Box>
        )}
      </Box>
    </BasicModal>
  );
}
