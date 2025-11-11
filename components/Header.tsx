"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { AlignJustify, Coins } from "lucide-react";

const Header = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered1, setIsHovered1] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="relative w-[90%] max-w-7xl top-0 z-50 bg-[#0D0E0F] bg-transparent backdrop-blur-md border mt-8 rounded-xl border-[#252627]"
    >
      <div className="w-full px-6 h-16 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="text-2xl text-white">
            combien<span className="font-semibold">sur10</span>.fr
          </Link>
        </motion.div>

        <div className="flex bp2:hidden items-center gap-8">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent data-[state=open]:bg-transparent hover:bg-transparent data-[state=open]:text-white hover:text-white transition-colors duration-200">
                  Products
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <motion.ul 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid w-[600px] gap-3 p-6 bg-gradient-to-r from-[#090B0F] backdrop-blur-md to-[#171B24] border border-[#252627] rounded-xl grid-cols-2"
                  >
                    <li className="col-span-1">
                      <span className="text-lg font-medium text-[#5B698B]">
                        Products
                      </span>
                      <ul className="mt-4 space-y-2">
                        <li>
                          <NavigationMenuLink asChild>
                            <a
                              href="/dashboard"
                              className="text-white hover:text-[#8096D2] block pb-1 transition-colors duration-200"
                            >
                              Dashboard
                              <div className="w-[150px] h-[1px] mt-4 bg-gradient-to-r from-[#2E3A58] to-[#455783]" />
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <a
                              href="/"
                              className="text-white hover:text-[#8096D2] block pb-1 transition-colors duration-200"
                            >
                              Face Analysis
                              <div className="w-[150px] h-[1px] mt-4 bg-gradient-to-r from-[#2E3A58] to-[#455783]" />
                            </a>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </li>
                    <li className="col-span-1">
                      <ul className="mt-12 space-y-4">
                        <li>
                          <NavigationMenuLink asChild>
                            <a
                              href="/about"
                              className="text-white hover:text-[#8096D2] block pb-1 transition-colors duration-200"
                            >
                              About
                              <div className="w-[150px] h-[1px] mt-4 bg-gradient-to-r from-[#2E3A58] to-[#455783]" />
                            </a>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </li>
                  </motion.ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent data-[state=open]:bg-transparent hover:bg-transparent data-[state=open]:text-white hover:text-white transition-colors duration-200">
                  Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <motion.ul 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid w-[600px] gap-3 p-6 bg-gradient-to-r from-[#090B0F] backdrop-blur-md to-[#171B24] border border-[#252627] rounded-xl grid-cols-2"
                  >
                    <li className="col-span-1">
                      <span className="text-lg font-medium text-[#5B698B]">
                        Tools
                      </span>
                      <ul className="mt-4 space-y-2">
                        <li>
                          <NavigationMenuLink asChild>
                            <a
                              href="/"
                              className="text-white hover:text-[#8096D2] block pb-1 transition-colors duration-200"
                            >
                              Face Analyzer
                              <div className="w-[150px] h-[1px] mt-4 bg-gradient-to-r from-[#2E3A58] to-[#455783]" />
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <a
                              href="/"
                              className="text-white hover:text-[#8096D2] block pb-1 transition-colors duration-200"
                            >
                              Symmetry Calculator
                              <div className="w-[150px] h-[1px] mt-4 bg-gradient-to-r from-[#2E3A58] to-[#455783]" />
                            </a>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </li>
                    <li className="col-span-1">
                      <ul className="mt-12 space-y-4">
                        <li>
                          <NavigationMenuLink asChild>
                            <a
                              href="/"
                              className="text-white hover:text-[#8096D2] block pb-1 transition-colors duration-200"
                            >
                              Golden Ratio
                              <div className="w-[150px] h-[1px] mt-4 bg-gradient-to-r from-[#2E3A58] to-[#455783]" />
                            </a>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </li>
                  </motion.ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/about" className={cn("text-sm hover:text-[#8096D2] transition-colors duration-200")}>
                    Contact Us
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <AlignJustify className="w-6 h-6 hidden bp2:flex text-white hover:text-[#8096D2] transition-colors cursor-pointer" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex bp3:hidden items-center gap-4"
        >
          {session ? (
            <>
              {/* Credit Badge */}
              <motion.div 
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-[#2E3139] to-[#1E2536] border-[1px] border-[#5B698B] rounded-full"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Coins className="w-4 h-4 text-[#8096D2]" />
                <span className="text-white font-light text-sm">
                  {session.user.creditsRemaining || 0} credits
                </span>
              </motion.div>

              {/* Dashboard Button */}
              <motion.button
                className="group relative overflow-hidden border-[2px] border-[#5B698B] rounded-full bg-gradient-to-b from-black to-[rgb(65,64,64)] px-8 py-2 text-white backdrop-blur-sm transition-colors hover:bg-[rgba(0,0,0,0.30)]"
                onMouseMove={handleMouseMove}
                onHoverStart={() => setIsHovered1(true)}
                onHoverEnd={() => setIsHovered1(false)}
                onClick={() => router.push('/dashboard')}
              >
                <span className="relative z-10">Dashboard</span>
                {isHovered1 && (
                  <motion.div
                    className="absolute inset-0 z-0"
                    animate={{
                      background: [
                        `radial-gradient(40px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.15), transparent 50%)`,
                      ],
                    }}
                    transition={{ duration: 0.15 }}
                  />
                )}
              </motion.button>

              {/* Logout Button */}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 text-white text-sm font-light hover:text-red-400 transition-colors duration-200"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              {/* Log in Button */}
              <motion.button
                className="group relative overflow-hidden border-[2px] border-[#5B698B] rounded-full bg-gradient-to-b from-black to-[rgb(65,64,64)] px-8 py-2 text-white backdrop-blur-sm transition-colors hover:bg-[rgba(0,0,0,0.30)]"
                onMouseMove={handleMouseMove}
                onHoverStart={() => setIsHovered1(true)}
                onHoverEnd={() => setIsHovered1(false)}
                onClick={() => router.push('/auth/signin')}
              >
                <span className="relative z-10">Log in</span>
                {isHovered1 && (
                  <motion.div
                    className="absolute inset-0 z-0"
                    animate={{
                      background: [
                        `radial-gradient(40px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.15), transparent 50%)`,
                      ],
                    }}
                    transition={{ duration: 0.15 }}
                  />
                )}
              </motion.button>

              {/* Get Started Button */}
              <motion.button
                className="group relative flex border-[2px] border-[#5B698B] overflow-hidden rounded-full bg-gradient-to-b from-[rgb(91,105,139)] to-[#414040] px-8 py-2 text-white backdrop-blur-sm transition-colors hover:bg-[rgba(255,255,255,0.2)]"
                onMouseMove={handleMouseMove}
                onHoverStart={() => setIsHovered2(true)}
                onHoverEnd={() => setIsHovered2(false)}
                onClick={() => router.push('/auth/signup')}
              >
                <span className="relative z-10">Get Started</span>
                {isHovered2 && (
                  <motion.div
                    className="absolute inset-0 z-0"
                    animate={{
                      background: [
                        `radial-gradient(40px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.2), transparent 50%)`,
                      ],
                    }}
                    transition={{ duration: 0.15 }}
                  />
                )}
              </motion.button>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Header;

