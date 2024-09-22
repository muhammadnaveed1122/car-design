import { Card, Text, Group, Button, Avatar, Box, Center, Image } from '@mantine/core';
import { currencyFormater } from '@/constants/data';
import classes from './UserCardImage.module.css';


export function UserCardImage({ userInfo, onEdit }) {

  return (
    <Card withBorder padding="xl" radius="md" className={classes.card} shadow="sm">
      {/* <Card.Section
        h={{ base: '180', sm: '250', md: '170' }}
        style={{
          backgroundImage:
            'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9p5J_sAZXqOG5ElFUhHBk9tJi5YggV4cOajHu3m7C5w&s)',
          backgroundSize: "cover",
          backgroundRepeat: 'no-repeat',
        }}
      /> */}
      <Center className='user-profile' >
        <Avatar alt="it's me" w='100' h='100' >
          <Image src='/assets/ic_profile.svg' alt='avatar' />
        </Avatar>
      </Center>
      <Text ta="center" fz="lg" fw={500} mt="sm">
        {userInfo?.firstName} {userInfo?.lastName}
      </Text>
      <Text ta="center" fz="sm" c="dimmed">
        {new Date(userInfo?.dateOfBirth).toDateString()}
      </Text>
      <Group mt="md" justify="center" gap={30}>
        <div>
          <Text ta="center" fz="sm" fw={500}>
            ${currencyFormater(userInfo?.spent)}
          </Text>
          <Text ta="center" fz="xs" c="dimmed" lh={1}>
            Spent
          </Text>
        </div>
        <div>
          <Text ta="center" fz="sm" fw={500}>
            {userInfo?.buyCount} Car{userInfo?.buyCount > 1 ? 's' : ''}
          </Text>
          <Text ta="center" fz="xs" c="dimmed" lh={1}>
            Bought
          </Text>
        </div>
        <div>
          <Text ta="center" fz="sm" fw={500}>
            {userInfo?.bidCount}
          </Text>
          <Text ta="center" fz="xs" c="dimmed" lh={1}>
            Bid{userInfo?.bidCount > 1 ? 's' : ''}
          </Text>
        </div>
      </Group>
      <Button fullWidth radius="md" mt="xl" size="md" onClick={onEdit}>
        Edit Profile
      </Button>
    </Card>
  );
}