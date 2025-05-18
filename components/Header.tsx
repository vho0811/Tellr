import { BookOpen, FilePen } from "lucide-react"
import Link from "next/link"

function Header() {
  return (
    <header className="relative p-16 text-center bg-[#FFF8E7]">
    <Link href='/' >
                <h1 className="text-6xl font-bold text-indigo-900">FableMind AI</h1>
                <div className="flex justify-center space-x-5 text-3xl lg:text-5xl mt-2">
                    <h2 className=" mt-2">Where <span className="bg-yellow-200 px-1 rounded">Imagination</span> Writes Itself</h2>
                </div>
    </Link>
    <div className = "absolute -top-5 right-5 flex space-x-2">
        <Link href='/'><FilePen className="w-8 h-8 lg:w-10 lg:h-10 mx-auto
        text-purple-500 mt-10 border border-purple-500 p-2 rounded-md hover:opacity-50 cursor-pointer" /></Link>
        <Link href='/stories'>
        <BookOpen className="w-8 h-8 lg:w-10 lg:h-10 mx-auto
        text-purple-500 mt-10 border border-purple-500 p-2 rounded-md hover:opacity-50 cursor-pointer" />
        </Link>

        
    </div>
    
    </header>
  )
}

export default Header