import * as React from 'react';
import { HStack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  showText: boolean;
  onClickHref?: string;
}

const Logo: React.FC<LogoProps> = (props: LogoProps) => {
  const logo = (
    <HStack spacing={2} align="center">
      <Image src="/logo.svg" width={50} height={50} />
      {props.showText && (
        <Text fontSize="xl" color="purple.600">
          DARE-SAM
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
