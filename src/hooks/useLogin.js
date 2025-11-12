import { useState } from "react"
import { signIn } from "../services/auth.js"

export function useLogin() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleLogin = async (data) => {
        try {
            setLoading(true)
            setError(null)

            const res = await signIn(data)
            return res

        } catch (err) {
            setError("Invalid email or password")
            throw err

        } finally {
            setLoading(false)
        }
    }

    return { handleLogin, loading, error }
}
