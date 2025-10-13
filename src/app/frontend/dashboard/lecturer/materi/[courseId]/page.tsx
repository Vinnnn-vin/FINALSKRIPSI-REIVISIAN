/* eslint-disable @typescript-eslint/no-explicit-any */
// // src\app\frontend\dashboard\lecturer\materi\[courseId]\page.tsx
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import React, { useState, useEffect, useCallback } from "react";
// import {
//   Container,
//   Title,
//   Text,
//   Button,
//   Card,
//   Group,
//   Stack,
//   Accordion,
//   ActionIcon,
//   Center,
//   Loader,
//   Alert,
//   Breadcrumbs,
//   Anchor,
//   Paper,
//   Badge,
//   Modal,
//   Textarea,
//   TextInput,
//   Switch,
// } from "@mantine/core";
// import {
//   IconEdit,
//   IconTrash,
//   IconPlus,
//   IconVideo,
//   IconFileText,
//   IconAlertCircle,
//   IconChevronRight,
//   IconLink,
//   IconBook,
//   IconClipboardText,
// } from "@tabler/icons-react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import { ProtectedRoute } from "@/app/frontend/components/auth/ProtectedRoute";
// import { useDisclosure } from "@mantine/hooks";
// import { useForm } from "@mantine/form";
// import { notifications } from "@mantine/notifications";

// // ==== TIPE DATA ====
// interface MaterialDetail {
//   material_detail_id: number;
//   material_detail_name: string;
//   material_detail_description?: string;
//   material_detail_type: number; // 1: Video, 2: PDF, 3: URL, 4: Assignment
//   is_free: boolean;
// }

// interface Quiz {
//   quiz_id: number;
//   quiz_title: string;
//   quiz_description?: string;
// }

// interface Material {
//   material_id: number;
//   material_name: string;
//   material_description: string;
//   details: MaterialDetail[];
//   quizzes: Quiz[];
// }

// // ==== PAGE ====
// const ViewMaterialsPage = () => {
//   const params = useParams();
//   const courseId = params.courseId as string;

//   const [courseTitle, setCourseTitle] = useState("");
//   const [materials, setMaterials] = useState<Material[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Modal Bab
//   const [editBabModal, { open: openEditBab, close: closeEditBab }] =
//     useDisclosure(false);
//   const [deleteBabModal, { open: openDeleteBab, close: closeDeleteBab }] =
//     useDisclosure(false);
//   const [editingBab, setEditingBab] = useState<Material | null>(null);
//   const [deletingBab, setDeletingBab] = useState<Material | null>(null);

//   // Modal Pelajaran
//   const [
//     editPelajaranModal,
//     { open: openEditPelajaran, close: closeEditPelajaran },
//   ] = useDisclosure(false);
//   const [
//     deletePelajaranModal,
//     { open: openDeletePelajaran, close: closeDeletePelajaran },
//   ] = useDisclosure(false);
//   const [editingPelajaran, setEditingPelajaran] =
//     useState<MaterialDetail | null>(null);
//   const [deletingPelajaran, setDeletingPelajaran] =
//     useState<MaterialDetail | null>(null);

//   // Form Edit Bab
//   const babForm = useForm({
//     initialValues: { material_name: "", material_description: "" },
//     validate: {
//       material_name: (value) =>
//         value.trim().length < 3 ? "Nama bab minimal 3 karakter" : null,
//     },
//   });

//   // Form Edit Pelajaran
//   const pelajaranForm = useForm({
//     initialValues: {
//       material_detail_name: "",
//       material_detail_description: "",
//       is_free: false,
//     },
//     validate: {
//       material_detail_name: (value) =>
//         value.trim().length === 0 ? "Judul pelajaran tidak boleh kosong" : null,
//     },
//   });

