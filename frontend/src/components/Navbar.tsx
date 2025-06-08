import type React from "react"
import { FiShield } from "react-icons/fi"

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FiShield className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-xl font-semibold text-gray-800">Saudi Data Guardian</span>
          </div>

          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-600 hover:text-green-600">
              Dashboard
            </a>
            <a href="#" className="text-gray-600 hover:text-green-600">
              History
            </a>
            <a href="#" className="text-gray-600 hover:text-green-600">
              Documentation
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
