import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      {/* Background Image */}
      <Image
        src="/gentelinda.jpeg" // Path starts from the 'public' folder
        alt="Background"
        fill
        priority // Ensures it loads immediately
        className="object-cover -z-10" // Stays behind all content
      />

      {/* Your Page Content */}
      <div className="relative z-10 p-8">
        {/* <h1>Contenido sobre el fondo</h1> */}
      </div>
    </main>
  );
}
