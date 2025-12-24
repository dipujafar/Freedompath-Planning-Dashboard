"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import logo from "@/assets/logo-without-bg.png"
import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useLoginMutation } from "@/redux/api/authApi"
import { useAppDispatch } from "@/redux/hooks"
import { setUser } from "@/redux/features/authSlice"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { IApiError } from "@/types/auth.types"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  rememberMe: z.boolean(),
})

type LoginFormValues = z.infer<typeof formSchema>

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  async function onSubmit(values: LoginFormValues) {
    try {
      const response = await login({
        email: values.email,
        password: values.password,
      }).unwrap()

      if (response.success) {
        // Store user and token in Redux (persisted to localStorage via redux-persist)
        dispatch(
          setUser({
            user: response.data.user,
            token: response.data.accessToken,
          })
        )

        toast.success(response.message || "Logged in successfully!")

        // Redirect to dashboard
        router.push("/dashboard")
      }
    } catch (error) {
      const apiError = error as { data?: IApiError; status?: number }

      // Handle different error scenarios
      if (apiError.data?.message) {
        toast.error(apiError.data.message)
      } else if (apiError.status === 401) {
        toast.error("Invalid email or password")
      } else if (apiError.status === 403) {
        toast.error("Your account has been blocked")
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-4xl bg-white py-5 px-5 rounded-lg">
        <div className="text-center">
          <div className="flex justify-center ">
            <Image src={logo} width={200} height={250} alt="FreedomPath Logo" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Welcome To FreedomPath</h1>
          <p className="text-sm text-muted-foreground">Sign in to your account</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal text-foreground">Email address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" className="h-12 rounded-lg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal text-foreground">Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input type={showPassword ? "text" : "password"} placeholder="Enter your password" className="h-12 rounded-lg" {...field} />
                    </FormControl>
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-3 right-3 text-muted-foreground"
                      >
                        {showPassword ? <Eye /> : <EyeOff />}
                      </button>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              {/* <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="text-sm font-normal cursor-pointer">Remember me</FormLabel>
                  </FormItem>
                )}
              /> */}
              <div></div>

              <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                Forget Password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-lg font-normal disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
