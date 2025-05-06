import Banner from './components/Banner/Banner';
import FeatureSection from './components/FeatureSection/FeatureSection';
import { Header } from './components/Header/Header';
import ServicesSection from './components/ServiceSection/ServiceSection';

function App() {
  return (
    <div>
      <Header/>
      <Banner/>
      <ServicesSection/>
      <FeatureSection />
    </div>
  );
}

export default App;