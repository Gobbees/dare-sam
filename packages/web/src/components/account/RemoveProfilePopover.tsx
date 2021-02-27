import {
  Popover,
  PopoverTrigger,
  Button,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,
  Icon,
  ButtonGroup,
} from '@chakra-ui/react';
import React from 'react';
import { IoClose } from 'react-icons/io5';

interface RemoveProfilePopoverProps {
  onConfirm: () => void;
}

const RemoveProfilePopover: React.FC<RemoveProfilePopoverProps> = ({
  onConfirm,
}: RemoveProfilePopoverProps) => (
  <Popover closeOnBlur={true}>
    {({ onClose }) => (
      <>
        <PopoverTrigger>
          <Button borderRadius="full" colorScheme="red" w={1}>
            <Icon as={IoClose} />
          </Button>
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <PopoverHeader fontWeight="semibold">Confirmation</PopoverHeader>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              Are you sure you want to unlink this profile?
            </PopoverBody>
            <PopoverFooter d="flex" justifyContent="flex-end">
              <ButtonGroup size="sm">
                <Button variant="outline" onClick={onClose}>
                  No
                </Button>
                <Button
                  colorScheme="red"
                  onClick={async () => {
                    await onConfirm();
                    onClose();
                  }}
                >
                  Yes
                </Button>
              </ButtonGroup>
            </PopoverFooter>
          </PopoverContent>
        </Portal>
      </>
    )}
  </Popover>
);

export default RemoveProfilePopover;