//   // Fetch data
//   const fetchData = useCallback(async () => {
//     if (!courseId) return;
//     setIsLoading(true);
//     try {
//       const response = await fetch(
//         `/api/dashboard/lecturer/materi/${courseId}`
//       );
//       if (!response.ok) throw new Error("Gagal memuat materi dari server.");
//       const data = await response.json();
//       setCourseTitle(data.course_title || data.courseTitle || "Tanpa Judul");
//       setMaterials(data.materials || []);
//     } catch (e: any) {
//       setError(e.message);
//       notifications.show({
//         title: "Error",
//         message: "Gagal memuat data.",
//         color: "red",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [courseId]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   // ==== HELPERS ====
//   const getContentTypeIcon = (type: number) => {
//     switch (type) {
//       case 1:
//         return <IconVideo size={16} color="blue" />;
//       case 2:
//         return <IconFileText size={16} color="red" />;
//       case 3:
//         return <IconLink size={16} color="green" />;
//       case 4:
//         return <IconClipboardText size={16} color="orange" />;
//       default:
//         return <IconBook size={16} />;
//     }
//   };
//   const getContentTypeLabel = (type: number) => {
//     switch (type) {
//       case 1:
//         return "Video";
//       case 2:
//         return "PDF";
//       case 3:
//         return "URL";
//       case 4:
//         return "Assignment";
//       default:
//         return "Unknown";
//     }
//   };

//   // --- Handlers Bab ---
//   const handleEditBabClick = (bab: Material) => {
//     setEditingBab(bab);
//     babForm.setValues({
//       material_name: bab.material_name,
//       material_description: bab.material_description || "",
//     });
//     openEditBab();
//   };
//   const handleDeleteBabClick = (bab: Material) => {
//     setDeletingBab(bab);
//     openDeleteBab();
//   };
//   const submitEditBab = async (values: typeof babForm.values) => {
//     if (!editingBab) return;
//     setIsSubmitting(true);
//     try {
//       const res = await fetch(
//         `/api/dashboard/lecturer/materials/${editingBab.material_id}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(values),
//         }
//       );
//       if (!res.ok) throw new Error("Gagal update bab");
//       setMaterials((prev) =>
//         prev.map((b) =>
//           b.material_id === editingBab.material_id ? { ...b, ...values } : b
//         )
//       );
//       notifications.show({
//         title: "Success",
//         message: "Bab diperbarui",
//         color: "green",
//       });
//       closeEditBab();
//     } catch (err: any) {
//       notifications.show({
//         title: "Error",
//         message: err.message,
//         color: "red",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   const submitDeleteBab = async () => {
//     if (!deletingBab) return;
//     setIsSubmitting(true);
//     try {
//       const res = await fetch(
//         `/api/dashboard/lecturer/materials/${deletingBab.material_id}`,
//         { method: "DELETE" }
//       );
//       if (!res.ok) throw new Error("Gagal hapus bab");
//       setMaterials((prev) =>
//         prev.filter((b) => b.material_id !== deletingBab.material_id)
//       );
//       notifications.show({
//         title: "Success",
//         message: "Bab dihapus",
//         color: "green",
//       });
//       closeDeleteBab();
//     } catch (err: any) {
//       notifications.show({
//         title: "Error",
//         message: err.message,
//         color: "red",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // --- Handlers Pelajaran ---
//   const handleEditPelajaranClick = (pel: MaterialDetail) => {
//     setEditingPelajaran(pel);
//     pelajaranForm.setValues({
//       material_detail_name: pel.material_detail_name,
//       material_detail_description: pel.material_detail_description || "",
//       is_free: pel.is_free,
//     });
//     openEditPelajaran();
//   };
//   const handleDeletePelajaranClick = (pel: MaterialDetail) => {
//     setDeletingPelajaran(pel);
//     openDeletePelajaran();
//   };
//   const submitEditPelajaran = async (values: typeof pelajaranForm.values) => {
//     if (!editingPelajaran) return;
//     setIsSubmitting(true);
//     try {
//       const res = await fetch(
//         `/api/dashboard/lecturer/material-details/${editingPelajaran.material_detail_id}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(values),
//         }
//       );
//       if (!res.ok) throw new Error("Gagal update pelajaran");
//       const updated = await res.json();
//       setMaterials((prev) =>
//         prev.map((bab) => ({
//           ...bab,
//           details: bab.details.map((p) =>
//             p.material_detail_id === updated.materialDetail.material_detail_id
//               ? updated.materialDetail
//               : p
//           ),
//         }))
//       );
//       notifications.show({
//         title: "Success",
//         message: "Pelajaran diperbarui",
//         color: "green",
//       });
//       closeEditPelajaran();
//     } catch (err: any) {
//       notifications.show({
//         title: "Error",
//         message: err.message,
//         color: "red",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   const submitDeletePelajaran = async () => {
//     if (!deletingPelajaran) return;
//     setIsSubmitting(true);
//     try {
//       const res = await fetch(
//         `/api/dashboard/lecturer/material-details/${deletingPelajaran.material_detail_id}`,
//         { method: "DELETE" }
//       );
//       if (!res.ok) throw new Error("Gagal hapus pelajaran");
//       setMaterials((prev) =>
//         prev.map((bab) => ({
//           ...bab,
//           details: bab.details.filter(
//             (p) => p.material_detail_id !== deletingPelajaran.material_detail_id
//           ),
//         }))
//       );
//       notifications.show({
//         title: "Success",
//         message: "Pelajaran dihapus",
//         color: "green",
//       });
//       closeDeletePelajaran();
//     } catch (err: any) {
//       notifications.show({
//         title: "Error",
//         message: err.message,
//         color: "red",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isLoading)
//     return (
//       <Center h="80vh">
//         <Loader />
//       </Center>
//     );
//   if (error)
//     return (
//       <Container py="xl">
//         <Alert color="red" icon={<IconAlertCircle />}>
//           {error}
//         </Alert>
//       </Container>
//     );

