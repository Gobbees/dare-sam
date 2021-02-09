import {
  HStack,
  FormControl,
  FormLabel,
  FormHelperText,
} from '@chakra-ui/react';
import * as React from 'react';
import DatePicker from 'react-datepicker';

interface IntervalSelectorProps {
  startValue: Date;
  onStartValueChange: (date: Date) => void;
  endValue: Date;
  onEndValueChange: (date: Date) => void;
}

const IntervalSelector: React.FC<IntervalSelectorProps> = (
  props: IntervalSelectorProps,
) => (
  <HStack spacing={3}>
    <FormControl>
      <FormLabel>From</FormLabel>
      <DatePicker
        selected={props.startValue}
        onChange={props.onStartValueChange}
      />
      <FormHelperText>Select the start date</FormHelperText>
    </FormControl>
    <FormControl>
      <FormLabel>To</FormLabel>
      <DatePicker selected={props.endValue} onChange={props.onEndValueChange} />
      <FormHelperText>Select the end date</FormHelperText>
    </FormControl>
  </HStack>
);

export default IntervalSelector;
