import {
  Flex,
  Box,
  Icon,
  Link,
  Stack,
  StackDivider,
  Spacer,
} from '@chakra-ui/react';
import * as React from 'react';
import { IoClose, IoMenu } from 'react-icons/io5';
import NextLink from 'next/link';
import Logo from './Logo';

const NavBarContainer = (props: { children: React.ReactNode }) => {
  const [top, setTop] = React.useState(true);

  // detect whether user has scrolled the page down by 10px
  React.useEffect(() => {
    const scrollHandler = () => {
      if (window.pageYOffset > 70) {
        setTop(false);
      } else {
        setTop(true);
      }
    };
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [top]);

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      pos="fixed"
      zIndex="sticky"
      w="full"
      p={5}
      bg="white"
      shadow={top ? 'none' : 'lg'}
      opacity={top ? 1 : 0.9}
      _hover={{ opacity: 1 }}
    >
      {props.children}
    </Flex>
  );
};

const MenuToggle = (props: { toggle: () => void; isOpen: boolean }) => (
  <Box display={{ base: 'block', md: 'none' }} onClick={props.toggle}>
    {props.isOpen ? (
      <Icon as={IoClose} color="purple.600" w={6} h={6} />
    ) : (
      <Icon as={IoMenu} color="purple.600" w={6} h={6} />
    )}
  </Box>
);

const MenuLinks = (props: { isOpen: boolean }) => (
  <Box
    display={{ base: props.isOpen ? 'block' : 'none', md: 'block' }}
    flexBasis={{ base: '100%', md: 'auto' }}
    pr={5}
  >
    <Stack
      spacing={8}
      align="center"
      justify={['center', 'space-around', 'flex-end', 'flex-end']}
      direction={['column', 'row', 'row', 'row']}
      divider={
        props.isOpen ? <StackDivider borderColor="gray.200" /> : undefined
      }
      pt={[4, 4, 0, 0]}
    >
      <MenuItem href="/dashboard">Dashboard</MenuItem>
      <MenuItem href="/account">Account</MenuItem>
    </Stack>
  </Box>
);

const MenuItem = (props: { children: React.ReactNode; href: string }) => (
  <NextLink href={props.href}>
    <Link display="block" fontWeight="bold" color="purple.600">
      {props.children}
    </Link>
  </NextLink>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <NavBarContainer>
      <Logo showText onClickHref="/dashboard" />
      <Spacer />
      <MenuToggle toggle={toggle} isOpen={isOpen} />
      <MenuLinks isOpen={isOpen} />
    </NavBarContainer>
  );
};

export default Navbar;
