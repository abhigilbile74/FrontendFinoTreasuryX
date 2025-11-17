import React, { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";

const FinoTreasuryLanding = () => {
  useEffect(() => {
    document.title = "Fino_Treasury";
  }, []);

  const scrollRef = useRef(null);
  const sliderRef = useRef(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollInterval = 4000; // 4 seconds per slide
    const scrollAmount = 350; // pixels to scroll (adjust as needed)

    const scrollSlides = () => {
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    };

    const interval = setInterval(scrollSlides, scrollInterval);
    return () => clearInterval(interval);
  }, []);

      // main Slider
    useEffect(()=>{
      const container =sliderRef.current;
      if(!container) return;

      const scrollInterval = 4000; // 4 seconds per slide
      const scrollAmount = 1150; // pixels to scroll (adjust as needed)
      const scrollSlides = () => {
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    };
    const interval = setInterval(scrollSlides, scrollInterval);
    return () => clearInterval(interval);
    })

  

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 text-gray-900 dark:text-gray-100 font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section id="insights" className="flex flex-col items-center justify-center pt-16 md:pt-20 pb-12 md:pb-16 px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            Smarter <span className="text-blue-600">Financial Management</span>
            <br className="hidden sm:inline" />
            <span className="text-emerald-500">Building Your Tomorrow, Today.</span>
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 px-4">
            Your Financial Edge. Gain real-time visibility of your cash flow, manage liquidity,
            automate payments, and make data-driven decisions—all to accelerate progress toward your
            biggest financial goals. Securely managed, powerfully simple.
          </p>
          <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
            <button className="bg-emerald-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-emerald-600 transition shadow-xl transform hover:scale-105">
              Bulid your Wealthy
            </button>
            <button className="border border-blue-600 text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition transform hover:scale-105">
              Now Start From Today
            </button>
          </div>
        </div>

        {/* Sliding Dashboard Section */}
       {/* Sliding Dashboard Section */}
<div className="mt-8 sm:mt-12 md:mt-16 w-full max-w-6xl overflow-hidden relative rounded-xl shadow-2xl">
  <div
    ref={sliderRef}
    className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth hide-scrollbar"
  >

    {/* Slide 1 */}
    <div className="min-w-full relative h-[250px] sm:h-[300px] md:h-[400px] snap-center">
      <img 
        src="https://www.shutterstock.com/image-photo/two-businesspeople-accountant-team-analyzing-260nw-2443676383.jpg"
        alt="Financial Dashboard"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex justify-center items-center">
        <p className="text-white text-2xl md:text-3xl font-bold">💹 Financial Dashboard</p>
      </div>
    </div>

    {/* Slide 2 */}
    <div className="min-w-full relative h-[250px] sm:h-[300px] md:h-[400px] snap-center">
      <img 
        src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200"
        alt="Budget Insights"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex justify-center items-center">
        <p className="text-white text-2xl md:text-3xl font-bold">📈 Budget Insights</p>
      </div>
    </div>

    {/* Slide 3 */}
    <div className="min-w-full relative h-[250px] sm:h-[300px] md:h-[400px] snap-center">
      <img 
        src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200"
        alt="Cash Flow Tracker"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex justify-center items-center">
        <p className="text-white text-2xl md:text-3xl font-bold">🧾 Cash Flow Tracker</p>
      </div>
    </div>

  </div>
</div>

      </section>

      {/* Finance Education Section */}
      <section
        id="insights"
        className="px-4 sm:px-6 md:px-8 lg:px-20 py-12 sm:py-16 md:py-20 bg-gray-100 dark:bg-gray-900/70 text-gray-600 dark:text-gray-400"
      >
        <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-12">
          <h3 className="text-emerald-600 dark:text-emerald-400 mb-2 sm:mb-3 text-lg sm:text-xl md:text-2xl">
            Personal Finance Education 🎓
          </h3>
          <p className="text-sm sm:text-base md:text-lg">Swipe or scroll to explore top finance News.</p>
        </div>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory max-w-7xl mx-auto hide-scrollbar scroll-smooth"
        >
          {[
            {
              icon: "🐷",
              title: "Budgeting & Debt Avoidance",
              desc: "Learn to plan expenses wisely and avoid high-interest debts to maintain financial balance.",
              color: "emerald",
              link: "https://www.investopedia.com/budgeting-4689737",
            },
            {
              icon: "📈",
              title: "Saving & Investing Mastery",
              desc: "Understand compound growth and build long-term wealth through smart investments.",
              color: "blue",
              link: "https://www.investopedia.com/investing-4427784",
            },
            {
              icon: "🔒",
              title: "Financial Security",
              desc: "Build an emergency fund and secure your future with insurance and retirement planning.",
              color: "indigo",
              link: "https://www.nerdwallet.com/article/finance/financial-security",
            },
            {
              icon: "🧠",
              title: "Informed Decision Making",
              desc: "Learn how to make data-driven financial choices that align with your life goals.",
              color: "yellow",
              link: "https://www.investopedia.com/terms/d/decision-making.asp",
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`min-w-[85vw] sm:min-w-[300px] md:min-w-[350px] flex-shrink-0 bg-white dark:bg-gray-800 p-4 sm:p-5 md:p-6 rounded-xl shadow-lg border-t-4 border-${card.color}-500 hover:shadow-xl transition duration-300 snap-center`}
            >
              <div className={`bg-${card.color}-500/10 p-2 sm:p-3 rounded-full inline-block mb-2 sm:mb-3 text-xl sm:text-2xl`}>
                {card.icon}
              </div>
              <h4 className="mb-2 text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200">{card.title}</h4>
              <p className="text-xs sm:text-sm md:text-base mb-3 sm:mb-4">{card.desc}</p>
              <a
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-block mt-2 sm:mt-4 text-${card.color}-600 dark:text-${card.color}-400 hover:underline text-sm sm:text-base`}
              >
                Learn More →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center border-t border-gray-700">
        <p>
          © {currentYear} <span className="text-white font-semibold">Fino_Treasury</span> — Empowering Smarter Finance
        </p>
      </footer>
    </div>
  );
};

export default FinoTreasuryLanding;
