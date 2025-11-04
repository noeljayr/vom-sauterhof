"use client";

import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { Menu, X, LogOut, User } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import logo from "@/public/logo.svg";
import { IconChevronDown } from "@tabler/icons-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { NavbarContent } from "@/types/navbar";
import { useAuthStore } from "@/stores/useAuthStore";

type Props = {
  content: NavbarContent;
};

export function Navbar({ content }: Props) {
  const headerRef = useRef<HTMLElement>(null);
  const desktopNavRef = useRef<HTMLElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuOverlayRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isEditMode = searchParams.get("mode") === "edit";

  const [isScrolled, setIsScrolled] = useState(false);
  const { userName, enabled, logout } = useAuthStore();
  const isLoggedIn = enabled && userName;

  const addEditModeParam = (href: string) => {
    return isEditMode ? `${href}?mode=edit` : href;
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      logout();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY >= 35;
    setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      handleScroll(); // Set initial scroll state
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: -100, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
        );
      }

      if (desktopNavRef.current) {
        const navItems = desktopNavRef.current.querySelectorAll("a");
        gsap.fromTo(
          navItems,
          { y: -20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.8,
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);

    if (mobileMenuOverlayRef.current && mobileMenuRef.current) {
      const tl = gsap.timeline();

      tl.fromTo(
        mobileMenuOverlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" }
      );

      tl.fromTo(
        mobileMenuRef.current,
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.5, ease: "power3.out" },
        "-=0.2"
      );

      const menuItems =
        mobileMenuRef.current.querySelectorAll(".mobile-menu-item");
      tl.fromTo(
        menuItems,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.out",
        },
        "-=0.2"
      );
    }
  };

  const closeMobileMenu = () => {
    if (mobileMenuOverlayRef.current && mobileMenuRef.current) {
      const tl = gsap.timeline();
      const menuItems =
        mobileMenuRef.current.querySelectorAll(".mobile-menu-item");

      tl.to(menuItems, {
        x: 30,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.in",
      });

      tl.to(
        mobileMenuRef.current,
        {
          x: "100%",
          duration: 0.4,
          ease: "power3.in",
        },
        "-=0.1"
      );

      tl.to(
        mobileMenuOverlayRef.current,
        {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => setIsMobileMenuOpen(false),
        },
        "-=0.2"
      );
    }
  };

  const links = [
    {
      name: content.linkStart || "Start",
      href: "/",
    },
    {
      name: content.linkAbout || "Über uns",
      href: "/uber-uns",
    },
    {
      name: content.linkNews || "News",
      href: "/news",
    },
    {
      name: content.linkBreed || "Unsere Rassezucht",
      href: "/unsere-rassezucht",
    },
  ];

  const activeLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  if (pathname.startsWith("/content") || pathname.startsWith("/auth")) {
    return <></>;
  }

  return (
    <>
      <div
        style={{ transition: "var(--transition)" }}
        className={`fixed top-0 left-0 w-screen z-[999] ${
          isScrolled ? "bg-[#BEA99A]" : "bg-transparent"
        }`}
      >
        <header
          ref={headerRef}
          className="py-6 flex items-center justify-between"
        >
          <div className="section-container mx-auto grid grid-cols-[auto_auto] items-center justify-between">
            <Link href={'/'} className="flex items-center justify-center">
              <Image
                src={logo}
                alt="Logo"
                className="w-[5rem] max-sm:w-[4rem]"
              />
            </Link>

            <nav
              ref={desktopNavRef}
              className="hidden lg:flex items-center absolute justify-self-center space-x-1 bg-[#DBC6B3] text-[14px] rounded-full p-1"
            >
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={addEditModeParam(link.href)}
                  className={`text-black font-medium  px-4 py-2 ${
                    activeLink(link.href)
                      ? "bg-[#EEE5DD] border border-[#D5BEAA]"
                      : "bg-[#DBC6B3]"
                  } hover:brightness-95 rounded-full cursor-pointer flex justify-center items-center leading-none transition-all duration-300`}
                >
                  {link.name}
                </Link>
              ))}
              <span
                className={`text-black font-medium cursor-pointer  px-4 py-2 ${
                  activeLink("wurf")
                    ? "bg-[#EEE5DD] border border-[#D5BEAA]"
                    : "bg-[#DBC6B3]"
                } hover:brightness-95 rounded-full flex justify-center items-center leading-none transition-all duration-300`}
              >
                {content.linkWurf || "Wurf"}
                <IconChevronDown className="h-4 w-4 ml-2 opacity-75" />
              </span>
            </nav>

            <div className="flex flex-row-reverse items-center gap-3">
              <button
                onClick={openMobileMenu}
                className="lg:hidden p-2 text-black hover:bg-white/20 rounded-md transition-all duration-300"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>

              <Button
                className="text-white font-medium px-4 md:px-6 py-2 h-[35px] md:h-[41px] text-sm md:text-base rounded-md hover:opacity-90 transition-all duration-300"
                style={{ backgroundColor: "#58483B" }}
              >
                {content.contactButton || "Kontaktieren"}
              </Button>
            </div>
          </div>
        </header>

        {isMobileMenuOpen && (
          <div
            ref={mobileMenuOverlayRef}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={closeMobileMenu}
          >
            <div
              ref={mobileMenuRef}
              className="fixed flex flex-col right-0 top-0 h-dvh w-80 bg-[#BEA99A] shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6">
                <Image
                  src={"logo.svg"}
                  width={60}
                  height={60}
                  alt="Logo"
                  className="hover-scale"
                />
                <button
                  onClick={closeMobileMenu}
                  className="p-2 text-black bg-[#EEE5DD] hover:bg-white/50 rounded-md transition-all duration-300"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex flex-col items-center">
                <div className="space-y-1 w-full px-4">
                  <Link
                    href={addEditModeParam("/")}
                    className={`mobile-menu-item block text-black font-medium font-p4 py-2 px-4 rounded-lg ${
                      activeLink("/") ? "bg-[#EEE5DD]" : ""
                    }  hover:bg-white/50 transition-all duration-300`}
                  >
                    {content.linkStart || "Start"}
                  </Link>
                  <Link
                    href={addEditModeParam("/uber-uns")}
                    className={`mobile-menu-item block text-black font-p4 py-2 px-4 rounded-lg ${
                      activeLink("/uber-uns") ? "bg-[#EEE5DD]" : ""
                    } hover:bg-white/30 transition-all duration-300`}
                  >
                    {content.linkAbout || "Über uns"}
                  </Link>
                  <Link
                    href={addEditModeParam("/news")}
                    className={`mobile-menu-item block text-black font-p4 py-2 px-4 rounded-lg ${
                      activeLink("/news") ? "bg-[#EEE5DD]" : ""
                    } hover:bg-white/30 transition-all duration-300`}
                  >
                    {content.linkNews || "News"}
                  </Link>
                  <Link
                    href={addEditModeParam("/unsere-rassezucht")}
                    className={`mobile-menu-item block text-black font-p4 py-2 px-4 rounded-lg ${
                      activeLink("/unsere-rassezucht") ? "bg-[#EEE5DD]" : ""
                    } hover:bg-white/30 transition-all duration-300`}
                  >
                    {content.linkBreed || "Unsere Rassezucht"}
                  </Link>
                  <a
                    href="#"
                    className={`mobile-menu-item block text-black font-p4 py-2 px-4 rounded-lg ${
                      activeLink("#") ? "bg-[#EEE5DD]" : ""
                    } hover:bg-white/30 transition-all duration-300`}
                  >
                    {content.linkWurf || "Wuif"}
                  </a>
                </div>

                <div className="mobile-menu-item absolute bottom-2 pt-6 border-t border-[#A89485] w-full max-w-[240px] text-center">
                  {isLoggedIn ? (
                    <div className="text-black space-y-3">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <User size={18} className="text-[#58483B]" />
                        <span className="font-semibold text-lg">
                          {userName}
                        </span>
                      </div>
                      <Button
                        onClick={handleLogout}
                        className="w-full text-white font-medium py-3 rounded-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
                        style={{ backgroundColor: "#58483B" }}
                      >
                        <LogOut size={18} />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="text-black">
                      <p className="font-semibold mb-3 text-lg">
                        {content.mobileContactHeading || "Familie Sauter"}
                      </p>
                      <p className="text-sm mb-2">
                        {content.mobilePhone || "079 770 49 24"}
                      </p>
                      <p className="text-sm">
                        {content.mobileEmail || "h.sauter@sauterhof.ch"}
                      </p>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>

      {isLoggedIn && (
        <div className="flex flex-col items-center gap-2 fixed bottom-8 right-8 z-[9999] ">
          <button
            onClick={handleLogout}
            className="items-center gap-2 px-3 py-2 bg-[#F38D3B] text-white shadow-lg rounded-[0.5rem] border border-[var(--c-border)] flex opacity-70 cursor-pointer hover:opacity-100"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      )}
    </>
  );
}
