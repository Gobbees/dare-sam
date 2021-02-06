import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  Text,
  VStack,
} from '@chakra-ui/react';
import * as React from 'react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { AiFillFacebook } from 'react-icons/ai';
import { getFacebookAccessToken } from '../../app/api/facebook';

interface ProfilesConnectorProps {
  onFacebookConnected: (
    token: string,
    facebookSelected: boolean,
    instagramSelected: boolean,
  ) => void;
  facebookEnabled: boolean;
  instagramEnabled: boolean;
}

const ProfilesConnector: React.FC<ProfilesConnectorProps> = (
  props: ProfilesConnectorProps,
) => (
  <Formik
    initialValues={{
      facebookChecked: false,
      instagramChecked: false,
    }}
    onSubmit={async (values, { setSubmitting }) => {
      try {
        const accessToken = await getFacebookAccessToken(
          values.instagramChecked,
        );
        if (!accessToken) {
          throw new Error('Unexpected error while retrieving the Access token');
        }
        props.onFacebookConnected(
          accessToken,
          values.facebookChecked,
          values.instagramChecked,
        );
      } catch (error) {
        console.error(error);
      }
      setSubmitting(false);
    }}
  >
    {({ values, handleSubmit, isSubmitting }) => (
      <Form onSubmit={handleSubmit}>
        <VStack spacing={4} alignItems={{ base: 'center', lg: 'start' }} pt={5}>
          <Text fontWeight="extrabold">Facebook</Text>
          <Field name="facebookChecked">
            {({ field }: FieldProps) => (
              <FormControl>
                <Checkbox
                  {...field}
                  isChecked={field.value}
                  isDisabled={!props.facebookEnabled}
                >
                  Connect my Facebook Page
                </Checkbox>
                <FormHelperText>
                  By checking this, you will have the possibility to add your
                  Facebook Pages to the service.
                </FormHelperText>
              </FormControl>
            )}
          </Field>
          <Field name="instagramChecked">
            {({ field }: FieldProps) => (
              <FormControl>
                <Checkbox
                  {...field}
                  isChecked={field.value}
                  isDisabled={!props.instagramEnabled}
                >
                  Connect my Instagram Profile
                </Checkbox>
                <FormHelperText>
                  By checking this, you will have the possibility to add your
                  Instagram Profiles to the service.
                </FormHelperText>
              </FormControl>
            )}
          </Field>
          <Button
            type="submit"
            leftIcon={<AiFillFacebook />}
            px={6}
            py={4}
            h={14}
            shadow="lg"
            minW="max-content"
            textColor="white"
            colorScheme="facebook"
            isDisabled={!values.facebookChecked && !values.instagramChecked}
            isLoading={isSubmitting}
          >
            Connect my Facebook Profile
          </Button>
        </VStack>
      </Form>
    )}
  </Formik>
);

export default ProfilesConnector;
