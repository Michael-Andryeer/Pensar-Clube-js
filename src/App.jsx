import Banner from './components/Banner/Banner';
import FAQ from './components/FAQ/FAQ';
import FeatureSection from './components/FeatureSection/FeatureSection';
import { Header } from './components/Header/Header';
import ServicesSection from './components/ServiceSection/ServiceSection';
import Testimonials from './components/Testimonials/Testimonials';

function App() {
  return (
    <div>
      <Header/>
      <Banner/>
      <ServicesSection/>
      <FeatureSection />
      <Testimonials/>
      <FAQ/>
    </div>
  );
}

export default App;