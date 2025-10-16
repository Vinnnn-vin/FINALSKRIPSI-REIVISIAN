// src\app\frontend\auth\login\page.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Divider,
  Text,
  Alert,
  Flex,
  Image as MantineImage,
  Box,
  Transition,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle, IconX } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { GoogleButton } from "@/app/frontend/components/GoogleButton";
import { LoginInput, loginSchema } from "@/validations/auth";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/frontend/landing";
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const form = useForm({
    initialValues: { email: "", password: "" },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Format email tidak valid",
      password: (value) => (value.length > 0 ? null : "Password harus diisi"),
    },
    // validate: zodResolver(loginSchema),
  });

  // Handle mounting animation
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle authentication redirect with proper data loading
  useEffect(() => {
    if (status === "authenticated" && session && !redirecting) {
      setRedirecting(true);

      // Give time for session data to be fully loaded
      setTimeout(() => {
        router.replace(callbackUrl);
      }, 100);
    }
  }, [status, session, router, callbackUrl, redirecting]);

  const handleManualLogin = async (values: LoginInput) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        setError(
          "Invalid email or password. Please check your credentials and try again."
        );
      } else if (result?.ok) {
        setRedirecting(true);
        // Wait a bit for session to be established
        setTimeout(() => {
          router.replace(callbackUrl);
        }, 500);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        "An unexpected error occurred. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError("");
    try {
      await signIn("google", {
        callbackUrl: callbackUrl,
        redirect: true,
      });
    } catch (err) {
      const error = err as Error;
      console.error("Google login error:", error);
      setError(error.message || "Google login failed. Please try again.");
      setIsGoogleLoading(false);
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
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Box ta="center">
          <Loader size="lg" color="white" />
          <Text c="white" mt="md" size="lg" fw={500}>
            {redirecting ? "Signing you in..." : "Loading..."}
          </Text>
        </Box>
      </Flex>
    );
  }

  // Don't render login page for authenticated users
  if (status === "authenticated") {
    return null;
  }

  return (
    <Box
      h="100vh"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .image-container {
          animation: slideInRight 0.8s ease-out;
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
      `}</style>

      <Flex h="100%">
        {/* Left Column: Form */}
        <Flex
          flex={1}
          align="center"
          justify="center"
          className="animate-slide-left"
        >
          <Container size={420} w="100%">
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
                  Welcome Back
                </Title>
                <Text
                  size="sm"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontWeight: 500,
                  }}
                >
                  Don&apos;t have an account?{" "}
                  <Text
                    component="a"
                    href="/frontend/auth/register"
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
                    Sign up
                  </Text>
                </Text>
              </Box>

              <Paper
                shadow="xl"
                radius="xl"
                p="xl"
                withBorder
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
                      title="Login Failed"
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

                <form onSubmit={form.onSubmit(handleManualLogin)}>
                  <Box mb="md">
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
                              : "#667eea",
                            boxShadow: form.errors.email
                              ? "0 0 0 3px rgba(220, 38, 38, 0.1)"
                              : "0 0 0 3px rgba(102, 126, 234, 0.1)",
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
                          animation: "shake 0.5s ease-in-out",
                        }}
                      >
                        <IconAlertCircle size={16} />
                        {form.errors.email}
                      </Text>
                    )}
                  </Box>

                  <Box mb="md">
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
                              : "#667eea",
                            boxShadow: form.errors.password
                              ? "0 0 0 3px rgba(220, 38, 38, 0.1)"
                              : "0 0 0 3px rgba(102, 126, 234, 0.1)",
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

                  <Button
                    type="submit"
                    fullWidth
                    mt="xl"
                    loading={isLoading}
                    disabled={isLoading}
                    size="lg"
                    radius="xl"
                    style={{
                      background: "linear-gradient(45deg, #667eea, #764ba2)",
                      border: "none",
                      padding: "14px 0",
                      fontSize: "16px",
                      fontWeight: 600,
                      transition: "all 0.3s ease",
                      transform: isLoading ? "scale(0.98)" : "scale(1)",
                      boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        const target = e.target as HTMLElement;
                        target.style.transform = "translateY(-2px) scale(1.02)";
                        target.style.boxShadow =
                          "0 15px 35px rgba(102, 126, 234, 0.4)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) {
                        const target = e.target as HTMLElement;
                        target.style.transform = "translateY(0) scale(1)";
                        target.style.boxShadow =
                          "0 10px 25px rgba(102, 126, 234, 0.3)";
                      }
                    }}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                <Divider
                  label="Or continue with"
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
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  loading={isGoogleLoading}
                  style={{
                    transition: "all 0.3s ease",
                    transform: "scale(1)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isGoogleLoading) {
                      const target = e.target as HTMLElement;
                      target.style.transform = "translateY(-1px) scale(1.01)";
                      target.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isGoogleLoading) {
                      const target = e.target as HTMLElement;
                      target.style.transform = "translateY(0) scale(1)";
                      target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
                    }
                  }}
                >
                  Continue with Google
                </GoogleButton>
              </Paper>
            </Box>
          </Container>
        </Flex>

        {/* Right Column: Image */}
        <Flex
          flex={1}
          display={{ base: "none", sm: "flex" }}
          className="image-container"
          pos="relative"
          style={{
            background:
              "linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8))",
          }}
        >
          <MantineImage
            src="/SIGNIN.jpg"
            alt="Login illustration"
            h="100%"
            style={{
              objectFit: "cover",
              filter: "brightness(1.1) contrast(1.05)",
              transition: "all 0.8s ease",
            }}
          />
          <Box
            pos="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            style={{
              background:
                "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.2))",
              mixBlendMode: "overlay",
            }}
          />

          {/* Floating elements */}
          <Box
            pos="absolute"
            top="20%"
            right="10%"
            w={60}
            h={60}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              backdropFilter: "blur(10px)",
              animation: "float 4s ease-in-out infinite",
            }}
          />
          <Box
            pos="absolute"
            bottom="30%"
            right="20%"
            w={40}
            h={40}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "50%",
              backdropFilter: "blur(10px)",
              animation: "float 3s ease-in-out infinite 1s",
            }}
          />
        </Flex>
      </Flex>
    </Box>
  );
}