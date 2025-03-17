"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { authFormSchema, AuthFormSchema } from "@/lib/zod-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/action/auth-server";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<AuthFormSchema>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(authFormSchema),
  });

  const onSubmit = (formData: AuthFormSchema) => {
    startTransition(async () => {
      setError("");
      await login(formData)
        .then((data) => {
          if (data.success) {
            toast.success(data.success);
            router.push("/");
          }
          if (data.error) {
            toast.error(data.error);
          }
        })
        .catch((data) => {
          toast.error(data.error);
        });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <div className="flex flex-col">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-4 flex flex-col gap-2 min-h-[110px]">
                <FormLabel className="block mb-1">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-full p-2 border rounded"
                    placeholder="marie.poirier@example.com"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-4 gap-2 flex flex-col  min-h-[110px]">
                <div className="flex justify-between items-center">
                  <FormLabel className="mb-1">Password</FormLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Mot de passe oublié?
                  </a>
                </div>
                <FormControl>
                  <Input
                    {...field}
                    className="w-full p-2 border rounded"
                    type="password"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
