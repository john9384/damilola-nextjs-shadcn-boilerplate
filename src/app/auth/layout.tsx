import type { Scalar } from "@/types/global";
import Image from "next/image";

const LOGO_URL =
  "https://res.cloudinary.com/djnboqpze/image/upload/v1770406971/esirs_zcttct.jpg";

export default function AuthLayout({ children }: Scalar) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-white">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-md bg-white p-1">
              <Image
                src={LOGO_URL}
                alt="ESiRS logo"
                width={32}
                height={32}
                className="h-full w-full object-contain"
              />
            </div>
            ESiRS
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/banner.jpeg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
