function Navbar() {
  return (
    <nav className="flex justify-between items-center py-4">
      <div className="text-2xl md:text-3xl font-light tracking-wider">Taraxacum</div>
      <div className="hidden md:flex gap-12 text-lg tracking-wider">
        <a href="#nature" className="text-[#F9F6EE] opacity-80 hover:opacity-100 transition-opacity duration-400 relative after:content-[''] after:absolute after:w-0 after:h-px after:-bottom-1 after:left-0 after:bg-[#F9F6EE] after:transition-all after:duration-400 hover:after:w-full">Nature</a>
        <a href="#lifecycle" className="text-[#F9F6EE] opacity-80 hover:opacity-100 transition-opacity duration-400 relative after:content-[''] after:absolute after:w-0 after:h-px after:-bottom-1 after:left-0 after:bg-[#F9F6EE] after:transition-all after:duration-400 hover:after:w-full">Lifecycle</a>
        <a href="#symbolism" className="text-[#F9F6EE] opacity-80 hover:opacity-100 transition-opacity duration-400 relative after:content-[''] after:absolute after:w-0 after:h-px after:-bottom-1 after:left-0 after:bg-[#F9F6EE] after:transition-all after:duration-400 hover:after:w-full">Symbolism</a>
      </div>
    </nav>
  );
}

export default Navbar;