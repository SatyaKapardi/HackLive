import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Menu } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/">
              <a className="font-bold text-2xl text-primary">HackList</a>
            </Link>
            <span className="ml-2 text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded font-medium">
              BETA
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/">
              <a className="text-muted-foreground hover:text-foreground font-medium">
                Browse
              </a>
            </Link>
            <Link href="/admin-login">
              <a className="text-muted-foreground hover:text-foreground font-medium">
                Admin
              </a>
            </Link>
            <Button className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition">
              Sign In
            </Button>
          </div>
          
          <Button
            variant="ghost"
            className="md:hidden text-foreground p-2"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t">
              <Link href="/">
                <a className="block px-3 py-2 rounded-md text-base font-medium text-foreground">
                  Browse
                </a>
              </Link>
              <Link href="/admin-login">
                <a className="block px-3 py-2 rounded-md text-base font-medium text-foreground">
                  Admin
                </a>
              </Link>
              <Link href="/signin">
                <a className="block px-3 py-2 rounded-md text-base font-medium text-primary">
                  Sign In
                </a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
