import { Table, UnstyledButton, Group, Text, Center, rem, keys } from '@mantine/core'; import classes from '@/styles/UserTable.module.css';
import { IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react';

export const Th = ({ children, style }) => {
  return (
    <Table.Th className={classes.th} style={style}>
      <UnstyledButton className={classes.control}>
        <Group justify="space-between" style={{ display: "flex", flexWrap: "nowrap" }}>
          <Text fw={500} fz="sm" style={{ textOverflow: "ellipsis", textWrap: "nowrap", overflow: "hidden" }}>
            {children}
          </Text>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}


export const ThICON = ({ children, reversed, sorted, onSort, style, }) => {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className={classes.th} style={style}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between" style={{ display: "flex", flexWrap: "nowrap" }}>
          <Text fw={500} fz="sm" style={{ textOverflow: "ellipsis", textWrap: "nowrap", overflow: "hidden" }}>
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

export const filterData = (data, search) => data.filter((item) => keys(data[0]).some((key) => item[key].toString().toLowerCase().includes(search.toLowerCase().trim())));

export const sortData = (data, payload) => {
  const { sortBy, reversed } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  const sortedData = [...data].sort((a, b) => {
    if (sortBy == 'dateOfBirth') {
      const dateA = new Date(a.dateOfBirth);
      const dateB = new Date(b.dateOfBirth);

      if (!reversed) {
        return dateB - dateA; // Sort by descending order of dateOfBirth
      }

      return dateA - dateB; // Sort by ascending order of dateOfBirth
    } else {
      const valueA = a[sortBy];
      const valueB = b[sortBy];

      if (!reversed) {
        return typeof valueB === 'number' && typeof valueA === 'number'
          ? valueB - valueA
          : valueB.toString().localeCompare(valueA.toString());
      }


      return typeof valueA === 'number' && typeof valueB === 'number'
        ? valueA - valueB
        : valueA.toString().localeCompare(valueB.toString());
    }
  });

  return filterData(sortedData, payload.search);
};