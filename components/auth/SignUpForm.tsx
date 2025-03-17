"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp } from "@/action/auth-server";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { AuthFormSchema, authFormSchema } from "@/lib/zod-validations";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function SignUpForm({
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

  //TODO change errors display

  async function onSubmit(formData: AuthFormSchema) {
    startTransition(() => {
      signUp(formData)
        .then((data) => {
          if (data.success) {
            toast.success(data.success);
            router.push("/login");
          } else if (data.error) {
            toast.error(data.error);
          }
        })
        .catch((data) => {
          toast.error(data.error);
        });
    });
  }
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
              "Valider l'inscription"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
