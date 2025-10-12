/* eslint-disable @typescript-eslint/no-explicit-any */
// src\app\frontend\dashboard\admin\components\CourseModal.tsx

"use client";
import {
  Modal,
  TextInput,
  Textarea,
  Select,
  NumberInput,
  Button,
  Group,
} from "@mantine/core";
import { Course } from "../types/dashboard";

interface Props {
  selectedCourse: Course | null;
  setSelectedCourse: (c: Course | null) => void;
  courseFormData: any;
  setCourseFormData: (data: any) => void;
  handleCourseSave: () => void;
  resetCourseForm: () => void;
  lecturers: { value: string; label: string }[];
}

const CourseModal = ({
  selectedCourse,
  setSelectedCourse,
  courseFormData,
  setCourseFormData,
  handleCourseSave,
  resetCourseForm,
  lecturers,
}: Props) => {
  const isEdit = selectedCourse && selectedCourse.course_id;

  const closeModal = () => {
    setSelectedCourse(null);
    resetCourseForm();
  };

  return (
    <Modal
      opened={!!selectedCourse}
      onClose={closeModal}
      title={isEdit ? "Edit Course" : "Create Course"}
      centered
    >
      <TextInput
        label="Course Title"
        value={courseFormData.course_title}
        onChange={(e) =>
          setCourseFormData({
            ...courseFormData,
            course_title: e.currentTarget.value,
          })
        }
        required
        mb="sm"
      />
      <Textarea
        label="Description"
        value={courseFormData.course_description}
        onChange={(e) =>
          setCourseFormData({
            ...courseFormData,
            course_description: e.currentTarget.value,
          })
        }
        required
        mb="sm"
        minRows={3}
      />
      {!isEdit && (
        <Select
          label="Instructor / Lecturer"
          placeholder="Select an instructor"
          data={lecturers}
          value={courseFormData.user_id}
          onChange={(value) =>
            setCourseFormData({ ...courseFormData, user_id: value || "" })
          }
          required
          searchable
          mb="sm"
        />
      )}
      <Select
        label="Level"
        value={courseFormData.course_level}
        onChange={(value) =>
          setCourseFormData({ ...courseFormData, course_level: value || "" })
        }
        data={["Beginner", "Intermediate", "Advanced"]}
        required
        mb="sm"
      />
      <NumberInput
        label="Price (IDR)"
        value={courseFormData.course_price}
        onChange={(value) =>
          setCourseFormData({ ...courseFormData, course_price: Number(value) })
        }
        min={0}
        required
        mb="sm"
      />

      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={closeModal}>
          Cancel
        </Button>
        <Button onClick={handleCourseSave} color="blue">
          {isEdit ? "Save Changes" : "Create Course"}
        </Button>
      </Group>
    </Modal>
  );
};

export default CourseModal;
