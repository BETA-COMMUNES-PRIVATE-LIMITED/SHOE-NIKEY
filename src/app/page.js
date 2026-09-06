import Navbar from '../components/navbar/Navbar';
import Hero from '../components/hero/Hero';
import Categories from '../components/categories/Categories';
import BestSellers from '../components/bestsellers/BestSellers';
import Footer from '../components/footer/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-between px-4 md:px-8 max-w-[1440px] mx-auto" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />
      <Hero />
      <Categories />
      <BestSellers />
      <Footer />
    </main>
  );
}