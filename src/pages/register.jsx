import { Link, useLocation } from "wouter";
import logo from "../assets/19e39a9ea246ceafb9f0673aa2addfe2c313e11c.png";
import { useRegister } from "../mutations/useRegister";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { parseRegisterError } from "../hooks/useRegisterErrors";

import Input from "../Components/input";

export default function Register() {
  const [, navigate] = useLocation();
  const { mutate, isPending } = useRegister();

  const { form, errors, setErrors, handleChange, validate } = useRegisterForm();

  const handleSubmit = () => {
    if (!validate()) return;

    mutate(form, {
      onSuccess: () => navigate("/login"),
      onError: (err) => setErrors(parseRegisterError(err)),
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0614] flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-linear-to-br from-black/40 via-purple-900/20 to-black/60 pointer-events-none z-0" />

      <header className="absolute top-0 left-0 w-full flex items-center px-6 py-5 z-20">
        <div className="flex items-center gap-3">
          <img src={logo} className="w-10 h-10" />
          <h1 className="text-white text-2xl font-bold tracking-wide">
            FILMSHELF
          </h1>
        </div>
      </header>

      <div className=" h-[460px] relative flex flex-col gap-7 items-center bg-black/5 backdrop-blur-xl rounded-3xl px-16 py-[62px] max-w-lg w-full shadow-[0px_0px_50px_5px_rgba(128,0,255,0.1)] z-10">
        <h2 className="text-white text-[1.75rem] font-semibold text-center mb-11">
          Create free account
        </h2>

        <div className="flex flex-col gap-5 items-center">
          <Input
            label="Email"
            name="email"
            type="email"
            form={form}
            onChange={handleChange}
            placeholder="carlos@gmail.com"
            error={errors.email}
          />

          <Input
            label="Username"
            name="username"
            type="text"
            form={form}
            onChange={handleChange}
            placeholder="carlos"
            error={errors.username}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            form={form}
            onChange={handleChange}
            placeholder="example123"
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            form={form}
            onChange={handleChange}
            placeholder="example123"
            error={errors.confirmPassword}
          />

          {errors.general && (
            <p className="text-red-400 text-center text-sm">{errors.general}</p>
          )}

          <button
            disabled={isPending}
            onClick={handleSubmit}
            className=" w-[200px] bg-purple-600 hover:bg-purple-700 transition text-white font-semibold py-4 rounded-xl shadow-xl text-[1.05rem]">
            {isPending ? "Creating account..." : "Get started"}
          </button>
        </div>

        <p className="text-gray-400 text-center text-[0.95rem] mt-10">
          Already have an account?{" "}
          <Link href="/login">
            <span className="text-purple-400 hover:underline cursor-pointer">
              Sign in here
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
