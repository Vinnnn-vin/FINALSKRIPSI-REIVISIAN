// src\app\frontend\dashboard\admin\components\UserModal.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Modal,
  TextInput,
  Select,
  PasswordInput,
  Button,
  Group,
} from "@mantine/core";
import { User } from "../types/dashboard";

interface Props {
  selectedUser: User | null;
  setSelectedUser: (u: User | null) => void;
  userFormData: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    password: string;
  };
  setUserFormData: (u: any) => void;
  handleUserCreate: () => void;
  handleUserSave: () => void;
  resetUserForm: () => void;
}

const UserModal = ({
  selectedUser,
  setSelectedUser,
  userFormData,
  setUserFormData,
  handleUserCreate,
  handleUserSave,
  resetUserForm,
}: Props) => {
  const isEdit = selectedUser && selectedUser.user_id;

  const closeModal = () => {
    setSelectedUser(null);
    resetUserForm();
  };

  return (
    <Modal
      opened={!!selectedUser}
      onClose={closeModal}
      title={isEdit ? "Edit User" : "Create User"}
      centered
    >
      <TextInput
        label="First Name"
        placeholder="Enter first name"
        value={userFormData.first_name}
        onChange={(e) =>
          setUserFormData({ ...userFormData, first_name: e.currentTarget.value })
        }
        required
        mb="sm"
      />

      <TextInput
        label="Last Name"
        placeholder="Enter last name"
        value={userFormData.last_name}
        onChange={(e) =>
          setUserFormData({ ...userFormData, last_name: e.currentTarget.value })
        }
        required
        mb="sm"
      />

      <TextInput
        label="Email"
        placeholder="Enter email"
        type="email"
        value={userFormData.email}
        onChange={(e) =>
          setUserFormData({ ...userFormData, email: e.currentTarget.value })
        }
        required
        mb="sm"
      />

      <Select
        label="Role"
        placeholder="Select role"
        value={userFormData.role}
        onChange={(value) =>
          setUserFormData({ ...userFormData, role: value || "" })
        }
        data={[
          { value: "student", label: "Student" },
          { value: "lecturer", label: "Lecturer" },
          { value: "admin", label: "Admin" },
        ]}
        required
        mb="sm"
      />

      {!isEdit && (
        <PasswordInput
          label="Password"
          placeholder="Enter password"
          value={userFormData.password}
          onChange={(e) =>
            setUserFormData({ ...userFormData, password: e.currentTarget.value })
          }
          required
          mb="sm"
        />
      )}

      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={closeModal}>
          Cancel
        </Button>
        <Button
          onClick={isEdit ? handleUserSave : handleUserCreate}
          color="blue"
        >
          {isEdit ? "Save Changes" : "Create User"}
        </Button>
      </Group>
    </Modal>
  );
};

export default UserModal;
