// src\app\frontend\auth\register\page.tsx
"use client";

import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Flex,
  Divider,
  Alert,
  Box,
  Transition,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { signIn, useSession } from "next-auth/react";
import { GoogleButton } from "@/app/frontend/components/GoogleButton";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session && !redirecting) {
      setRedirecting(true);

      setTimeout(() => {
        router.replace("/frontend/landing");
      }, 100);
    }
  }, [status, session, router, redirecting]);

  const handleRegister = async (values: typeof form.values) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.fields) {
          Object.entries(data.fields).forEach(([field, message]) => {
            form.setFieldError(field, message as string);
          });
          setError("Please correct the errors above and try again.");
        } else {
          setError(data.error || "Registration failed. Please try again.");
        }
        return;
      }

      setSuccess("Account created successfully! Signing you in...");

      // Delay to show success message, then sign in
      setTimeout(async () => {
        const result = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        if (result?.error) {
          setSuccess("");
          setError(
            "Account created, but failed to log in automatically. Please go to the login page."
          );
          return;
        }

        if (result?.ok) {
          setRedirecting(true);
          // Wait a bit for session to be established
          setTimeout(() => {
            router.replace("/frontend/landing");
          }, 500);
        }
      }, 1500);
    } catch (err) {
      const error = err as Error;
      console.error("Registration error:", error);
      setError(
        "Network error occurred. Please check your connection and try again."
      );
    } finally {
      if (!success) {
        setIsLoading(false);
      }
    }
  };

  // Loading state
  if (status === "loading" || redirecting) {
    return (
      <Flex
        h="100vh"
        align="center"
        justify="center"
        style={{
          background:
            "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)",
        }}
      >
        <Box ta="center">
          <Loader size="lg" color="white" />
          <Text c="white" mt="md" size="lg" fw={500}>
            {redirecting ? "Setting up your account..." : "Loading..."}
          </Text>
        </Box>
      </Flex>
    );
  }

  // Don't render register page for authenticated users
  if (status === "authenticated") {
    return null;
  }

  return (
    <Box
      h="100vh"
      style={{
        background:
          "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)",
        overflow: "hidden",
      }}
    >
      <style jsx global>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-slide-left {
          animation: slideInLeft 0.8s ease-out;
        }

        .animate-slide-right {
          animation: slideInRight 0.8s ease-out;
        }

        .animate-fade-up {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .form-container {
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }

        .image-container {
          animation: slideInLeft 0.8s ease-out;
        }

        .input-group {
          animation: fadeInUp 0.6s ease-out var(--delay, 0s) both;
        }

        .error-alert {
          border-left: 4px solid #dc2626 !important;
          background: linear-gradient(
            135deg,
            rgba(239, 68, 68, 0.1),
            rgba(220, 38, 38, 0.05)
          ) !important;
          backdrop-filter: blur(10px);
          animation: shake 0.5s ease-in-out;
        }

        .success-alert {
          border-left: 4px solid #059669 !important;
          background: linear-gradient(
            135deg,
            rgba(16, 185, 129, 0.1),
            rgba(5, 150, 105, 0.05)
          ) !important;
          backdrop-filter: blur(10px);
          animation: pulse 1s ease-in-out;
        }
      `}</style>

      <Flex h="100%">
        {/* Left Column: Image */}
        <Flex
          display={{ base: "none", md: "flex" }}
          flex={1}
          pos="relative"
          className="image-container"
          style={{
            background:
              "linear-gradient(135deg, rgba(30, 64, 175, 0.8), rgba(59, 130, 246, 0.8))",
          }}
        >
          <NextImage
            src="/SIGNIN.jpg"
            alt="Registration illustration"
            fill
            style={{
              objectFit: "cover",
              filter: "brightness(1.1) contrast(1.05)",
            }}
            priority
          />
          <Box
            pos="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            style={{
              background:
                "linear-gradient(135deg, rgba(30, 64, 175, 0.1), rgba(59, 130, 246, 0.2))",
              mixBlendMode: "overlay",
            }}
          />

          {/* Floating elements */}
          <Box
            pos="absolute"
            top="15%"
            left="10%"
            w={80}
            h={80}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              backdropFilter: "blur(10px)",
              animation: "float 5s ease-in-out infinite",
            }}
          />
          <Box
            pos="absolute"
            bottom="25%"
            left="15%"
            w={50}
            h={50}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "50%",
              backdropFilter: "blur(10px)",
              animation: "float 4s ease-in-out infinite 2s",
            }}
          />
        </Flex>

        {/* Right Column: Form */}
        <Flex
          flex={1}
          align="center"
          justify="center"
          p="md"
          className="animate-slide-right"
        >
          <Container size={500} w="100%">
            <Box className="form-container">
              <Box ta="center" mb="xl" className="animate-float">
                <Title
                  order={1}
                  size="h1"
                  fw={800}
                  mb="xs"
                  style={{
                    background: "linear-gradient(45deg, #ffffffff, #f7f7f7ff)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  Create Your Account
                </Title>
                <Text
                  size="sm"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontWeight: 500,
                  }}
                >
                  Already have an account?{" "}
                  <Text
                    component="a"
                    href="/frontend/auth/login"
                    style={{
                      color: "#fff",
                      textDecoration: "none",
                      fontWeight: 600,
                      borderBottom: "1px solid rgba(255,255,255,0.3)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.borderBottom = "1px solid #fff";
                      target.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.borderBottom =
                        "1px solid rgba(255,255,255,0.3)";
                      target.style.transform = "translateY(0)";
                    }}
                  >
                    Sign in
                  </Text>
                </Text>
              </Box>

              <Paper
                withBorder
                shadow="xl"
                p="xl"
                radius="xl"
                style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  transform: mounted ? "scale(1)" : "scale(0.9)",
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {/* Enhanced Error Alert */}
                <Transition
                  mounted={!!error}
                  transition="slide-down"
                  duration={400}
                  timingFunction="ease"
                >
                  {(styles) => (
                    <Alert
                      icon={<IconAlertCircle size={20} />}
                      title="Registration Failed"
                      color="red"
                      mb="lg"
                      radius="lg"
                      withCloseButton
                      onClose={() => setError("")}
                      closeButtonLabel="Close error alert"
                      className="error-alert"
                      styles={{
                        root: {
                          border: "2px solid #dc2626",
                          backgroundColor: "#fef2f2",
                        },
                        icon: {
                          color: "#dc2626",
                        },
                        title: {
                          color: "#991b1b",
                          fontWeight: 600,
                          fontSize: "14px",
                        },
                        body: {
                          color: "#7f1d1d",
                          fontWeight: 500,
                        },
                        closeButton: {
                          color: "#dc2626",
                          "&:hover": {
                            backgroundColor: "rgba(220, 38, 38, 0.1)",
                          },
                        },
                      }}
                      style={styles}
                    >
                      <Text size="sm" fw={500} c="#7f1d1d">
                        {error}
                      </Text>
                    </Alert>
                  )}
                </Transition>

                {/* Enhanced Success Alert */}
                <Transition
                  mounted={!!success}
                  transition="slide-down"
                  duration={400}
                  timingFunction="ease"
                >
                  {(styles) => (
                    <Alert
                      icon={<IconCheck size={20} />}
                      title="Success!"
                      color="green"
                      mb="lg"
                      radius="lg"
                      className="success-alert"
                      styles={{
                        root: {
                          border: "2px solid #059669",
                          backgroundColor: "#f0fdf4",
                        },
                        icon: {
                          color: "#059669",
                        },
                        title: {
                          color: "#065f46",
                          fontWeight: 600,
                          fontSize: "14px",
                        },
                        body: {
                          color: "#064e3b",
                          fontWeight: 500,
                        },
                      }}
                      style={styles}
                    >
                      <Text size="sm" fw={500} c="#064e3b">
                        {success}
                      </Text>
                    </Alert>
                  )}
                </Transition>

                <form onSubmit={form.onSubmit(handleRegister)}>
                  <Box
                    className="input-group"
                    style={{ "--delay": "0.1s" } as React.CSSProperties}
                    mb="md"
                  >
                    <Flex gap="md" wrap="wrap">
                      <Box flex={1}>
                        <TextInput
                          label="First name"
                          placeholder="John"
                          {...form.getInputProps("first_name")}
                          styles={{
                            label: {
                              fontWeight: 600,
                              marginBottom: "8px",
                              color: "#374151",
                            },
                            input: {
                              border: form.errors.first_name
                                ? "2px solid #dc2626"
                                : "2px solid #e5e7eb",
                              borderRadius: "12px",
                              padding: "12px 16px",
                              fontSize: "16px",
                              transition: "all 0.3s ease",
                              backgroundColor: form.errors.first_name
                                ? "#fef2f2"
                                : "white",
                              "&:focus": {
                                borderColor: form.errors.first_name
                                  ? "#dc2626"
                                  : "#3b82f6",
                                boxShadow: form.errors.first_name
                                  ? "0 0 0 3px rgba(220, 38, 38, 0.1)"
                                  : "0 0 0 3px rgba(59, 130, 246, 0.1)",
                                transform: "translateY(-1px)",
                              },
                              "&:hover": {
                                borderColor: form.errors.first_name
                                  ? "#dc2626"
                                  : "#d1d5db",
                              },
                            },
                          }}
                        />
                        {form.errors.first_name && (
                          <Text
                            size="sm"
                            c="#dc2626"
                            fw={600}
                            mt={6}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "8px 12px",
                              backgroundColor: "#fef2f2",
                              border: "1px solid #fecaca",
                              borderRadius: "8px",
                              animation: "shake 0.5s ease-in-out",
                            }}
                          >
                            <IconAlertCircle size={16} />
                            {form.errors.first_name}
                          </Text>
                        )}
                      </Box>

                      <Box flex={1}>
                        <TextInput
                          label="Last name"
                          placeholder="Doe"
                          {...form.getInputProps("last_name")}
                          styles={{
                            label: {
                              fontWeight: 600,
                              marginBottom: "8px",
                              color: "#374151",
                            },
                            input: {
                              border: form.errors.last_name
                                ? "2px solid #dc2626"
                                : "2px solid #e5e7eb",
                              borderRadius: "12px",
                              padding: "12px 16px",
                              fontSize: "16px",
                              transition: "all 0.3s ease",
                              backgroundColor: form.errors.last_name
                                ? "#fef2f2"
                                : "white",
                              "&:focus": {
                                borderColor: form.errors.last_name
                                  ? "#dc2626"
                                  : "#3b82f6",
                                boxShadow: form.errors.last_name
                                  ? "0 0 0 3px rgba(220, 38, 38, 0.1)"
                                  : "0 0 0 3px rgba(59, 130, 246, 0.1)",
                                transform: "translateY(-1px)",
                              },
                              "&:hover": {
                                borderColor: form.errors.last_name
                                  ? "#dc2626"
                                  : "#d1d5db",
                              },
                            },
                          }}
                        />
                        {form.errors.last_name && (
                          <Text
                            size="sm"
                            c="#dc2626"
                            fw={600}
                            mt={6}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "8px 12px",
                              backgroundColor: "#fef2f2",
                              border: "1px solid #fecaca",
                              borderRadius: "8px",
                              animation: "shake 0.5s ease-in-out",
                            }}
                          >
                            <IconAlertCircle size={16} />
                            {form.errors.last_name}
                          </Text>
                        )}
                      </Box>
                    </Flex>
                  </Box>

                  <Box
                    className="input-group"
                    style={{ "--delay": "0.2s" } as React.CSSProperties}
                    mb="md"
                  >
                    <TextInput
                      label="Email"
                      placeholder="your@email.com"
                      {...form.getInputProps("email")}
                      styles={{
                        label: {
                          fontWeight: 600,
                          marginBottom: "8px",
                          color: "#374151",
                        },
                        input: {
                          border: form.errors.email
                            ? "2px solid #dc2626"
                            : "2px solid #e5e7eb",
                          borderRadius: "12px",
                          padding: "12px 16px",
                          fontSize: "16px",
                          transition: "all 0.3s ease",
                          backgroundColor: form.errors.email
                            ? "#fef2f2"
                            : "white",
                          "&:focus": {
                            borderColor: form.errors.email
                              ? "#dc2626"
                              : "#3b82f6",
                            boxShadow: form.errors.email
                              ? "0 0 0 3px rgba(220, 38, 38, 0.1)"
                              : "0 0 0 3px rgba(59, 130, 246, 0.1)",
                            transform: "translateY(-1px)",
                          },
                          "&:hover": {
                            borderColor: form.errors.email
                              ? "#dc2626"
                              : "#d1d5db",
                          },
                        },
                      }}
                    />
                    {form.errors.email && (
                      <Text
                        size="sm"
                        c="#dc2626"
                        fw={600}
                        mt={6}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "8px 12px",
                          backgroundColor: "#fef2f2",
                          border: "1px solid #fecaca",
                          borderRadius: "8px",
                          animation: "shake 0.5s ease-in-out",
                        }}
                      >
                        <IconAlertCircle size={16} />
                        {form.errors.email}
                      </Text>
                    )}
                  </Box>

                  <Box
                    className="input-group"
                    style={{ "--delay": "0.3s" } as React.CSSProperties}
                    mb="md"
                  >
                    <Flex gap="md" wrap="wrap">
                      <Box flex={1}>
                        <PasswordInput
                          label="Password"
                          placeholder="Your password"
                          {...form.getInputProps("password")}
                          styles={{
                            label: {
                              fontWeight: 600,
                              marginBottom: "8px",
                              color: "#374151",
                            },
                            input: {
                              border: form.errors.password
                                ? "2px solid #dc2626"
                                : "2px solid #e5e7eb",
                              borderRadius: "12px",
                              padding: "12px 16px",
                              fontSize: "16px",
                              transition: "all 0.3s ease",
                              backgroundColor: form.errors.password
                                ? "#fef2f2"
                                : "white",
                              "&:focus": {
                                borderColor: form.errors.password
                                  ? "#dc2626"
                                  : "#3b82f6",
                                boxShadow: form.errors.password
                                  ? "0 0 0 3px rgba(220, 38, 38, 0.1)"
                                  : "0 0 0 3px rgba(59, 130, 246, 0.1)",
                                transform: "translateY(-1px)",
                              },
                              "&:hover": {
                                borderColor: form.errors.password
                                  ? "#dc2626"
                                  : "#d1d5db",
                              },
                            },
                          }}
                        />
                        {form.errors.password && (
                          <Text
                            size="sm"
                            c="#dc2626"
                            fw={600}
                            mt={6}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "8px 12px",
                              backgroundColor: "#fef2f2",
                              border: "1px solid #fecaca",
                              borderRadius: "8px",
                              animation: "shake 0.5s ease-in-out",
                            }}
                          >
                            <IconAlertCircle size={16} />
                            {form.errors.password}
                          </Text>
                        )}
                      </Box>

                      <Box flex={1}>
                        <PasswordInput
                          label="Confirm password"
                          placeholder="Confirm your password"
                          {...form.getInputProps("confirmPassword")}
                          styles={{
                            label: {
                              fontWeight: 600,
                              marginBottom: "8px",
                              color: "#374151",
                            },
                            input: {
                              border: form.errors.confirmPassword
                                ? "2px solid #dc2626"
                                : "2px solid #e5e7eb",
                              borderRadius: "12px",
                              padding: "12px 16px",
                              fontSize: "16px",
                              transition: "all 0.3s ease",
                              backgroundColor: form.errors.confirmPassword
                                ? "#fef2f2"
                                : "white",
                              "&:focus": {
                                borderColor: form.errors.confirmPassword
                                  ? "#dc2626"
                                  : "#3b82f6",
                                boxShadow: form.errors.confirmPassword
                                  ? "0 0 0 3px rgba(220, 38, 38, 0.1)"
                                  : "0 0 0 3px rgba(59, 130, 246, 0.1)",
                                transform: "translateY(-1px)",
                              },
                              "&:hover": {
                                borderColor: form.errors.confirmPassword
                                  ? "#dc2626"
                                  : "#d1d5db",
                              },
                            },
                          }}
                        />
                        {form.errors.confirmPassword && (
                          <Text
                            size="sm"
                            c="#dc2626"
                            fw={600}
                            mt={6}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "8px 12px",
                              backgroundColor: "#fef2f2",
                              border: "1px solid #fecaca",
                              borderRadius: "8px",
                              animation: "shake 0.5s ease-in-out",
                            }}
                          >
                            <IconAlertCircle size={16} />
                            {form.errors.confirmPassword}
                          </Text>
                        )}
                      </Box>
                    </Flex>
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    mt="xl"
                    loading={isLoading}
                    disabled={isLoading}
                    size="lg"
                    radius="xl"
                    style={{
                      background: success
                        ? "linear-gradient(45deg, #10b981, #059669)"
                        : "linear-gradient(45deg, #1e40af, #3b82f6)",
                      border: "none",
                      padding: "14px 0",
                      fontSize: "16px",
                      fontWeight: 600,
                      transition: "all 0.3s ease",
                      transform: isLoading ? "scale(0.98)" : "scale(1)",
                      boxShadow: success
                        ? "0 10px 25px rgba(16, 185, 129, 0.3)"
                        : "0 10px 25px rgba(59, 130, 246, 0.3)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        const target = e.target as HTMLElement;
                        target.style.transform = "translateY(-2px) scale(1.02)";
                        target.style.boxShadow = success
                          ? "0 15px 35px rgba(16, 185, 129, 0.4)"
                          : "0 15px 35px rgba(59, 130, 246, 0.4)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) {
                        const target = e.target as HTMLElement;
                        target.style.transform = "translateY(0) scale(1)";
                        target.style.boxShadow = success
                          ? "0 10px 25px rgba(16, 185, 129, 0.3)"
                          : "0 10px 25px rgba(59, 130, 246, 0.3)";
                      }
                    }}
                  >
                    {isLoading
                      ? "Creating Account..."
                      : success
                      ? "✓ Account Created"
                      : "Create Account"}
                  </Button>
                </form>

                <Divider
                  label="Or sign up with"
                  labelPosition="center"
                  my="xl"
                  styles={{
                    label: {
                      fontWeight: 500,
                      color: "#6b7280",
                    },
                  }}
                />
                <GoogleButton
                  style={{
                    transition: "all 0.3s ease",
                    transform: "scale(1)",
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.transform = "translateY(-1px) scale(1.01)";
                    target.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.transform = "translateY(0) scale(1)";
                    target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
                  }}
                >
                  Continue with Google
                </GoogleButton>
              </Paper>
            </Box>
          </Container>
        </Flex>
      </Flex>
    </Box>
  );
}
