import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

function RedirectingPage() {
  return (
    <Flex flexDir="column" align="center">
      <Text fontWeight="bold" fontSize="xl">
        Missing Authentication. Redirecting...
      </Text>
    </Flex>
  );
}

export default RedirectingPage;
