import { TextInput, Select, Grid, Stack, Button, Group, MantineProvider } from '@mantine/core';
import { IconThumbUp, IconThumbDown } from '@tabler/icons-react';
import { packageModes } from '@/constants/data';
import { addressToString } from '@/helpers';
import { verifyService } from '@/services';
import { useState } from "react";

export { UserInfoForm };
function UserInfoForm(props) {
  const { id, firstName, lastName, email, phone, address, zipCode, packageMode, referal, status, changeParams } = props;
  const [referalCode, setReferalCode] = useState(referal);
  const [userStatus, setUserStatus] = useState(status);

  return (
    <MantineProvider defaultColorScheme="dark">
      <form>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack>
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    required
                    label="First Name"
                    value={firstName}
                    radius="md"
                    readOnly
                    disabled
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    required
                    label="Last Name"
                    value={lastName}
                    radius="md"
                    readOnly
                    disabled
                  />
                </Grid.Col>
              </Grid>

              <TextInput
                required
                label="Email"
                value={email}
                radius="md"
                readOnly
                disabled
              />
              <TextInput
                required
                label="Phone"
                value={phone}
                radius="md"
                readOnly
                disabled
              />

              <Grid>
                <Grid.Col span={{ xs: '9' }}>
                  <TextInput
                    required
                    label="Address"
                    value={addressToString(address)}
                    radius="md"
                    readOnly
                    disabled
                  />
                </Grid.Col>
                <Grid.Col span={{ xs: '3' }}>
                  <TextInput
                    required
                    label="Zip Code"
                    value={zipCode}
                    radius="md"
                    readOnly
                    disabled
                  />
                </Grid.Col>
              </Grid>

              <TextInput
                required
                label="Referral Code"
                value={referalCode}
                radius="md"
                onChange={(e) => setReferalCode(e.target.value)}
                rightSection={
                  <Button radius="sm" size="compact-sm" ml={-20} onClick={() => {
                    changeParams(id, { referal: referalCode }, true);
                  }}>Save</Button>}
              />

              <Select
                required
                radius="lg"
                label="Package"
                placeholder="Select Package"
                value={Object.keys(packageModes)[Object.values(packageModes).indexOf(packageMode)]}
                data={Object.keys(packageModes)}
                readOnly
                disabled
              />
            </Stack>
          </Grid.Col>
        </Grid>

        <Group justify="end" mt="xl">
          <Group justify="center" mt="xl">
            {userStatus !== 'APPROVED' &&
              <Button leftSection={<IconThumbUp />} onClick={() => {
                changeParams(id, { status: 'APPROVED' }, false);
                setUserStatus('APPROVED');
                verifyService.sendApproval({
                  emailTo: email,
                  fullName: `${firstName} ${lastName}`
                });
              }}>
                Approve
              </Button>}
            {userStatus !== 'DENIED' &&
              <Button leftSection={<IconThumbDown />} variant="danger" onClick={() => {
                changeParams(id, { status: 'DENIED' }, false);
                setUserStatus('DENIED');
              }}>
                Deny
              </Button>}
          </Group>
        </Group>
      </form>
    </MantineProvider>
  );
}
