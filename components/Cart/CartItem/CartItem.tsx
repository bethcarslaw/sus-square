import {
  Button,
  Heading,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CartItem, useCart } from "@hooks/useCart";
import { toGBP } from "@util/index";
import { useMemo } from "react";

interface CartItemProps {
  item: CartItem;
}

const CartItem = ({ item }: CartItemProps) => {
  const { addToCart, removeFromCart } = useCart();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const variation = useMemo(
    () => item.variations.find((v) => v.id === item.variation.id),
    [item]
  );

  console.log(item);
  const handleRemoveItem = () => {
    removeFromCart(item, item.variation.quantity);
  };

  return (
    <Stack direction="row" spacing={10}>
      <Image
        src={item.image_urls[0] || "/images/default-img.jpg"}
        alt={item.name}
        h="250px"
        w="250px"
        objectFit="cover"
      />
      <Stack spacing={6}>
        <Heading>{item.name}</Heading>
        <Text>{variation.name}</Text>
        <HStack justify="space-between" maxW="250px">
          <HStack>
            <Button size="sm" onClick={() => removeFromCart(item, 1)}>
              <FontAwesomeIcon icon={faMinus} />
            </Button>
            <Text>{item.variation.quantity}</Text>
            <Button
              size="sm"
              onClick={() => addToCart(item)}
              disabled={item.variation.quantity >= variation.stock}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </HStack>

          <Button size="sm" colorScheme="red" onClick={onOpen}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </HStack>
        <Stack>
          <Text>
            {toGBP(
              parseInt(variation.price as string) * item.variation.quantity
            )}
          </Text>
          <Text as="span" fontSize="xs" opacity="0.7">
            {toGBP(variation.price as string)} each
          </Text>
        </Stack>
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Please Confirm</ModalHeader>
          <ModalBody>
            Are you sure you want to remove {item.name} {`(${variation.name})`}{" "}
            from your cart?
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="green"
              mr={3}
              onClick={() => handleRemoveItem()}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export { CartItem };
