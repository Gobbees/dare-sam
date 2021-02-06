import * as React from 'react';
import { HStack, Text } from '@chakra-ui/react';
import Link from 'next/link';

interface LogoProps {
  showText: boolean;
  onClickHref?: string;
}

const Logo: React.FC<LogoProps> = (props: LogoProps) => {
  const logo = (
    <HStack spacing={2} align="center">
      <Text fontSize="3xl">🔮</Text>
      {props.showText && (
        <Text fontSize="xl" color="purple.600">
          Crystal Ball
        </Text>
      )}
    </HStack>
  );

  return props.onClickHref ? (
    <Link href={props.onClickHref}>
      <a>{logo}</a>
    </Link>
  ) : (
    logo
  );
};

export default Logo;
