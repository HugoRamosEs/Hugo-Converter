export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="w-full mt-auto py-6 px-4 border-t border-[#3f3f3f]">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-gray-400 text-sm">
          © {currentYear} Hugo Converter. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
