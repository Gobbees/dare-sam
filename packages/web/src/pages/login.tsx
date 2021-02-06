import * as React from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  VStack,
} from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { signin } from 'next-auth/client';
import * as Yup from 'yup';
import Logo from '../components/common/Logo';

const LoginPage = () => (
  <VStack
    spacing={4}
    flexDir="column"
    py={96}
    alignItems="center"
    justifyContent="center"
  >
    <Logo showText />
    <Formik
      initialValues={{ email: '' }}
      onSubmit={(values) =>
        signin('email', {
          email: values.email,
          callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/account`,
        })
      }
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Required'),
      })}
    >
      {({ errors, handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <VStack spacing={3} w={96}>
            <Field name="email">
              {({ field }: FieldProps) => (
                <FormControl isInvalid={!!errors.email}>
                  <Input
                    {...field}
                    id="email"
                    placeholder="your-email@email.com"
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Button
              type="submit"
              colorScheme="purple"
              isLoading={isSubmitting}
              w="full"
            >
              Login with email
            </Button>
          </VStack>
        </Form>
      )}
    </Formik>
  </VStack>
);
export default LoginPage;
