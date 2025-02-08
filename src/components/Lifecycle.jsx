function Lifecycle() {
  return (
    <section id="lifecycle" className="py-32 min-h-screen flex flex-col justify-center items-center">
      <h2 className="text-4xl md:text-5xl mb-12 text-center font-light tracking-tight">
        A Dance of Transformation
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-[1200px] mt-12 px-4">
        <div className="feature-card p-6 md:p-10 rounded">
          <h3 className="text-2xl md:text-3xl mb-6 font-normal text-accent">The Golden Crown</h3>
          <p className="text-base md:text-lg leading-relaxed">
            Beginning as a vibrant yellow flower head composed of hundreds of tiny florets, each dandelion is actually a composite of many individual flowers working in harmony.
          </p>
        </div>
        <div className="feature-card p-6 md:p-10 rounded">
          <h3 className="text-2xl md:text-3xl mb-6 font-normal text-accent">The Metamorphosis</h3>
          <p className="text-base md:text-lg leading-relaxed">
            After pollination, the flower closes and undergoes a remarkable transformation, reopening to reveal a perfect sphere of silver-white seeds ready for their journey.
          </p>
        </div>
        <div className="feature-card p-6 md:p-10 rounded">
          <h3 className="text-2xl md:text-3xl mb-6 font-normal text-accent">The Journey</h3>
          <p className="text-base md:text-lg leading-relaxed">
            Each seed, equipped with its own parachute of fine hairs, can travel vast distances on the slightest breeze, ensuring the species' survival and spread.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Lifecycle;