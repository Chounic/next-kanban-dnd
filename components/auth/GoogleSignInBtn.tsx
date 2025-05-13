import { signIn } from "@/auth";
import { Button } from "../ui/button";

export default function GoogleAuthButton({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google"); //TODO handle errors and toast display
      }}
      className={className}
    >
      <Button className="w-full">{text}</Button>
    </form>
  );
}
