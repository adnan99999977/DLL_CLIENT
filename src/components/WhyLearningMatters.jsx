import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaLightbulb, FaBrain, FaUsers, FaRocket } from "react-icons/fa";

const benefits = [
  {
    icon: <FaLightbulb className="text-3xl text-primary" />,
    title: "Real-Life Wisdom",
    description:
      "Learning from real experiences teaches lessons that no textbook can. These lessons stay with you for life.",
  },
  {
    icon: <FaBrain className="text-3xl text-secondary" />,
    title: "Decision Making",
    description:
      "Life-based learning sharpens your judgment and helps you take better decisions in real situations.",
  },
  {
    icon: <FaUsers className="text-3xl text-accent" />,
    title: "Stronger Relationships",
    description:
      "Understanding people, emotions, and experiences makes communication and empathy stronger.",
  },
  {
    icon: <FaRocket className="text-3xl text-info" />,
    title: "Personal Growth",
    description:
      "Each life lesson helps you grow mentally, emotionally, and professionally and confident over time.",
  },
];

export const WhyLearningMatters = () => {
   const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="py-16 ">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Why Learning From Life Matters
        </h2>
        <p className="text-base-content/70">
          Life itself is the best teacher. Every experience carries a lesson
          that shapes who we are and who we become.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 cursor-pointer">
          {benefits.map((project, idx) => (
            <div
              key={idx}
              className="relative group block p-2 h-full w-full"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Hover Background */}
              <AnimatePresence>
                {hoveredIndex === idx && (
                  <motion.div
                    className="absolute inset-0 h-full w-full bg-blue-500/20 rounded-2xl z-0"
                    layoutId="hoverBackground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.2 } }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  />
                )}
              </AnimatePresence>

              {/* Card Content */}
              <div className="relative z-10 rounded-2xl p-6 bg-base-100 border flex flex-col items-center border-transparent group-hover:border-blue-500 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="mb-4">{project.icon}</div>
                <h4 className="text-lg font-semibold text-center mb-2">
                  {project.title}
                </h4>
                <p className="text-sm text-base-content/70 text-center">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
