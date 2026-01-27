import PageSection from '@/components/_core/layout/PageSection';

export default function SponsorsPage() {
  const sponsors = [
    { name: 'TechCorp', tier: 'Title Sponsor' },
    { name: 'InnovateInc', tier: 'Platinum' },
    { name: 'DevStudio', tier: 'Gold' },
    { name: 'CloudNet', tier: 'Gold' },
    { name: 'SecureBit', tier: 'Silver' },
    { name: 'Gameify', tier: 'Silver' },
  ];

  return (
    <PageSection title='Our Sponsors' className='min-h-screen'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
        {sponsors.map((sponsor, index) => (
          <div key={index} className='flex flex-col items-center justify-center p-8 bg-white/5 rounded-xl border border-white/10 hover:border-primary/50 transition-all hover:bg-white/10 group'>
             <div className='w-full aspect-video bg-black rounded-lg flex items-center justify-center mb-4 border border-white/5 group-hover:border-primary/20'>
               <span className='text-xl font-black text-gray-500 group-hover:text-primary transition-colors'>{sponsor.name}</span>
             </div>
             <span className='text-xs font-mono uppercase tracking-widest text-muted-foreground'>{sponsor.tier}</span>
          </div>
        ))}
      </div>
      
      <div className='mt-16 text-center'>
        <p className='text-muted-foreground mb-6'>Interested in sponsoring TALOS 2026?</p>
        <button className='px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-primary hover:text-white transition-colors'>
          Download Prospectus
        </button>
      </div>
    </PageSection>
  );
}