//   return (
//     <ProtectedRoute role="lecturer">
//       {/* ==== MODAL Bab ==== */}
//       <Modal
//         opened={editBabModal}
//         onClose={closeEditBab}
//         title="Edit Bab"
//         centered
//       >
//         <form onSubmit={babForm.onSubmit(submitEditBab)}>
//           <Stack>
//             <TextInput
//               label="Nama Bab"
//               required
//               {...babForm.getInputProps("material_name")}
//             />
//             <Textarea
//               label="Deskripsi Bab"
//               minRows={3}
//               {...babForm.getInputProps("material_description")}
//             />
//             <Group justify="flex-end">
//               <Button variant="default" onClick={closeEditBab}>
//                 Batal
//               </Button>
//               <Button type="submit" loading={isSubmitting}>
//                 Simpan
//               </Button>
//             </Group>
//           </Stack>
//         </form>
//       </Modal>
//       <Modal
//         opened={deleteBabModal}
//         onClose={closeDeleteBab}
//         title="Hapus Bab"
//         centered
//         size="sm"
//       >
//         <Text>
//           Yakin hapus bab <b>{deletingBab?.material_name}</b>?
//         </Text>
//         <Group justify="flex-end" mt="md">
//           <Button variant="default" onClick={closeDeleteBab}>
//             Batal
//           </Button>
//           <Button color="red" onClick={submitDeleteBab} loading={isSubmitting}>
//             Hapus
//           </Button>
//         </Group>
//       </Modal>

