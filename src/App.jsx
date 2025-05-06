import Banner from './components/Banner/Banner';
import FAQ from './components/FAQ/FAQ';
import FeatureSection from './components/FeatureSection/FeatureSection';
import Footer from './components/Footer/Footer';
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
      <Footer/>
    </div>
  );
}

export default App;