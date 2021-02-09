import * as React from 'react';
import { Field, FieldProps, Form, Formik } from 'formik';
import {
  VStack,
  Text,
  Image,
  RadioGroup,
  Radio,
  Button,
  HStack,
  StackDivider,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { SocialProfile } from '../../types';
import { getFacebookPagesForProfile } from '../../app/api/facebook';
import { getInstagramProfilesForProfile } from '../../app/api/instagram';

interface ProfilesSelectorProps {
  fbAccessToken: string;
  displayFacebook: boolean;
  displayInstagram: boolean;
}

const ProfilesSelector: React.FC<ProfilesSelectorProps> = (
  props: ProfilesSelectorProps,
) => {
  const queryClient = useQueryClient();
  const facebookPageMutation = useMutation(
    async (page: SocialProfile) =>
      fetch('/api/facebook/pages/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page }),
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user');
      },
      onError: (error: Error) => {
        console.error(error.message);
      },
    },
  );
  const instagramProfileMutation = useMutation(
    async (profile: SocialProfile) =>
      fetch('/api/instagram/profiles/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user');
      },
      onError: (error: Error) => {
        console.error('Error:', error.message);
      },
    },
  );
  const facebookPages = useQuery<SocialProfile[] | undefined>(
    'facebook-pages',
    () => getFacebookPagesForProfile(props.fbAccessToken),
    { enabled: props.displayFacebook },
  );
  const instagramProfiles = useQuery<SocialProfile[] | undefined>(
    'instagram-profiles',
    () => getInstagramProfilesForProfile(props.fbAccessToken),
    { enabled: props.displayInstagram },
  );
  return (
    <VStack spacing={4} alignItems={{ base: 'center', lg: 'start' }} pt={5}>
      {props.displayFacebook && facebookPages.data && (
        <>
          <Text fontWeight="bold" fontSize="xl">
            Your Facebook Pages
          </Text>
          <Text color="gray.400" fontSize="md">
            At the moment we only support one Facebook page per account. Please
            select the page that you want to be analyzed.
          </Text>
          <Formik
            initialValues={{
              selectedFBPage: facebookPages.data[0].id,
            }}
            onSubmit={(values) => {
              const page = facebookPages.data!.find(
                (fbPage) => fbPage.id === values.selectedFBPage,
              );
              facebookPageMutation.mutate(page!);
            }}
          >
            {({ values, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <VStack spacing={5} align="start">
                  <RadioGroup value={values.selectedFBPage}>
                    <HStack
                      spacing={5}
                      divider={<StackDivider orientation="vertical" />}
                      align="center"
                    >
                      {facebookPages.data!.map((page) => (
                        <Field
                          type="radio"
                          name="selectedFBPage"
                          value={page.id}
                          key={page.id}
                        >
                          {({ field }: FieldProps) => (
                            <HStack spacing={3} align="center">
                              <Radio {...field} />
                              <VStack spacing={2} align="center">
                                <Text>{page.name}</Text>
                                <Image
                                  src={page.picture}
                                  w={16}
                                  h={16}
                                  borderRadius="full"
                                  borderWidth="3px"
                                  borderStyle="solid"
                                />
                              </VStack>
                            </HStack>
                          )}
                        </Field>
                      ))}
                    </HStack>
                  </RadioGroup>
                  <Button type="submit" colorScheme="facebook" shadow="lg">
                    Save your page
                  </Button>
                </VStack>
              </Form>
            )}
          </Formik>
        </>
      )}
      {props.displayInstagram && instagramProfiles.data && (
        <>
          <Text fontWeight="bold" fontSize="xl">
            Your Instagram Profiles
          </Text>
          <Text color="gray.400" fontSize="md">
            At the moment we only support one Instagram profile per account.
            Please select the profile that you want to be analyzed.
          </Text>
          <Formik
            initialValues={{
              selectedInstagramProfile: instagramProfiles.data[0].id,
            }}
            onSubmit={async (values) => {
              const profile = instagramProfiles.data!.find(
                (igProfile) => igProfile.id === values.selectedInstagramProfile,
              );
              instagramProfileMutation.mutate(profile!);
            }}
          >
            {({ values, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <VStack spacing={5} align="start">
                  <RadioGroup value={values.selectedInstagramProfile}>
                    <HStack
                      spacing={5}
                      divider={<StackDivider orientation="vertical" />}
                      align="center"
                    >
                      {instagramProfiles.data!.map((page) => (
                        <Field
                          type="radio"
                          name="selectedInstagramProfile"
                          value={page.id}
                          key={page.id}
                        >
                          {({ field }: FieldProps) => (
                            <HStack spacing={3} align="center">
                              <Radio {...field} />
                              <VStack spacing={2} align="center">
                                <Text>{page.name}</Text>
                                <Image
                                  src={page.picture}
                                  w={16}
                                  h={16}
                                  borderRadius="full"
                                  borderWidth="3px"
                                  borderStyle="solid"
                                />
                              </VStack>
                            </HStack>
                          )}
                        </Field>
                      ))}
                    </HStack>
                  </RadioGroup>
                  <Button type="submit" colorScheme="instagram" shadow="lg">
                    Save your profile
                  </Button>
                </VStack>
              </Form>
            )}
          </Formik>
        </>
      )}
    </VStack>
  );
};

export default ProfilesSelector;
