import {
  Box,
  Container,
  HStack,
  TableContainer,
  Thead,
  Table,
  Tr,
  Th,
  Td,
  Tbody,
  VStack,
  Heading,
  Spacer,
  Divider,
  Text,
} from "@chakra-ui/react";
import ProfileDrawer from "../components/ui/profile-drawer";
import HomeSidebarContent from "../components/home/home-sidebar-content";
import NavbarLinks from "../components/navbar/NavbarLinks";
import AvatarMenu from "../components/navbar/avatar-menu";
import Navbar from "../components/navbar/Navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../components/ui/Button"; // ✅ Correct button import

function ProfilePage() {
  const { t } = useTranslation();
  const user_id = localStorage.getItem("id");
  const [rents, setRents] = useState([]);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/users/${user_id}/rents`)
      .then((response) => {
        setRents(response.data.data);
      })
      .catch((error) => console.error("Error fetching rents:", error));
  }, [user_id]);

// ✅ Function to handle Razorpay payment
const handlePayment = async (rent) => {
  try {
    const rentalDate = new Date(rent.rental_date);
    const returnDate = new Date(rent.return_date);
    const diffTime = Math.abs(returnDate - rentalDate);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalAmount = rent.car.price * totalDays; // amount in INR

    // ✅ Razorpay maximum limit is ₹5,00,000
    if (totalAmount > 500000) {
      alert("❌ Amount exceeds Razorpay limit of ₹5,00,000 per transaction.");
      return;
    }

    // Step 1: Create order from backend
    const orderResponse = await axios.post(
      "http://127.0.0.1:8000/api/create-order",
      {
        amount: totalAmount * 100, // convert to paise
      }
    );

    const { order } = orderResponse.data;

    // Step 2: Configure Razorpay options
    const options = {
      key: "rzp_test_RQ7GZl3N5AnP3N",
      amount: order.amount,
      currency: order.currency,
      name: "Car Rental Payment",
      description: `Payment for ${rent.car.brand} ${rent.car.model}`,
      order_id: order.id,
      handler: function (response) {
        alert(`✅ Payment Successful!\nPayment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: "User",
        email: "user@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Payment error:", error);
    alert("Payment failed. Please try again.");
  }
};



  return (
    <>
      <Navbar
        sidebarContent={<HomeSidebarContent />}
        links={<NavbarLinks />}
        buttons={<AvatarMenu />}
      />
      <Container h="100vh" maxW="100vw" py={20}>
        <VStack>
          <Box w={"90%"}>
            <HStack>
              <Heading size={["lg", "xl"]}>{t("profile.heading")}</Heading>
              <Spacer />
              <ProfileDrawer />
            </HStack>
            <Divider my={5} />

            <TableContainer>
              <Table variant="striped" size={["md", "md", "lg"]}>
                <Thead>
                  <Tr>
                    <Th>{t("profile.brand")}</Th>
                    <Th>{t("profile.model")}</Th>
                    <Th>{t("profile.type")}</Th>
                    <Th>{t("profile.price")}</Th>
                    <Th>{t("profile.gearbox")}</Th>
                    <Th>{t("profile.rentalDate")}</Th>
                    <Th>{t("profile.returnDate")}</Th>
                    <Th>Total Amount</Th>
                    <Th>Pay Now</Th>
                  </Tr>
                </Thead>
                {rents.length === 0 ? (
                  <Tbody>
                    <Tr>
                      <Td colSpan={9}>
                        <Text textAlign="center">{t("profile.noData")}</Text>
                      </Td>
                    </Tr>
                  </Tbody>
                ) : (
                  <Tbody>
                    {rents.map((rent) => {
                      const rentalDate = new Date(rent.rental_date);
                      const returnDate = new Date(rent.return_date);
                      const diffTime = Math.abs(returnDate - rentalDate);
                      const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      const totalAmount = rent.car.price * totalDays;

                      return (
                        <Tr key={rent.id}>
                          <Td>{rent.car.brand}</Td>
                          <Td>{rent.car.model}</Td>
                          <Td>{rent.car.fuel_type}</Td>
                          <Td>₹{rent.car.price}</Td>
                          <Td>{rent.car.gearbox}</Td>
                          <Td>{rent.rental_date}</Td>
                          <Td>{rent.return_date}</Td>
                          <Td>₹{totalAmount}</Td>
                          <Td>
                            <Button onClick={() => handlePayment(rent)}>
                              Pay Now
                            </Button>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                )}
              </Table>
            </TableContainer>
          </Box>
        </VStack>
      </Container>
    </>
  );
}

export default ProfilePage;