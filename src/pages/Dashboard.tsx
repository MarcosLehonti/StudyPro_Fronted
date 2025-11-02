import { useState } from "react";
import { Outlet, Link } from "react-router-dom";

export default function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesMenuOpen, setCoursesMenuOpen] = useState(false);
  const [groupsMenuOpen, setGroupsMenuOpen] = useState(false); // 👈 nuevo estado para Groups

  return (
    <div className="min-h-full">
      {/* NAV */}
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo + links */}
            <div className="flex items-center">
              <div className="shrink-0">
                <img
                  className="h-8 w-8"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                  alt="Your Company"
                />
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    to="/"
                    className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/team"
                    className="text-gray-300 hover:bg-white/5 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                  >
                    Team
                  </Link>

                  {/* 🔹 Groups con submenu */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setGroupsMenuOpen(!groupsMenuOpen);
                        setCoursesMenuOpen(false);
                      }}
                      className="text-gray-300 hover:bg-white/5 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    >
                      Groups ▾
                    </button>
                    {groupsMenuOpen && (
                      <div className="absolute left-0 mt-2 w-40 rounded-md bg-gray-700 shadow-lg z-10">
                        <Link
                          to="/list-groups"
                          className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                          onClick={() => setGroupsMenuOpen(false)}
                        >
                          All Groups
                        </Link>
                        <Link
                          to="/create-groups"
                          className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                          onClick={() => setGroupsMenuOpen(false)}
                        >
                          Create Group
                        </Link>

                        <Link
                          to="/my-groups"
                          className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                          onClick={() => setGroupsMenuOpen(false)}
                        >
                          My Groups
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* 🔹 Courses con submenu */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setCoursesMenuOpen(!coursesMenuOpen);
                        setGroupsMenuOpen(false);
                      }}
                      className="text-gray-300 hover:bg-white/5 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    >
                      Courses ▾
                    </button>
                    {coursesMenuOpen && (
                      <div className="absolute left-0 mt-2 w-40 rounded-md bg-gray-700 shadow-lg z-10">
                        <Link
                          to="/course-list"
                          className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                          onClick={() => setCoursesMenuOpen(false)}
                        >
                          All Courses
                        </Link>
                        <Link
                          to="/my-courses"
                          className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                          onClick={() => setCoursesMenuOpen(false)}
                        >
                          My Courses
                        </Link>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/users-list"
                    className="text-gray-300 hover:bg-white/5 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                  >
                    Users
                  </Link>
                  <Link
                    to="/profile"
                    className="text-gray-300 hover:bg-white/5 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                  >
                    Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Botón menú móvil */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        {mobileMenuOpen && (
          <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/team"
              className="text-gray-300 hover:bg-white/5 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Team
            </Link>

            {/* 🔹 Submenu móvil para Groups */}
            <div className="space-y-1">
              <button
                onClick={() => setGroupsMenuOpen(!groupsMenuOpen)}
                className="w-full text-left text-gray-300 hover:bg-white/5 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
              >
                Groups ▾
              </button>
              {groupsMenuOpen && (
                <div className="pl-4 space-y-1">
                  <Link
                    to="/list-groups"
                    className="block text-gray-300 hover:bg-white/5 hover:text-white rounded-md px-3 py-2 text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    All Groups
                  </Link>
                  <Link
                    to="/create-groups"
                    className="block text-gray-300 hover:bg-white/5 hover:text-white rounded-md px-3 py-2 text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Group
                  </Link>

                  <Link
                    to="/my-groups"
                    className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                    onClick={() => setGroupsMenuOpen(false)}
                    >
                      My Groups
                    </Link>
                </div>
              )}
            </div>

            {/* 🔹 Submenu móvil para Courses */}
            <div className="space-y-1">
              <button
                onClick={() => setCoursesMenuOpen(!coursesMenuOpen)}
                className="w-full text-left text-gray-300 hover:bg-white/5 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
              >
                Courses ▾
              </button>
              {coursesMenuOpen && (
                <div className="pl-4 space-y-1">
                  <Link
                    to="/course-list"
                    className="block text-gray-300 hover:bg-white/5 hover:text-white rounded-md px-3 py-2 text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    All Courses
                  </Link>
                  <Link
                    to="/my-courses"
                    className="block text-gray-300 hover:bg-white/5 hover:text-white rounded-md px-3 py-2 text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Courses
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/users-list"
              className="text-gray-300 hover:bg-white/5 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Users
            </Link>
            <Link
              to="/profile"
              className="text-gray-300 hover:bg-white/5 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
          </div>
        )}
      </nav>

      {/* HEADER */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        </div>
      </header>

      {/* MAIN */}
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