//       {/* ==== MODAL Pelajaran ==== */}
//       <Modal
//         opened={editPelajaranModal}
//         onClose={closeEditPelajaran}
//         title="Edit Pelajaran"
//         centered
//       >
//         <form onSubmit={pelajaranForm.onSubmit(submitEditPelajaran)}>
//           <Stack>
//             <TextInput
//               label="Judul Pelajaran"
//               required
//               {...pelajaranForm.getInputProps("material_detail_name")}
//             />
//             <Textarea
//               label="Deskripsi"
//               minRows={3}
//               {...pelajaranForm.getInputProps("material_detail_description")}
//             />
//             <Switch
//               label="Gratis"
//               {...pelajaranForm.getInputProps("is_free", { type: "checkbox" })}
//             />
//             <Group justify="flex-end">
//               <Button variant="default" onClick={closeEditPelajaran}>
//                 Batal
//               </Button>
//               <Button type="submit" loading={isSubmitting}>
//                 Simpan
//               </Button>
//             </Group>
//           </Stack>
//         </form>
//       </Modal>
//       <Modal
//         opened={deletePelajaranModal}
//         onClose={closeDeletePelajaran}
//         title="Hapus Pelajaran"
//         centered
//         size="sm"
//       >
//         <Text>
//           Yakin hapus pelajaran <b>{deletingPelajaran?.material_detail_name}</b>
//           ?
//         </Text>
//         <Group justify="flex-end" mt="md">
//           <Button variant="default" onClick={closeDeletePelajaran}>
//             Batal
//           </Button>
//           <Button
//             color="red"
//             onClick={submitDeletePelajaran}
//             loading={isSubmitting}
//           >
//             Hapus
//           </Button>
//         </Group>
//       </Modal>

//       {/* ==== CONTENT ==== */}
//       <Container size="lg" py="xl">
//         <Stack gap="xl">
//           <Breadcrumbs separator={<IconChevronRight size={14} />}>
//             <Anchor component={Link} href="/frontend/dashboard/lecturer">
//               Dashboard
//             </Anchor>
//             <Anchor component={Link} href="#">
//               Course Materials
//             </Anchor>
//           </Breadcrumbs>
//           <Group justify="space-between">
//             <Stack gap={0}>
//               <Title order={2}>Manajemen Materi</Title>
//               <Text c="dimmed">Untuk Kursus: {courseTitle}</Text>
//             </Stack>
//             <Button
//               component={Link}
//               href={`/frontend/dashboard/lecturer/materi?courseId=${courseId}`}
//               leftSection={<IconPlus size={16} />}
//             >
//               Tambah Bab Baru
//             </Button>
//           </Group>

//           {materials.length === 0 ? (
//             <Card withBorder p="xl" ta="center">
//               <Text fw={500}>Belum ada materi</Text>
//             </Card>
//           ) : (
//             <Accordion variant="separated">
//               {materials.map((material) => (
//                 <Accordion.Item
//                   key={material.material_id}
//                   value={String(material.material_id)}
//                 >
//                   <Accordion.Control>
//                     <Group justify="space-between">
//                       <Stack gap={0}>
//                         <Text fw={500}>{material.material_name}</Text>
//                         <Text size="xs" c="dimmed">
//                           {material.material_description}
//                         </Text>
//                       </Stack>

//                       {/* IMPORTANT: prevent nested <button> by rendering icons as non-button elements
//                           and ensuring clicks do not propagate to the Accordion.Control */}
//                       <Group
//                         gap="xs"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                         }}
//                       >
//                         <ActionIcon
//                           component="div"
//                           variant="light"
//                           color="blue"
//                           onClick={(e: any) => {
//                             e.stopPropagation();
//                             handleEditBabClick(material);
//                           }}
//                           role="button"
//                           tabIndex={0}
//                           aria-label={`Edit bab ${material.material_name}`}
//                         >
//                           <IconEdit size={16} />
//                         </ActionIcon>

//                         <ActionIcon
//                           component="div"
//                           variant="light"
//                           color="red"
//                           onClick={(e: any) => {
//                             e.stopPropagation();
//                             handleDeleteBabClick(material);
//                           }}
//                           role="button"
//                           tabIndex={0}
//                           aria-label={`Delete bab ${material.material_name}`}
//                         >
//                           <IconTrash size={16} />
//                         </ActionIcon>
//                       </Group>
//                     </Group>
//                   </Accordion.Control>

