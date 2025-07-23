import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ProjectLogo from "./AuthLogo";

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
        "flex min-h-svh justify-center p-6 md:p-10",
        className
      )}
    >
      <ProjectLogo isAuthLogo className="fixed top-1 left-1 sm:hidden"/>
      <div className="flex items-center xl:p-10">
        <div className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl">
          <Card className="border-none shadow-none">
            <CardHeader className="pt-0">
              <CardTitle className="mb-3 text-3xl font-extrabold text-dark-grey-900 flex flex-col items-center justify-center gap-12">
                <h1>{title}</h1>
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
