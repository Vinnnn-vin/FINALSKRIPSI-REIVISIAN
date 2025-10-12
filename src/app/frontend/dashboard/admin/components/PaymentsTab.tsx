// src\app\frontend\dashboard\admin\components\PaymentsTab.tsx
"use client";

import {
  Card,
  Table,
  Group,
  Pagination,
  Text,
  Badge,
} from "@mantine/core";
import { Payment } from "../types/dashboard";
import { getStatusColor, getUserName } from "../utils/helpers";

interface Props {
  payments: Payment[];
  currentPage: number;
  setCurrentPage: (v: number) => void;
  itemsPerPage: number;
}

const PaymentsTab = ({
  payments,
  currentPage,
  setCurrentPage,
  itemsPerPage,
}: Props) => {
  // === Pagination ===
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = payments.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(payments.length / itemsPerPage);

  return (
    <Card shadow="sm" p="lg" radius="md" mb="lg">
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>User</Table.Th>
            <Table.Th>Course</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Method</Table.Th>
            <Table.Th>Paid At</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {paginatedPayments.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Text ta="center" c="dimmed">
                  No payments found
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            paginatedPayments.map((payment) => (
              <Table.Tr key={payment.payment_id}>
                <Table.Td>{getUserName(payment.user || payment.User)}</Table.Td>
                <Table.Td>
                  {payment.course?.course_title ||
                    payment.Course?.course_title}
                </Table.Td>
                <Table.Td>${payment.amount}</Table.Td>
                <Table.Td>
                  <Badge color={getStatusColor(payment.status)}>
                    {payment.status}
                  </Badge>
                </Table.Td>
                <Table.Td>{payment.payment_method}</Table.Td>
                <Table.Td>
                  {new Date(payment.created_at).toLocaleDateString()}
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

export default PaymentsTab;
