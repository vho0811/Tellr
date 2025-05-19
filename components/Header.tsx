import { BookOpen, FilePen } from "lucide-react"
import Link from "next/link"

/**
 * Header Component
 * 
 * This component renders the application header with the FableMind AI logo,
 * tagline, and navigation icons.
 * 
 * Features:
 * - Responsive design that adapts to different screen sizes
 * - Navigation links to the home page and stories collection
 * - Visual icons for intuitive navigation
 * - Branded styling with custom colors and typography
 * 
 * The header serves as the main navigation component across the application,
 * providing consistent branding and user experience.
 * 
 * @returns {JSX.Element} The rendered Header component
 */
function Header() {
  return (
    <header className="relative p-16 text-center bg-[#FFF8E7]">
      {/* Main title and tagline with link to home */}
      <Link href='/' >
        <h1 className="text-6xl font-bold text-indigo-900 italic">FableMind AI</h1>
        <div className="flex justify-center space-x-5 text-3xl lg:text-5xl mt-2">
          <h2 className=" mt-2">Where <span className="bg-yellow-200 px-1 rounded italic">Imagination</span> Writes Itself</h2>
        </div>
      </Link>
      
      {/* Navigation icons for story creation and browsing */}
      <div className = "absolute -top-5 right-5 flex space-x-2">
        {/* Create story icon */}
        <Link href='/'>
          <FilePen className="w-8 h-8 lg:w-10 lg:h-10 mx-auto
          text-purple-500 mt-10 border border-purple-500 p-2 rounded-md hover:opacity-50 cursor-pointer" 
          aria-label="Create new story" />
        </Link>
        
        {/* Browse stories icon */}
        <Link href='/stories'>
          <BookOpen className="w-8 h-8 lg:w-10 lg:h-10 mx-auto
          text-purple-500 mt-10 border border-purple-500 p-2 rounded-md hover:opacity-50 cursor-pointer" 
          aria-label="Browse stories" />
        </Link>
      </div>
    </header>
  )
}

export default Header