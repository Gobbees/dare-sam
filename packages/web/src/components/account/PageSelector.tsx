import * as React from 'react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { Checkbox, Divider, VStack, Text, Image, Flex } from '@chakra-ui/react';
import { FacebookPage } from '../../types';

interface PageSelectorProps {
  pages: FacebookPage[];
}

const PageSelector: React.FC<PageSelectorProps> = (
  props: PageSelectorProps,
) => {
  const initialValues: {
    [key: string]: boolean;
  } = {};
  props.pages.forEach((page) => {
    initialValues[page.id] = true;
  });
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={({ values }) => console.log(values)}
    >
      {() => (
        <Form>
          <VStack spacing={3} divider={<Divider />}>
            {props.pages.map((page) => (
              <Field type="boolean" name={page.id} key={page.id}>
                {({ field }: FieldProps) => (
                  <Flex flexDir="row" alignItems="center">
                    <Checkbox {...field} isChecked={field.value} />
                    <Text>{page.name}</Text>
                    <Image src={page.pictureUrl} borderRadius="full" />
                  </Flex>
                )}
              </Field>
            ))}
          </VStack>
        </Form>
      )}
    </Formik>
  );
};

export default PageSelector;
