import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/auth.js";

export function useRegister() {
  const mutation = useMutation({
    mutationKey: ["register"],
    mutationFn: registerUser,
  });

  return mutation;
}
