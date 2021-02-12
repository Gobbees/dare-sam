import { Tooltip } from '@chakra-ui/react';
import * as React from 'react';

interface TableHeaderProps {
  text: string;
  hintDescription?: string;
}

const TableHeader: React.FC<TableHeaderProps> = (props: TableHeaderProps) => (
  <Tooltip
    isDisabled={!props.hintDescription}
    hasArrow
    textColor="white"
    bg="gray.700"
    label={props.hintDescription}
  >
    {props.text}
  </Tooltip>
);

export default TableHeader;
