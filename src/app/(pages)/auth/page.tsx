"use client";

import type React from "react";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Lock,
  User,
  Phone,
  LogIn,
  ArrowRight,
  Plus,
  Shield,
  Zap,
  Users,
  TrendingUp,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function AuthPage() {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
    image: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Avatar upload handler
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      setSignupData((d) => ({ ...d, image: data.secure_url }));
    }
  };

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
      if (!res.ok) throw await res.json();
      return res.json();
    },
    onSuccess: async (data) => {
      toast.success("Registration successful! Logging you in...");
      const res = await signIn("credentials", {
        email: signupData.email,
        password: signupData.password,
        redirect: false,
      });
      if (res?.ok) {
        if (!data.organizationId) {
          window.location.href = "/organization/create";
        } else {
          window.location.href = "/";
        }
      } else {
        toast.error("Auto-login failed, please login manually.");
        setMode("login");
      }
    },
    onError: (err: any) => {
      if (err?.details && Array.isArray(err.details)) {
        err.details.forEach((detail: any) => {
          toast.error(detail.message || "Validation error");
        });
      } else {
        toast.error(err?.error || "Registration failed");
      }
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      ...loginData,
      redirect: false,
    });
    if (res?.ok) {
      const profileRes = await fetch("/api/user/me");
      const profile = await profileRes.json();
      if (!profile.organizationId) {
        window.location.href = "/organization/create";
      } else {
        toast.success("Login successful!");
        window.location.href = "/sales";
      }
    } else {
      toast.error("Invalid credentials");
    }
  };

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      desc: "Generate invoices in seconds",
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      desc: "Bank-level security for your data",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      desc: "Work together seamlessly",
    },
    {
      icon: TrendingUp,
      title: "Analytics",
      desc: "Track your business growth",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Freelancer",
      text: "QuickBill saved me hours every week!",
    },
    {
      name: "Mike Chen",
      role: "Agency Owner",
      text: "The best invoicing tool I've ever used.",
    },
    {
      name: "Emma Davis",
      role: "Consultant",
      text: "Simple, powerful, and reliable.",
    },
  ];

 return (
  <div className="flex min-h-screen w-full lg:flex-row flex-col">
    {/* Enhanced Left Panel */}
    <div className="lg:w-[45%] w-full bg-primary flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden text-xl lg:min-h-screen min-h-[50vh]">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-16 -left-16 w-28 h-28 bg-primary-foreground/10 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-1/2 -right-8 w-20 h-20 bg-primary-foreground/5 rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [-10, 10, -10],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-14 left-1/3 w-16 h-16 bg-primary-foreground/10 rounded-full"
          animate={{
            y: [-10, 10, -10],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 lg:mb-6"
        >
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-2 text-primary-foreground">
            <motion.div
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary-foreground" />
            </motion.div>
            <span>QuickBill</span>
          </div>
          <p className="text-primary-foreground/80 text-base sm:text-lg">
            The future of invoicing is here
          </p>
        </motion.div>

        <div className="flex-1 min-h-0">
          <AnimatePresence mode="wait">
            {mode === "signup" ? (
              <motion.div
                key="signup-content"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 lg:space-y-8 h-full flex flex-col"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-primary-foreground">
                    Join thousands of professionals
                  </h2>
                  <p className="text-primary-foreground/80 text-sm sm:text-base lg:text-lg leading-relaxed">
                    Create professional invoices, track payments, and grow your
                    business with our powerful platform.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 flex-1">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-primary-foreground/20"
                    >
                      <feature.icon className="w-5 h-5 lg:w-6 lg:h-6 text-primary-foreground mb-2" />
                      <h3 className="text-primary-foreground font-semibold text-sm lg:text-base">
                        {feature.title}
                      </h3>
                      <p className="text-primary-foreground/80 text-xs lg:text-base">
                        {feature.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="login-content"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 lg:space-y-8 h-full flex flex-col"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-primary-foreground">
                    Welcome back!
                  </h2>
                  <p className="text-primary-foreground/80 text-sm sm:text-base lg:text-lg leading-relaxed">
                    Sign in to continue managing your invoices and growing your
                    business.
                  </p>
                </div>
                <div className="space-y-2 lg:space-y-3 flex-1">
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={testimonial.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-primary-foreground/20"
                    >
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex text-accent">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 lg:w-4 lg:h-4 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-primary-foreground text-xs sm:text-sm lg:text-base mb-1">
                        "{testimonial.text}"
                      </p>
                      <div className="text-primary-foreground/80 text-xs sm:text-sm lg:text-base">
                        <span className="font-semibold">
                          {testimonial.name}
                        </span>{" "}
                        • {testimonial.role}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 lg:mt-10">
          <div className="flex gap-4 sm:gap-6 lg:gap-8">
            <motion.button
              className={`text-sm sm:text-base lg:text-lg font-semibold pb-2 border-b-2 transition-all ${
                mode === "login"
                  ? "border-primary-foreground text-primary-foreground"
                  : "border-transparent text-primary-foreground/60 hover:text-primary-foreground"
              }`}
              onClick={() => setMode("login")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              LOG IN
            </motion.button>
            <motion.button
              className={`text-sm sm:text-base lg:text-lg font-semibold pb-2 border-b-2 transition-all ${
                mode === "signup"
                  ? "border-primary-foreground text-primary-foreground"
                  : "border-transparent text-primary-foreground/60 hover:text-primary-foreground"
              }`}
              onClick={() => setMode("signup")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              SIGN UP
            </motion.button>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-xs sm:text-sm text-primary-foreground/60 relative z-10 mt-4 lg:mt-0"
      >
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 lg:w-5 lg:h-5" />
          <span>Secured by 256-bit SSL encryption</span>
        </div>
        <div className="hidden sm:block">TERMS OF USE AND PRIVACY POLICY</div>
      </motion.div>
    </div>

    {/* Enhanced Right Panel */}
    <div className="lg:w-[55%] w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-card lg:min-h-screen min-h-[50vh]">
      <AnimatePresence mode="wait">
        {mode === "signup" ? (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-xs sm:max-w-sm"
          >
            {/* Avatar Upload */}
            <motion.div
              className="flex flex-col items-center mb-4 lg:mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <label className="relative cursor-pointer group">
                <motion.div
                  className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-card shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {signupData.image ? (
                    <img
                      src={signupData.image || "/placeholder.svg"}
                      alt="Avatar"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <User className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-muted-foreground" />
                  )}
                </motion.div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <motion.span
                  className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1 shadow-lg hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </motion.span>
              </label>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Upload your photo
              </p>
            </motion.div>

            <form
              className="space-y-3 lg:space-y-4 text-sm sm:text-base"
              onSubmit={(e) => {
                e.preventDefault();
                signupMutation.mutate();
              }}
            >
              <div className="grid grid-cols-2 gap-2 lg:gap-3">
                <div className="relative">
                  <Input
                    placeholder="First Name"
                    value={signupData.firstName}
                    onChange={(e) =>
                      setSignupData((d) => ({
                        ...d,
                        firstName: e.target.value,
                      }))
                    }
                    required
                    className="h-10 sm:h-11 lg:h-12 text-sm sm:text-base bg-input border-2 border-border rounded-xl focus:border-primary focus:ring-0 transition-all duration-200 pl-3"
                  />
                </div>
                <div className="relative">
                  <Input
                    placeholder="Last Name"
                    value={signupData.lastName}
                    onChange={(e) =>
                      setSignupData((d) => ({
                        ...d,
                        lastName: e.target.value,
                      }))
                    }
                    required
                    className="h-10 sm:h-11 lg:h-12 text-sm sm:text-base bg-input border-2 border-border rounded-xl focus:border-primary focus:ring-0 transition-all duration-200 pl-3"
                  />
                </div>
              </div>

              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  placeholder="Username"
                  value={signupData.username}
                  onChange={(e) =>
                    setSignupData((d) => ({ ...d, username: e.target.value }))
                  }
                  required
                  className="h-10 sm:h-11 lg:h-12 text-sm sm:text-base bg-input border-2 border-border rounded-xl focus:border-primary focus:ring-0 transition-all duration-200 pl-10 sm:pl-12"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData((d) => ({ ...d, email: e.target.value }))
                  }
                  required
                  className="h-10 sm:h-11 lg:h-12 text-sm sm:text-base bg-input border-2 border-border rounded-xl focus:border-primary focus:ring-0 transition-all duration-200 pl-10 sm:pl-12"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 lg:gap-3">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData((d) => ({
                        ...d,
                        password: e.target.value,
                      }))
                    }
                    required
                    className="h-10 sm:h-11 lg:h-12 text-sm sm:text-base lg:text-lg bg-input border-2 border-border rounded-xl focus:border-primary focus:ring-0 transition-all duration-200 pl-10 sm:pl-12"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    className="h-10 sm:h-11 lg:h-12 text-sm sm:text-base bg-input border-2 border-border rounded-xl focus:border-primary focus:ring-0 transition-all duration-200 pl-10 sm:pl-12"
                  />
                </div>
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  placeholder="Phone Number"
                  value={signupData.phone}
                  onChange={(e) =>
                    setSignupData((d) => ({ ...d, phone: e.target.value }))
                  }
                  className="h-10 sm:h-11 lg:h-12 text-sm sm:text-base bg-input border-2 border-border rounded-xl focus:border-primary focus:ring-0 transition-all duration-200 pl-10 sm:pl-12"
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={signupMutation.isPending}
                  className="w-full h-10 sm:h-11 lg:h-12 text-sm sm:text-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 mt-3 lg:mt-4"
                >
                  {signupMutation.isPending ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Create Account
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-xs sm:max-w-sm"
          >
            <div className="text-center mb-6 lg:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                Welcome Back
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Sign in to your account
              </p>
            </div>

            <form className="space-y-4 lg:space-y-5 text-sm sm:text-base" onSubmit={handleLogin}>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData((d) => ({ ...d, email: e.target.value }))
                  }
                  required
                  className="h-10 sm:h-11 lg:h-12 text-sm sm:text-base bg-input border-2 border-border rounded-xl focus:border-primary focus:ring-0 transition-all duration-200 pl-10 sm:pl-12"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData((d) => ({ ...d, password: e.target.value }))
                  }
                  required
                  className="h-10 sm:h-11 lg:h-12 text-sm sm:text-base bg-input border-2 border-border rounded-xl focus:border-primary focus:ring-0 transition-all duration-200 pl-10 sm:pl-12"
                />
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <label className="flex items-center gap-2 text-muted-foreground">
                  <input type="checkbox" className="rounded border-border" />
                  Remember me
                </label>
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Forgot password?
                </a>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full h-10 sm:h-11 lg:h-12 text-sm sm:text-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Sign In
                </Button>
              </motion.div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);
}
