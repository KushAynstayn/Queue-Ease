import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <main id="home" className="relative isolate flex min-h-screen items-center overflow-hidden px-6 pt-28 pb-16 sm:px-8 lg:px-12">

      {/* AI Grid Background */}
      <div className="hero-grid" />

      {/* Background Blobs */}
      <div className="pointer-events-none absolute -left-40 top-20 -z-10 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl animate-blob" />

      <div className="pointer-events-none absolute right-0 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-blue-200/20 blur-3xl animate-blob animation-delay-4000" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-2 -mt-18">

        {/* LEFT SIDE */}

        <div className="animate-fade-up text-center lg:text-left">

          <h1 className="text-5xl font-black leading-tight text-slate-900 lg:text-6xl">

            <span className="gradient-text">
              Queue Ease
            </span>

            <span className="text-[#2845D6]">:</span>

            <br />

            <span className="text-slate-900 text-4xl">
              An AI-Powered Forecasting
            </span>

            <br />

            <span className="text-slate-900 text-4xl">
              and SMS Alerts System
            </span>

          </h1>

          {/* Animated Queue Indicator */}

          <div className="mt-8 flex justify-center lg:justify-start">
            <div className="queue-line">
              <span className="queue-dot" />
            </div>
          </div>

          {/* Description */}

          <p className="mt-8 max-w-xl text-md leading-9 text-slate-600">

            A modern queue management platform that leverages AI-powered
            forecasting and automated SMS notifications to reduce waiting
            time, improve operational efficiency, and deliver a smoother,
            smarter service experience for every client.

          </p>

        </div>

        {/* RIGHT SIDE */}

        <div className="flex justify-center">

          <Image
            src="/images/img.png"
            alt="Queue Ease Illustration"
            width={650}
            height={650}
            priority
            className="
              animate-float
              w-full
              max-w-[560px]
              object-contain
              drop-shadow-[0_35px_55px_rgba(40,69,214,0.18)]
              transition-transform
              duration-500
              hover:scale-105
            "
          />

        </div>

      </div>

    </main>
  );
}