// src\app\frontend\dashboard\student\components\SearchFilters.tsx

"use client";

import { Group, TextInput, Select, Button } from "@mantine/core";
import { IconSearch, IconFilter, IconX } from "@tabler/icons-react";

interface SearchFiltersProps {
  searchTerm: string;
  filterLevel: string;
  sortBy: "title" | "price" | "level" | "progress";
  sortOrder: "asc" | "desc";
  onSearchChange: (term: string) => void;
  onLevelChange: (level: string) => void;
  onSortByChange: (sortBy: "title" | "price" | "level" | "progress") => void;
  onSortOrderChange: (order: "asc" | "desc") => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function SearchFilters({
  searchTerm,
  filterLevel,
  sortBy,
  sortOrder,
  onSearchChange,
  onLevelChange,
  onSortByChange,
  onSortOrderChange,
  onClearFilters,
  hasActiveFilters,
}: SearchFiltersProps) {
  return (
    <Group gap="md" grow wrap="wrap">
      {/* Search input */}
      <TextInput
        placeholder="Search courses..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.currentTarget.value)}
        leftSection={<IconSearch size={16} />}
        style={{ flex: 2 }}
      />

      {/* Filter by level */}
      <Select
        placeholder="Filter by level"
        value={filterLevel}
        onChange={(val) => onLevelChange(val || "all")}
        leftSection={<IconFilter size={16} />}
        data={[
          { value: "all", label: "All Levels" },
          { value: "Beginner", label: "Beginner" },
          { value: "intermediate", label: "Intermediate" },
          { value: "advanced", label: "Advanced" },
        ]}
        style={{ flex: 1 }}
        clearable
      />

      {/* Sort by */}
      <Select
        placeholder="Sort by"
        value={sortBy}
        onChange={(val) =>
          onSortByChange((val as "title" | "price" | "level" | "progress") || "title")
        }
        data={[
          { value: "title", label: "Title" },
          { value: "price", label: "Price" },
          { value: "level", label: "Level" },
          { value: "progress", label: "Progress" },
        ]}
        style={{ flex: 1 }}
      />

      {/* Sort order */}
      <Select
        placeholder="Order"
        value={sortOrder}
        onChange={(val) => onSortOrderChange((val as "asc" | "desc") || "asc")}
        data={[
          { value: "asc", label: "A-Z / Low-High" },
          { value: "desc", label: "Z-A / High-Low" },
        ]}
        style={{ flex: 1 }}
      />

      {/* Clear filters button */}
      {hasActiveFilters && (
        <Button
          color="red"
          variant="light"
          onClick={onClearFilters}
          leftSection={<IconX size={16} />}
          style={{ flexShrink: 0 }}
        >
          Clear
        </Button>
      )}
    </Group>
  );
}