//                   <Accordion.Panel>
//                     <Stack>
//                       {(material.details || []).map((detail) => (
//                         <Paper
//                           key={detail.material_detail_id}
//                           withBorder
//                           p="sm"
//                         >
//                           <Group justify="space-between">
//                             <Group>
//                               {getContentTypeIcon(detail.material_detail_type)}
//                               <Stack gap={0}>
//                                 <Text size="sm" fw={500}>
//                                   {detail.material_detail_name}
//                                 </Text>
//                                 {detail.material_detail_description && (
//                                   <Text size="xs" c="dimmed">
//                                     {detail.material_detail_description}
//                                   </Text>
//                                 )}
//                                 <Badge size="xs">
//                                   {getContentTypeLabel(
//                                     detail.material_detail_type
//                                   )}
//                                 </Badge>
//                                 {detail.is_free && (
//                                   <Badge size="xs" color="green">
//                                     Gratis
//                                   </Badge>
//                                 )}
//                               </Stack>
//                             </Group>
//                             <Group gap="xs">
//                               <ActionIcon
//                                 variant="subtle"
//                                 color="blue"
//                                 onClick={() => handleEditPelajaranClick(detail)}
//                               >
//                                 <IconEdit size={14} />
//                               </ActionIcon>
//                               <ActionIcon
//                                 variant="subtle"
//                                 color="red"
//                                 onClick={() =>
//                                   handleDeletePelajaranClick(detail)
//                                 }
//                               >
//                                 <IconTrash size={14} />
//                               </ActionIcon>
//                             </Group>
//                           </Group>
//                         </Paper>
//                       ))}
//                     </Stack>
//                   </Accordion.Panel>
//                 </Accordion.Item>
//               ))}
//             </Accordion>
//           )}
//         </Stack>
//       </Container>
//     </ProtectedRoute>
//   );
// };

// export default ViewMaterialsPage;

"use client";
import React, { useState, useEffect, useCallback } from "react";
// import {
//   DndContext,
//   closestCenter,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from "@dnd-kit/core";
// import {
//   SortableContext,
//   verticalListSortingStrategy,
//   arrayMove,
// } from "@dnd-kit/sortable";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Center,
  Loader,
  Alert,
  Breadcrumbs,
  Anchor,
  Modal,
  Tabs,
  Paper,
  TextInput,
  Textarea,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconChevronRight,
  IconPlus,
  IconCheck,
} from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProtectedRoute } from "@/app/frontend/components/auth/ProtectedRoute";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

// Import komponen form dan tipe data
import ContentForm from "../../components/materi/ContentForm";
import QuizBuilder from "../../components/materi/QuizBuilder";
import AssignmentForm from "../../components/materi/AssignmentForm";
import BabList from "../../components/materi/BabList";
import { useQuizBuilder } from "../../hooks/useQuizBuilder";
import {
  BabType,
  ContentItemType,
  MaterialType,
  MaterialDetailType,
  QuizType,
} from "../../types/material";

