import Container from '@/components/_core/layout/Container';
import CountUp from '@/components/ui/CountUp';

export default function HighlightsSection() {
  const stats = [
    { label: 'Participants', value: 5000, suffix: '+' },
    { label: 'Events', value: 16, suffix: '' },
    { label: 'Prize Pool', value: 100, prefix: '₹', suffix: 'K' },
    { label: 'Colleges', value: 50, suffix: '+' },
  ];

  return (
    <section className='py-24 bg-muted/10 border-y border-white/5'>
      <Container>
        <div className='flex flex-col lg:flex-row justify-between items-center gap-12'>
          <div className='lg:w-[25%] text-center lg:text-left'>
            <h2 className='text-4xl font-zen-dots mb-4 text-red-600'>Last Year&apos;s <span className='text-primary'>Legacy</span></h2>
            <p className='text-muted-foreground font-zen-dots'>
              TALOS 2025 set new benchmarks. This year, we go beyond limits.
            </p>
          </div>

          <div className='lg:w-[75%] grid grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
            {stats.map((stat, i) => (
              <div key={i} className='text-center px-4 py-6 bg-black/40 rounded-xl border border-white/5 hover:border-primary/30 transition-colors'>
                <h3 className='text-3xl font-zen-dots text-white mb-2 flex justify-center items-center'>
                  {stat.prefix}
                  <CountUp
                    from={0}
                    to={stat.value}
                    separator=","
                    direction="up"
                    duration={1}
                    className="count-up-text"
                  />
                  {stat.suffix}
                </h3>
                <p className='text-[10px] text-red-500 uppercase tracking-wider'>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}