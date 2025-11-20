import React, { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";


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
            <Link 
              to="/dashboard" 
              className="bg-emerald-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold 
                        text-base sm:text-lg hover:bg-emerald-600 transition shadow-xl 
                        transform hover:scale-105 inline-block"
            >
              Now Start From Today
            </Link>

            <a
              href="https://youtu.be/9JC8th7WWis?si=8E_JMsSqBAcIUH7a"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="border border-blue-600 text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition transform hover:scale-105">
                View Demo
              </button>
            </a>

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

<footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-700">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

    {/* Brand */}
    <div className="flex flex-col gap-3 col-span-1">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
            <path d="M4 12c0-4 4-8 8-8s8 4 8 8-4 8-8 8S4 16 4 12z" fill="white" opacity="0.08" />
            <path d="M7 12l3 3 7-7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white leading-tight">Fino_Treasury</h3>
          <p className="text-xs text-gray-400 -mt-0.5">Track expenses • Grow wealth</p>
        </div>
      </div>

      <p className="mt-2 text-sm text-gray-400">
        Track expenses, manage investments & build long-term wealth — secure and easy.
      </p>
    </div>

    {/* Tools */}
    <div>
      <h4 className="text-lg font-semibold text-white mb-3">Finance Tools</h4>
      <ul className="space-y-2 text-sm">
        <li><a href="/dashboard" className="hover:text-emerald-400 transition">Expense Tracker</a></li>
        <li><a href="/savings" className="hover:text-emerald-400 transition">Savings Planner</a></li>
        <li><a href="/dashboard/investment" className="hover:text-emerald-400 transition">Investment Analyzer</a></li>
        <li><a href="/dashborad/reports" className="hover:text-emerald-400 transition">Reports</a></li>
      </ul>
    </div>

    {/* Learn */}
    <div>
      <h4 className="text-lg font-semibold text-white mb-3">Learn Finance</h4>
      <ul className="space-y-2 text-sm">
        <li><a href="https://www.kindafrugal.com/budgeting-tips-that-actually-work/" className="hover:text-blue-400 transition">Budgeting Tips</a></li>
        <li><a href="https://www.hdfc.bank.in/blogs/demat-account/what-is-smart-investing-5-tips-for-smart-investments" className="hover:text-blue-400 transition">Investment Basics</a></li>
        <li><a href="https://www.investopedia.com/terms/r/retirement-planning.asp" className="hover:text-blue-400 transition">Retirement Planning</a></li>
        <li><a href="https://www.investopedia.com/articles/pf/12/good-debt-bad-debt.asp" className="hover:text-blue-400 transition">Debt Management</a></li>
      </ul>
    </div>

    {/* Social & CTA */}
    <div className="flex flex-col items-start md:items-end text-left md:text-right">
      <div className="mb-3">
        <h4 className="text-lg font-semibold text-white mb-2">Stay Connected</h4>
        <p className="text-sm text-gray-400">Follow us for tips, updates & community.</p>
      </div>

      {/* Social icons */}
      <div className="flex gap-3 flex-wrap">
        {/* X */}
        <a href="https://x.com/@AbhishekGi47650"
          target="_blank"
          className="group p-2 rounded-md bg-gray-800 hover:bg-gray-700 transform hover:scale-105 transition"
        >
          <svg className="w-5 h-5 text-gray-300 group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 5.92c-.66.29-1.37.48-2.11.57.76-.45 1.34-1.16 1.61-2.02-.71.42-1.5.73-2.34.9A3.74 3.74 0 0 0 12.3 8c0 .3.03.6.1.88A10.6 10.6 0 0 1 3 5.1a3.73 3.73 0 0 0 1.16 4.98c-.59-.02-1.14-.18-1.62-.45v.05c0 1.8 1.28 3.3 2.98 3.65-.5.14-1.02.17-1.54.06.43 1.33 1.68 2.3 3.16 2.33A7.5 7.5 0 0 1 2 19.54a11 11 0 0 0 6 1.76c7.2 0 11.15-6 11.15-11.2v-.51c.77-.56 1.4-1.27 1.92-2.08-.7.31-1.44.52-2.22.61z"/>
          </svg>
        </a>

        {/* LinkedIn */}
        <a href="https://www.linkedin.com/in/abhishek-gilbile-a8b081331/"
          target="_blank"
          className="group p-2 rounded-md bg-gray-800 hover:bg-gray-700 transform hover:scale-105 transition"
        >
          <svg className="w-5 h-5 text-gray-300 group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8.99h4.48V24H.24zM9.75 8.99h4.3v2.07h.06c.6-1.14 2.06-2.34 4.24-2.34 4.53 0 5.37 2.98 5.37 6.85V24h-4.48v-7.6c0-1.81-.03-4.14-2.52-4.14-2.52 0-2.9 1.96-2.9 3.99V24H9.75z"/>
          </svg>
        </a>

        {/* GitHub */}
        <a
            href="https://github.com/abhigilbile74"
            target="_blank"
            className="group p-2 rounded-md bg-gray-800 hover:bg-gray-700 transform hover:scale-105 transition"
          >
            <svg
              className="w-5 h-5 text-gray-300 group-hover:text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 
              3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 
              0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.083-.729.083-.729 
              1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 
              2.807 1.304 3.492.997.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 
              0-1.31.468-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 
              0 0 1.005-.322 3.3 1.23a11.48 11.48 0 0 1 3.003-.404 
              11.48 11.48 0 0 1 3.003.404c2.28-1.552 3.285-1.23 
              3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 
              1.23 1.91 1.23 3.22 0 4.61-2.807 5.625-5.48 
              5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 
              3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 
              24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
          </a>

      </div>

      <div className="mt-6 w-full md:w-auto">
        <a href="/contact" className="inline-block w-full md:w-auto px-4 py-2 bg-emerald-500 text-white rounded-md shadow hover:bg-emerald-600 transition text-center">
          Contact Us
        </a>
      </div>
    </div>
  </div>

  <p className="text-center mt-10 text-gray-500 text-xs">
    © {new Date().getFullYear()} Fino_Treasury — Designed with ❤️ for Smarter Finance.
  </p>
</footer>


    </div>
  );
};

export default FinoTreasuryLanding;