// ==== PAGE ====
const ManageMaterialsPage = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [courseTitle, setCourseTitle] = useState("");
  const [materials, setMaterials] = useState<BabType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newBabName, setNewBabName] = useState("");
  const [newBabDescription, setNewBabDescription] = useState("");

  const [modalOpened, { open: openModal, close: baseCloseModal }] =
    useDisclosure(false);
  const [editingBabId, setEditingBabId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<ContentItemType | null>(
    null
  );
  const quizBuilder = useQuizBuilder();

  const [activeTabInModal, setActiveTabInModal] = useState<string | null>(
    "lesson"
  );

  const localStorageKey = `curriculum_draft_${courseId}`;

  useEffect(() => {
    // Jangan simpan saat loading awal untuk menghindari menimpa data API
    if (!isLoading) {
      localStorage.setItem(localStorageKey, JSON.stringify(materials));
    }
  }, [materials, isLoading, localStorageKey]);

  // Fetch data awal
  const fetchData = useCallback(async () => {
    if (!courseId) return;
    setIsLoading(true);

    const savedDraft = localStorage.getItem(localStorageKey);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        if (Array.isArray(parsedDraft)) {
          setMaterials(parsedDraft);
          // Kita tetap perlu mengambil judul kursus dari API
          const response = await fetch(
            `/api/dashboard/lecturer/materi/${courseId}`
          );
          const data = await response.json();
          setCourseTitle(data.course_title || "Tanpa Judul");
          setIsLoading(false);
          notifications.show({
            title: "Draf Ditemukan",
            message:
              "Melanjutkan sesi pengerjaan kurikulum yang belum tersimpan.",
            color: "blue",
          });
          return; // Hentikan eksekusi agar tidak fetch data materi dari API
        }
      } catch (e) {
        console.error("Gagal memuat draf dari localStorage", e);
      }
    }

    try {
      const response = await fetch(
        `/api/dashboard/lecturer/materi/${courseId}`
      );
      if (!response.ok) throw new Error("Gagal memuat materi dari server.");
      const data = await response.json();
      setCourseTitle(data.course_title || "Tanpa Judul");

      const transformedMaterials = (data.materials || []).map(
        (mat: MaterialType) => ({
          id: `bab-${mat.material_id}`,
          name: mat.material_name,
          description: mat.material_description,
          items: [
            ...(mat.details || []).map((detail: MaterialDetailType) => ({
              id: `content-${detail.material_detail_id}`,
              type: detail.material_detail_type === 4 ? "assignment" : "lesson",
              name: detail.material_detail_name,
              title: detail.material_detail_name,
              description: detail.material_detail_description,
              instructions: detail.material_detail_description,
              lessonType:
                detail.material_detail_type === 1
                  ? "video"
                  : detail.material_detail_type === 2
                  ? "pdf"
                  : "url",
              url: detail.materi_detail_url,
              isFree: detail.is_free,
            })),
            ...(mat.quizzes || []).map((quiz: QuizType) => ({
              id: `quiz-${quiz.quiz_id}`,
              type: "quiz",
              title: quiz.quiz_title,
              description: quiz.quiz_description,
              questions: [],
              passing_score: 70,
              time_limit: 60,
              max_attempts: 3,
            })),
          ],
        })
      );
      setMaterials(transformedMaterials);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Handlers ---
  const handleAddBab = () => {
    if (!newBabName.trim()) {
      notifications.show({
        title: "Nama Bab Kosong",
        message: "Judul bab tidak boleh kosong.",
        color: "orange",
      });
      return;
    }
    const newBab: BabType = {
      id: `bab-${Date.now()}`,
      name: newBabName,
      description: newBabDescription,
      items: [],
    };
    setMaterials((prev) => [...prev, newBab]);
    setNewBabName("");
    setNewBabDescription("");
  };

  const handleCloseModal = useCallback(() => {
    baseCloseModal();
    setEditingContent(null);
    setEditingBabId(null);
    setActiveTabInModal("lesson");
  }, [baseCloseModal]);

  const handleOpenContentModal = (babId: string, content?: ContentItemType) => {
    setEditingBabId(babId);
    if (content) {
      setEditingContent(content);
      setActiveTabInModal(content.type); // Set tab sesuai tipe konten yang diedit
    } else {
      setEditingContent(null);
      setActiveTabInModal("lesson"); // Default ke tab 'lesson' saat menambah baru
    }
    openModal();
  };

  // [FIX 3] Gunakan useCallback untuk menstabilkan fungsi handler agar tidak dibuat ulang setiap render
  const handleAddNewContent = useCallback(
    (newItem: ContentItemType) => {
      if (!editingBabId) return;
      setMaterials((prev) =>
        prev.map((b) =>
          b.id === editingBabId ? { ...b, items: [...b.items, newItem] } : b
        )
      );
      handleCloseModal();
    },
    [editingBabId, handleCloseModal]
  );

  const handleUpdateContent = useCallback(
    (updatedItem: ContentItemType) => {
      if (!editingBabId) return;
      setMaterials((prevBabs) =>
        prevBabs.map((bab) =>
          bab.id === editingBabId
            ? {
                ...bab,
                items: bab.items.map((item) =>
                  item.id === updatedItem.id ? updatedItem : item
                ),
              }
            : bab
        )
      );
      handleCloseModal();
    },
    [editingBabId, handleCloseModal]
  );

  const handleSaveAll = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/dashboard/lecturer/courses/${courseId}/materials`,
        {
          method: "POST", // Seharusnya PUT, tapi kita sesuaikan dengan kode yang ada
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ babs: materials }),
        }
      );
      if (!response.ok) throw new Error("Gagal menyimpan perubahan.");

      localStorage.removeItem(localStorageKey);

      notifications.show({
        title: "Sukses!",
        message: "Kurikulum berhasil disimpan.",
        color: "green",
      });

      router.push(`/frontend/dashboard/lecturer/materi/${courseId}`);
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <Center h="80vh">
        <Loader />
      </Center>
    );
  if (error)
    return (
      <Container py="xl">
        <Alert color="red" icon={<IconAlertCircle />}>
          {error}
        </Alert>
      </Container>
    );

  return (
    <ProtectedRoute role="lecturer">
      <Modal
        opened={modalOpened}
        onClose={handleCloseModal}
        title={editingContent ? "Edit Konten" : "Tambah Konten Baru"}
        centered
        size="xl"
      >
        {/* [FIX 4] Hubungkan state tab ke komponen Tabs */}
        <Tabs value={activeTabInModal} onChange={setActiveTabInModal}>
          <Tabs.List>
            <Tabs.Tab value="lesson">Pelajaran</Tabs.Tab>
            <Tabs.Tab value="quiz">Kuis</Tabs.Tab>
            <Tabs.Tab value="assignment">Tugas</Tabs.Tab>
          </Tabs.List>

          {/* [FIX 5] Gunakan fungsi handler yang sudah stabil */}
          <Tabs.Panel value="lesson" pt="md">
            <ContentForm
              onAddContent={handleAddNewContent}
              onUpdateContent={handleUpdateContent}
              initialData={editingContent}
            />
          </Tabs.Panel>
          <Tabs.Panel value="quiz" pt="md">
            <QuizBuilder
              {...quizBuilder}
              onAddQuiz={handleAddNewContent}
              onUpdateQuiz={handleUpdateContent}
              initialData={editingContent}
            />
          </Tabs.Panel>
          <Tabs.Panel value="assignment" pt="md">
            <AssignmentForm
              onAddAssignment={handleAddNewContent}
              onUpdateAssignment={handleUpdateContent}
              initialData={editingContent}
            />
          </Tabs.Panel>
        </Tabs>
      </Modal>

      <Container size="lg" py="xl">
        <Stack gap="xl">
          <Breadcrumbs separator={<IconChevronRight size={14} />}>
            <Anchor component={Link} href="/frontend/dashboard/lecturer">
              Dashboard
            </Anchor>
            <Text>Curriculum</Text>
          </Breadcrumbs>

          <Group justify="space-between">
            <Stack gap={0}>
              <Title order={2}>Manajemen Kurikulum</Title>
              <Text c="dimmed">Untuk Kursus: {courseTitle}</Text>
            </Stack>
            <Button
              onClick={handleSaveAll}
              loading={isSubmitting}
              leftSection={<IconCheck size={16} />}
            >
              Simpan Perubahan
            </Button>
          </Group>

          <BabList
            babs={materials}
            setBabs={setMaterials}
            onOpenContentModal={handleOpenContentModal}
          />

          <Paper withBorder p="lg" radius="md" mt="xl">
            <Stack>
              <Title order={4}>Tambah Bab Baru</Title>
              <TextInput
                label="Judul Bab"
                placeholder="Contoh: Bab 1 - Pengenalan"
                value={newBabName}
                onChange={(e) => setNewBabName(e.currentTarget.value)}
              />
              <Textarea
                label="Deskripsi Bab (Opsional)"
                placeholder="Jelaskan singkat isi bab ini..."
                value={newBabDescription}
                onChange={(e) => setNewBabDescription(e.currentTarget.value)}
                minRows={2}
              />
              <Button
                onClick={handleAddBab}
                leftSection={<IconPlus size={16} />}
              >
                Tambah Bab
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </ProtectedRoute>
  );
};

export default ManageMaterialsPage;
