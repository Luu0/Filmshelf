import { useState } from "react";
import { Link } from "wouter";
import logo from "../assets/19e39a9ea246ceafb9f0673aa2addfe2c313e11c.png";
import { loginSchema } from "../schema/zodLoginSchema.js";
import { useMovieStore } from "../store/useMovieStore";

export default function Login() {
  const login = useMovieStore((state) => state.login);
  const loading = useMovieStore((state) => state.loading);
  const authError = useMovieStore((state) => state.err);

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const onSubmit = async (e) => {
    e.preventDefault();

    const result = loginSchema.safeParse({
      emailOrUsername,
      password,
    });

    if (!result.success) {
      const newErrors = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
      });
      setFieldErrors(newErrors);
      return;
    }

    setFieldErrors({});

    try {
      // LLAMA A LA FUNCIÓN 'login' DEL STORE
      await login({
        emailOrUsername,
        password,
      });
      window.location.href = "/";
    } catch (err) {

      setFieldErrors({
        password: authError || "Invalid email or password",
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0614] flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-linear-to-br from-black/40 via-purple-900/20 to-black/60 pointer-events-none z-0" />

      <header className="absolute top-0 left-0 w-full flex items-center px-6 py-5">
        <div className="flex items-center gap-3">
          <img src={logo} className="w-10 h-10" />
          <h1 className="text-white text-2xl font-bold tracking-wide">
            FILMSHELF
          </h1>
        </div>
      </header>

      <div className="relative bg-black/5 backdrop-blur-xl rounded-3xl px-[44px] py-[62px] max-w-lg w-full shadow-[0px_0px_50px_5px_rgba(128,0,255,0.1)] z-10">
        <h2 className="text-white text-[1.75rem] font-semibold text-center mb-11">
          Sign In to your account
        </h2>

        <form onSubmit={onSubmit} className="flex flex-col gap-7">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-300 text-[0.95rem]">
              Email or Username
            </label>
            <input
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="carlos@gmail.com"
              className={`
                bg-black/30 border rounded-xl px-5 py-4 
                text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2
                ${
                fieldErrors.emailOrUsername
                  ? "border-red-500 focus:ring-red-500"
                  : "border-white/10 focus:ring-purple-600"
              }
              `}
            />
            {fieldErrors.emailOrUsername && (
              <span className="text-red-400 text-sm">
                {fieldErrors.emailOrUsername}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-300 text-[0.95rem]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="example123"
              className={`
                bg-black/30 border rounded-xl px-5 py-4 
                text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2
                ${
                fieldErrors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-white/10 focus:ring-purple-600"
              }
              `}
            />
            {fieldErrors.password && (
              <span className="text-red-400 text-sm">
                {fieldErrors.password}
              </span>
            )}

            <div className="text-right mt-1">
              <a href="#" className="text-purple-400 text-sm hover:underline">
                Forgot Password?
              </a>
            </div>
          </div>

          <button
            disabled={loading} // CONECTADO AL LOADING DEL STORE
            className="bg-purple-600 hover:bg-purple-700 transition text-white font-semibold py-4 rounded-xl shadow-xl text-[1.05rem] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-gray-400 text-center text-[0.95rem] mt-10">
          Don’t have an account yet?{" "}
          <Link href="/register">
            <span className="text-purple-400 hover:underline cursor-pointer">
              Sign up here
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}