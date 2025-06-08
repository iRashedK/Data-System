import type React from "react"
export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Saudi Data Guardian. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-gray-600 text-sm">Compliant with Saudi NDMO and PDPL classification policies</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
