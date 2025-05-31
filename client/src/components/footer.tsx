import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="/">
              <a className="font-bold text-xl text-primary">HackList</a>
            </Link>
            <p className="text-muted-foreground mt-2">The most comprehensive hackathon discovery platform</p>
          </div>
          <div className="flex flex-wrap gap-6 justify-center md:justify-end">
            <Link href="/admin">
              <a className="text-muted-foreground hover:text-primary">Admin Panel</a>
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} HackList. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
