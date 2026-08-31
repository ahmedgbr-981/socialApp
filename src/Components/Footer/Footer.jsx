import React from 'react'
import { FaFacebookF, FaGithub, FaInstagram, FaLinkedinIn } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-200/70 text-base-content">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-12">
        <div>
          <Link to="/home" className="inline-flex items-center gap-3 text-xl font-bold tracking-tight">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-red-500 text-primary-content shadow-sm">
              S
            </span>
            <span>Socially</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-base-content/65">
            A friendly place to share the moments, ideas, and conversations that matter.
          </p>
          <div className="mt-6 flex gap-2">
            <a href="#facebook" aria-label="Facebook" className="btn btn-circle btn-sm btn-ghost bg-base-100 shadow-sm">
              <FaFacebookF size={14} />
            </a>
            <a href="#instagram" aria-label="Instagram" className="btn btn-circle btn-sm btn-ghost bg-base-100 shadow-sm">
              <FaInstagram size={16} />
            </a>
            <a href="#linkedin" aria-label="LinkedIn" className="btn btn-circle btn-sm btn-ghost bg-base-100 shadow-sm">
              <FaLinkedinIn size={15} />
            </a>
            <a href="#github" aria-label="GitHub" className="btn btn-circle btn-sm btn-ghost bg-base-100 shadow-sm">
              <FaGithub size={16} />
            </a>
          </div>
        </div>

        <nav aria-label="Explore" className="flex flex-col gap-3 text-sm">
          <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-base-content/45">Explore</h2>
          <Link to="/home" className="w-fit text-base-content/70 transition-colors hover:text-primary">Home</Link>
          <Link to="/profile" className="w-fit text-base-content/70 transition-colors hover:text-primary">Profile</Link>
          <Link to="/setting" className="w-fit text-base-content/70 transition-colors hover:text-primary">Settings</Link>
        </nav>

        <div className="flex flex-col gap-3 text-sm">
          <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-base-content/45">Stay connected</h2>
          <p className="leading-6 text-base-content/65">Keep up with new conversations and updates from your community.</p>
          <Link to="/home" className="btn bg-red-500 btn-sm mt-1 w-fit px-5">Join the conversation</Link>
        </div>
      </div>

      <div className="border-t border-base-300/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-xs text-base-content/50 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-12">
          <span>© {new Date().getFullYear()} Socially. All rights reserved.</span>
          <span>Made for meaningful connections.</span>
        </div>
      </div>
    </footer>
  )
}
