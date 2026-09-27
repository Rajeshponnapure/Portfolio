import { Outlet } from 'react-router-dom';
import { Background } from '../components/Background';
import { Cursor } from '../components/Cursor';
import { Dock } from '../components/Dock';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

export function Layout() {
  return (
    <>
      <Cursor />
      <Background />
      <Header />
      <Dock />
      <main className="desktop">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}