"use client";
import { useEffect, useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  LogIn,
  Layers,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { loginAdmin, clearError } from "@/store/slices/authSlice";
import { useAuth } from "@/hooks/useAuth";

function LoginContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useSearchParams();
  const { isAuthenticated, loading, error, sessionExpired, dismissError } =
    useAuth();

  const [attempts, setAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFieldError,
  } = useForm({
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (isAuthenticated) {
      // Use window.location for full page reload to ensure cookies are properly set and middleware runs
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 100);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const reason = params.get("reason");
    if (reason === "session_expired") {
      toast.error("Your session expired. Please sign in again.", {
        duration: 5000,
      });
    }
    if (reason === "unauthorized") {
      toast.error("Access denied. Admin credentials required.", {
        duration: 5000,
      });
    }
  }, [params]);

  // Initialize from storage on mount
  useEffect(() => {
    const savedAttempts =
      Number(localStorage.getItem("rs_login_attempts")) || 0;
    setTimeout(() => setAttempts(savedAttempts), 0);

    const cooldownUntil = Number(
      localStorage.getItem("rs_login_cooldown_until"),
    );
    if (cooldownUntil && cooldownUntil > Date.now()) {
      setTimeout(
        () => setCooldown(Math.ceil((cooldownUntil - Date.now()) / 1000)),
        0,
      );
    } else {
      localStorage.removeItem("rs_login_cooldown_until");
    }
  }, []);

  // Precise timer interval
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => {
      setCooldown((currentCooldown) => {
        const cooldownUntil = Number(
          localStorage.getItem("rs_login_cooldown_until"),
        );

        if (!cooldownUntil || Date.now() >= cooldownUntil) {
          clearInterval(t);
          localStorage.removeItem("rs_login_cooldown_until");
          return 0;
        }

        return Math.ceil((cooldownUntil - Date.now()) / 1000);
      });
    }, 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const onSubmit = async (data) => {
    if (cooldown > 0) return;
    dismissError();

    try {
      const user = await dispatch(loginAdmin(data)).unwrap();

      // Clear persistence on success
      localStorage.removeItem("rs_login_attempts");
      localStorage.removeItem("rs_login_cooldown_until");

      const userName = user?.name?.split(" ")[0] || "Admin";
      toast.success(`Welcome back, ${userName}! 👋`);
      // Use window.location for full page reload to ensure cookies are properly set and proxy runs
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 100);
    } catch (error) {
      const errorMsg = error;
      const msg = typeof errorMsg === "string" ? errorMsg.toLowerCase() : "";

      if (msg.includes("email")) {
        setFieldError("email", { message: errorMsg });
      } else if (msg.includes("password") || msg.includes("credentials")) {
        setFieldError("password", { message: errorMsg });
      } else if (errorMsg) {
        toast.error(errorMsg);
      }

      // Handle failed attempts & exponential backoff
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem("rs_login_attempts", String(newAttempts));

      if (newAttempts >= 5) {
        const multiplier = Math.pow(2, Math.min(newAttempts - 5, 4)); // max 16x multiplier
        const durationSeconds = 30 * multiplier;
        // eslint-disable-next-line react-hooks/purity
        const cooldownUntil = Date.now() + durationSeconds * 1000;

        localStorage.setItem("rs_login_cooldown_until", String(cooldownUntil));
        setCooldown(durationSeconds);
        toast.error(
          `Too many failed attempts. Try again in ${durationSeconds}s.`,
        );
      }
    }
  };

  const isDisabled = loading || cooldown > 0;

  return (
    <div className="min-h-screen bg-sidebar flex">
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 border-r border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-heading font-bold text-white text-lg leading-none">
              RS Wallpaper
            </p>
            <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">
              Admin Panel
            </p>
          </div>
        </div>

        <div>
          <p className="text-white/10 font-heading text-8xl leading-none select-none">
            &quot;
          </p>
          <p className="font-heading text-2xl text-white/80 italic -mt-6 leading-snug">
            Manage your business with confidence.
          </p>
          <p className="text-white/30 text-sm mt-4">
            — RS 3D Wallpaper & Floor Admin Dashboard
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {[
            "256-bit encrypted session",
            "Secure HTTP-only cookies",
            "Auto session expiry",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <p className="text-sm text-white/40">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <p className="font-heading font-bold text-white text-lg">
              RS Wallpaper Admin
            </p>
          </div>

          <h1 className="font-heading text-3xl font-bold text-white mb-1">
            Welcome Back
          </h1>
          <p className="text-white/40 text-sm mb-8">
            Sign in to your admin account to continue.
          </p>

          {(sessionExpired || error) && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-6">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-red-300 font-medium">
                  {sessionExpired ? "Session expired" : "Authentication failed"}
                </p>
                <p className="text-xs text-red-400/70 mt-0.5">
                  {error || "Please sign in again to continue."}
                </p>
              </div>
              <button
                onClick={dismissError}
                className="text-red-400/50 hover:text-red-400 text-xs shrink-0"
              >
                ✕
              </button>
            </div>
          )}

          {cooldown > 0 && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
              <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
              <p className="text-sm text-amber-300">
                Too many attempts. Try again in{" "}
                <span className="font-bold">{cooldown}s</span>
              </p>
            </div>
          )}

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-white/70"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                disabled={isDisabled}
                autoComplete="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                className={`w-full px-4 py-3 rounded-xl border text-sm
                  outline-none transition-all duration-200 bg-white/5 text-white
                  placeholder:text-white/20
                  ${
                    errors.email
                      ? "border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                      : "border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  }
                  disabled:opacity-40 disabled:cursor-not-allowed`}
              />
              {errors.email && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <span>⚠</span> {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-white/70"
              >
                Password
              </label>
              <div className="relative">
                <PasswordInputDark
                  id="password"
                  placeholder="Enter your password"
                  disabled={isDisabled}
                  registration={register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  error={errors.password}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isDisabled}
              className="w-full py-3.5 rounded-xl bg-primary text-white
                font-semibold text-sm flex items-center justify-center gap-2
                hover:bg-primary-dark transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : cooldown > 0 ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Wait {cooldown}s...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>

            <p className="text-center text-xs text-white/20">
              Protected admin area. Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginForm() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-sidebar flex items-center justify-center">
          <div className="text-white/30">Loading...</div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

function PasswordInputDark({ id, placeholder, disabled, registration, error }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="current-password"
        {...registration}
        className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm
          outline-none transition-all duration-200 bg-white/5 text-white
          placeholder:text-white/20
          ${
            error
              ? "border-red-500/50 focus:ring-2 focus:ring-red-500/20"
              : "border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20"
          }
          disabled:opacity-40 disabled:cursor-not-allowed`}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1 mt-1.5">
          <span>⚠</span> {error.message}
        </p>
      )}
    </>
  );
}
