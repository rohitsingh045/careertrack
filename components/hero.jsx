"use client";

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'

const HeroSection = () => {

    const imageRef = useRef(null);

    useEffect(() => {

        const imageElement = imageRef.current;

        const handleScroll = () => {


            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;

            if (scrollPosition > scrollThreshold) {
                imageElement.classList.add("scrolled")
            }
            else {
                imageElement.classList.remove("scrolled");
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [])

    return (
        <section className='w-full pt-36 md:pt-48 pb-10'>
            <div className="container mx-auto px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">
                        Your AI Career Coach for
                        <br />
                        Professional Success
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mb-8">
                        Advance your career with personalized guidance, interview prep, and
                        AI-powered tools for job success.
                    </p>
                </div>

                <div className="flex justify-center gap-4 mb-12">
                    <Link href="/dashboard">
                        <Button size="lg" className="px-8">Get Started</Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button size="lg" className="px-8" variant="outline">Learn More</Button>
                    </Link>
                </div>

               <div className="hero-image-wrapper mt-10 md:mt-0 relative flex items-center justify-center">
  {/* Background glow */}
  <div
    ref={imageRef}
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-28 bg-primary/20 -z-10 rounded-full blur-5xl"
  />

  {/* Image with clean border and shadow */}
  <div className="relative rounded-2xl shadow-xl ring-1 ring-gray-300">
    <Image
      src="/banner.jpeg"
      width={1300}
      height={30}
      alt="Dashboard Preview"
      className="rounded-2xl object-cover"
    />
  </div>
</div>






            </div>
        </section>
    )
}

export default HeroSection
