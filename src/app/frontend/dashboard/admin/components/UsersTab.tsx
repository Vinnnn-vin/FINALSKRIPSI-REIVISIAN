// src\app\frontend\dashboard\admin\components\UsersTab.tsx
"use client";

import {
  Card,
  Table,
  TextInput,
  Select,
  Button,
  Group,
  ActionIcon,
  Pagination,
  Text,
} from "@mantine/core";
import { IconEdit, IconTrash, IconKey, IconUserPlus } from "@tabler/icons-react";
import { User } from "../types/dashboard";

interface Props {
  users: User[];
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filterRole: string | null;
  setFilterRole: (v: string | null) => void;
  currentPage: number;
  setCurrentPage: (v: number) => void;
  itemsPerPage: number;
  handleUserEdit: (user: User) => void;
  setUserToDelete: (user: User | null) => void;
  resetUserPassword: (id: number) => void;
  setSelectedUser: (u: User | null) => void;
  resetUserForm: () => void;
}

const UsersTab = ({
  users,
  searchTerm,
  setSearchTerm,
  filterRole,
  setFilterRole,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  handleUserEdit,
  setUserToDelete,
  resetUserPassword,
  setSelectedUser,
  resetUserForm,
}: Props) => {
  // === Filter data ===
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole ? u.role === filterRole : true;
    return matchSearch && matchRole;
  });

  // === Pagination ===
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <Card shadow="sm" p="lg" radius="md" mb="lg">
      <Group justify="space-between" mb="md">
        <Group>
          <TextInput
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
          />
          <Select
            placeholder="Filter by role"
            value={filterRole}
            onChange={setFilterRole}
            data={[
              { value: "student", label: "Student" },
              { value: "lecturer", label: "Lecturer" },
              { value: "admin", label: "Admin" },
            ]}
          />
        </Group>
        <Button
          leftSection={<IconUserPlus size={16} />}
          onClick={() => {
            resetUserForm();
            setSelectedUser({} as User);
          }}
        >
          Create User
        </Button>
      </Group>

      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {paginatedUsers.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Text ta="center" c="dimmed">
                  No users found
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            paginatedUsers.map((user) => (
              <Table.Tr key={user.user_id}>
                <Table.Td>
                  {user.first_name} {user.last_name}
                </Table.Td>
                <Table.Td>{user.email}</Table.Td>
                <Table.Td>{user.role}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon
                      color="blue"
                      onClick={() => handleUserEdit(user)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      color="orange"
                      onClick={() => resetUserPassword(user.user_id)}
                    >
                      <IconKey size={16} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      onClick={() => setUserToDelete(user)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>

      {totalPages > 1 && (
        <Group justify="center" mt="md">
          <Pagination
            value={currentPage}
            onChange={setCurrentPage}
            total={totalPages}
          />
        </Group>
      )}
    </Card>
  );
};

export default UsersTab;
