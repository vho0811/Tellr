import Image from "next/image";
import logo from "@/images/logo.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Home() {
  return (
      <main className="flex-1 flex flex-col">
        <section className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col space-y-5 bg-[#EDE9F7] items-center justify-center order-1 lg:order-1 pb-10">
          <Image src={logo} height={250}   alt="logo"/>
          <Button asChild className="px-20 p-10 text-xl bg-[#FDF6D8] hover:bg-[#fcefc0] text-indigo-900 font-semibold  rounded-xl shadow-sm border border-yellow-200 transition duration-200">
          <Link href="/stories">Browse Tales</Link>
          </Button>
        </div>

        </section>
      </main>
  );
}
