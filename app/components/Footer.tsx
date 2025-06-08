import type React from "react"

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Saudi Data Guardian. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <span className="text-gray-600 text-sm">Compliant with Saudi NDMO and PDPL classification policies</span>
            <div className="flex items-center text-green-600">
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium">Secure & Private</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
