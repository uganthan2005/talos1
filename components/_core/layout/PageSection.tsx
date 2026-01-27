import Container from './Container';

export default function PageSection({ children, title, className = '' }: { children: React.ReactNode; title?: string; className?: string }) {
  return (
    <section className={`py-12 ${className}`}>
      <Container>
        {title && <h2 className='text-3xl font-bold mb-8 text-center'>{title}</h2>}
        {children}
      </Container>
    </section>
  );
}
