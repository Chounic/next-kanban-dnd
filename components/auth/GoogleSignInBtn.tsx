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
      <Button className="h-[unset] flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-300 rounded-2xl text-grey-900 bg-grey-300 hover:bg-grey-400 focus:ring-4 focus:ring-grey-300">
        <img className="h-5 mr-2" src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png" alt="" />
        {text}
      </Button>
    </form>
  );
}
