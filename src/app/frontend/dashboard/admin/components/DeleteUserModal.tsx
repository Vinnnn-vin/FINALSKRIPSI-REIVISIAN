// src\app\frontend\dashboard\admin\components\DeleteUserModal.tsx

"use client";

import { Modal, Text, Button, Group } from "@mantine/core";
import { User } from "../types/dashboard";

interface Props {
  userToDelete: User | null;
  setUserToDelete: (u: User | null) => void;
  handleUserDelete: () => void;
}

const DeleteUserModal = ({
  userToDelete,
  setUserToDelete,
  handleUserDelete,
}: Props) => {
  return (
    <Modal
      opened={!!userToDelete}
      onClose={() => setUserToDelete(null)}
      title="Confirm Delete"
      centered
    >
      <Text>
        Are you sure you want to delete user{" "}
        <strong>
          {userToDelete?.first_name} {userToDelete?.last_name}
        </strong>{" "}
        ({userToDelete?.email})?
      </Text>

      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={() => setUserToDelete(null)}>
          Cancel
        </Button>
        <Button color="red" onClick={handleUserDelete}>
          Delete
        </Button>
      </Group>
    </Modal>
  );
};

export default DeleteUserModal;
