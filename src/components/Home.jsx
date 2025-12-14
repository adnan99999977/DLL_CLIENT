import FeaturedLessons from "./FeaturedLessons";
import HeroSlider from "./HeroSlider";
import MostSavedLessons from "./MostSavedLessons";
import TopContributors from "./TopContributors";
import { WhyLearningMatters } from "./WhyLearningMatters";

const Home = () => {
  return (
    <div className="space-y-16 ">
      <HeroSlider />
      <FeaturedLessons />
      <WhyLearningMatters />
      <TopContributors />
      <MostSavedLessons />
    </div>
  );
};

export default Home;
