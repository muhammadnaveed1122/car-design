import { useEffect, useState } from "react";
import {
  Card,
  Text,
  SimpleGrid,
  UnstyledButton,
  Group,
  useMantineTheme,
  Modal,
  Box,
  Image,
  Badge,
} from "@mantine/core";
import {
  IconReceipt,
  IconReceiptTax,
  IconFileInvoice,
  IconUserScan,
} from "@tabler/icons-react";
import classes from "./ActionsGrid.module.css";
import { identityService } from "@/services";
import { useDisclosure } from "@mantine/hooks";
import Identity from "@/components/Identity/identity";

const mockdata = [
  // { title: "Invoices", icon: IconReceipt, color: "violet" },
  // { title: "Bill of Sale", icon: IconFileInvoice, color: "teal" },
  { title: "Invoices", icon: IconReceipt, iconUrl: "/assets/ic_receipt.svg", },
  { title: "Bill of Sale", icon: IconFileInvoice, iconUrl: "/assets/ic_file_invoice.svg", },
  {
    title: "Identity Verification",
    icon: "IconUserScan",
    status: "Unverified",
    iconUrl: "/assets/ic_id_card.svg",
  },
];

export function ActionsGrid() {
  const theme = useMantineTheme();
  const [identityStatus, setIdentityStatus] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await identityService.getById(user?.id);
        if (data?.identityAcount?.approve == 1) {
          setIdentityStatus(true);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  const items = mockdata.map((item) => (
    <UnstyledButton
      key={item.title}
      className={classes.item}
      pos="relative"
      onClick={() => {
        if (item.title === "Identity Verification" && !identityStatus) {
          open();
        }
      }}
    >
      {/* <item.icon color={theme.colors[item.color][6]} size="2rem" /> */}
      <Image src={item.iconUrl} alt="icon" w="2.2rem" h="2rem" />
      <Text size="xs" mt={7}>
        {item.title}
      </Text>
      {item.title === "Identity Verification" && !identityStatus && (
        <Badge
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "90px",
            textTransform: "capitalize",
            padding: "0 5px",
            backgroundColor: "#f03a17",
            color: "#fff",
          }}
          // leftSection={<div className="blob-icon"></div>}
        >
          {item.status}
        </Badge>
      )}

      {item.title === "Identity Verification" && identityStatus && (
        <Badge
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "90px",
            textTransform: "capitalize",
            padding: "0 5px",
            backgroundColor: "#1a971a",
            color: "#fff",
          }}
          // leftSection={<div className="blob-icon"></div>}
        >
          {/* &#10060; */}
          {"Verified"}
        </Badge>
      )}
    </UnstyledButton>
  ));

  return (
    <>
      <Modal
        size="md"
        opened={opened}
        onClose={close}
        radius={15}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        centered
      >
        <Identity close={close} />
      </Modal>

      <Card
        withBorder
        radius="md"
        className={classes.card}
        mx={{ base: "sm", lg: "none" }}
      >
        <Group justify="space-between">
          <Text className={classes.title}>Services</Text>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
          {items}
        </SimpleGrid>
      </Card>
    </>
  );
}
