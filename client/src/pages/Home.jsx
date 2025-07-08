import ProjectsPage from "../components/Certifications";
import ContactPage from "../components/Contact";
import CoursesPage from "../components/CousesPage";
import HeroSection from "../components/HeroSection";
import PlacedStudents from "../components/PlacedStudents";
import ReviewsPage from "../components/Reviews";

const Home = () => {
  return (
    <div id="home">
      <HeroSection />
      <CoursesPage />
      <ProjectsPage />
      <PlacedStudents />
      <ReviewsPage />
      <ContactPage />
      {/* <Map /> */}
    </div>
  );
};

export default Home;
