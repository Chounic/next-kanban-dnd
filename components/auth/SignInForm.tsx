"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { authFormSchema, AuthFormSchema } from "@/lib/zod-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { signin } from "@/action/auth-server";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Loader2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SignInForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<AuthFormSchema>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(authFormSchema),
  });

  const onSubmit = (formData: AuthFormSchema) => {
    startTransition(async () => {
      setError("");
      await signin(formData)
        .then((data) => {
          if (data.success) {
            toast.success(data.success);
            router.push("/");
          }
          if (data.error) {
            setError(data.error);
          }
        })
        .catch((data) => {
          setError(data.error);
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
            render={({ field, fieldState }) => (
              <FormItem className="mb-4 flex flex-col gap-2 min-h-[110px]">
                <FormLabel className="block mb-1">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className={cn(
                      fieldState.error &&
                        "border-red-600 text-destructive focus-visible:ring-0"
                    )}
                    placeholder="marie.poirier@example.com"
                    disabled={isPending}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value);
                      setError("");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem className="mb-4 gap-2 flex flex-col  min-h-[110px]">
                <div className="flex justify-between items-center">
                  <FormLabel className="mb-1">Password</FormLabel>
                  <a
                    href="#"
                    className={cn(
                      "ml-auto mb-1 inline-block text-sm underline-offset-4 hover:underline pointer-events-none",
                      fieldState.error &&
                        "border-red-600 text-destructive focus-visible:ring-0 font-medium"
                    )}
                  >
                    Mot de passe oublié?
                  </a>
                </div>
                <FormControl>
                  <Input
                    {...field}
                    className={cn(
                      fieldState.error &&
                        "border-red-600 text-destructive focus-visible:ring-0"
                    )}
                    type="password"
                    disabled={isPending}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value);
                      setError("");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <div className="flex items-center gap-2 mb-4 text-red-500 justify-center">
              <TriangleAlert size={36} />
              <span className=" text-sm font-semibold">{error}</span>
            </div>
          )}

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
