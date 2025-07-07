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
                <FormLabel className="mb-2 text-sm text-start text-grey-900">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className={cn("h-[unset] flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl",
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
                  <FormLabel className="mb-2 text-sm text-start text-grey-900">Password</FormLabel>

                </div>
                <FormControl>
                  <Input
                    {...field}
                    className={cn("h-[unset] flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl",
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
                    placeholder="Saisissez un mot de passe"
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

          <div className="flex flex-row justify-between mb-8">
            <label className="relative inline-flex items-center mr-3 cursor-pointer select-none">
              <input type="checkbox" disabled defaultChecked value="" className="sr-only peer" />
              <div
                className="w-5 h-5 bg-white border-2 rounded-sm border-grey-500 peer peer-checked:border-0 peer-checked:bg-purple-blue-500">
                <img className="" src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/icons/check.png" alt="tick" />
              </div>
              <span className="ml-3 text-sm font-normal text-grey-900">Se souvenir de moi</span>
            </label>

            <a
                href="#"
                className="mr-4 text-sm font-medium text-purple-blue-500"
              >
                Mot de passe oublié?
            </a>
          </div>

          <Button type="submit" className="h-[unset] w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Chargement...
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
