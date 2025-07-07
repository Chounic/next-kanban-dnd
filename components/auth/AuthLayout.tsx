import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import AuthLogo from "./AuthLogo";

interface AuthLayoutProp extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
}

export default function AuthLayout({
  children,
  title,
  description,
  className,
}: AuthLayoutProp) {
  return (
    <div
      className={cn(
        "flex min-h-svh w-full items-center justify-center p-6 md:p-10",
        className
      )}
    >
      <div className="flex items-center xl:p-10">
        <div className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl">
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="mb-3 text-4xl font-extrabold text-dark-grey-900 flex items-center justify-center gap-4">
                <h1>{title}</h1>
                <AuthLogo className="inline-flex sm:hidden mt-2"/>       
              </CardTitle>
              <CardDescription className="whitespace-nowrap mb-4 text-grey-700">
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
