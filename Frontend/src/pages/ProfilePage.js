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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  Button as ChakraButton,
} from "@chakra-ui/react";

import Navbar from "../components/navbar/Navbar";
import HomeSidebarContent from "../components/home/home-sidebar-content";
import NavbarLinks from "../components/navbar/NavbarLinks";
import AvatarMenu from "../components/navbar/avatar-menu";
import Button from "../components/ui/Button"; // your custom button, or use ChakraButton
import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function ProfilePage() {
  const { t } = useTranslation();
  const user_id = localStorage.getItem("id");
  const [rents, setRents] = useState([]);

  // For OTP modal & flow
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedRent, setSelectedRent] = useState(null);

  useEffect(() => {
    if (user_id) {
      axios
        .get(`http://127.0.0.1:8000/api/users/${user_id}/rents`)
        .then((response) => {
          setRents(response.data.data);
        })
        .catch((error) => console.error("Error fetching rents:", error));
    }
  }, [user_id]);

  const handleSendOtp = async () => {
    try {
      const email = localStorage.getItem("email");
      const res = await axios.post("http://127.0.0.1:8000/api/send-otp", {
        email,
      });
      if (res.data.success) {
        setOtpSent(true);
      } else {
        alert("Failed to send OTP. Try again.");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      alert("Failed to send OTP. Try again.");
    }
  };

  const handleVerifyOtpAndPay = async () => {
    setIsVerifying(true);
    try {
      const email = localStorage.getItem("email");
      const res = await axios.post("http://127.0.0.1:8000/api/verify-otp", {
        email,
        otp: enteredOtp,
      });
      console.error(res.data);
      if (res.data.valid) {
        onClose();
        if (selectedRent) {
          await executeRazorpayPayment(selectedRent);
        }
      } else {
        alert("❌ Invalid OTP");
      }
    } catch (err) {
      console.error("Verification error:", err);
      alert("OTP verification failed. Try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const executeRazorpayPayment = async (rent) => {
    try {
      const rentalDate = new Date(rent.rental_date);
      const returnDate = new Date(rent.return_date);
      const diffTime = Math.abs(returnDate - rentalDate);
      const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const totalAmount = rent.car.price * totalDays;

      if (totalAmount > 500000) {
        alert("❌ Amount exceeds Razorpay limit of ₹5,00,000 per transaction.");
        return;
      }

      // Create order on backend
      const orderResponse = await axios.post(
        "http://127.0.0.1:8000/api/create-order",
        {
          amount: totalAmount * 100,
        }
      );

      const { order } = orderResponse.data;

      const options = {
        key: "rzp_test_RQ7GZl3N5AnP3N", // your Razorpay key
        amount: order, 
        currency: "INR",
        name: "Car Rental Payment",
        description: `Payment for ${rent.car.brand} ${rent.car.model}`,
        order_id: order.id,
        handler: function (response) {
          alert(`✅ Payment Successful!\nPayment ID: ${response.razorpay_payment_id}`);
          // Optionally notify backend about this payment success, e.g. via an API call
        },
        prefill: {
          name: `${localStorage.getItem("firstname") || ""} ${localStorage.getItem("lastname") || ""}`.trim() || "User",
          email: localStorage.getItem("email") || "user@example.com",
          contact: localStorage.getItem("telephone") || "9999999999",
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
          <Box w="90%">
            <HStack>
              <Heading size={["lg", "xl"]}>{t("profile.heading")}</Heading>
              <Spacer />
              {/* Put any profile drawer or edit button */}
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
                            <Button
                              onClick={() => {
                                setSelectedRent(rent);
                                setOtpSent(false);
                                setEnteredOtp("");
                                onOpen();
                              }}
                            >
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

      {/* OTP Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Verify Email Before Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!otpSent ? (
              <>
                <Text mb={2}>We will send an OTP to your email:</Text>
                <ChakraButton colorScheme="blue" onClick={handleSendOtp}>
                  Send OTP
                </ChakraButton>
              </>
            ) : (
              <>
                <Text mb={2}>Enter the OTP sent to your email:</Text>
                <Input
                  placeholder="OTP"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  mb={3}
                />
                <ChakraButton
                  colorScheme="green"
                  isLoading={isVerifying}
                  onClick={handleVerifyOtpAndPay}
                >
                  Verify & Pay
                </ChakraButton>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <ChakraButton variant="ghost" onClick={onClose}>
              Cancel
            </ChakraButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfilePage;