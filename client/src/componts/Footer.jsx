import founderFitLogo from '../assets/founderFit-logo.png'

function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-white text-primary">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-8 lg:flex-row lg:items-center lg:justify-between">
        <a href="/" aria-label="FounderFit home" className="shrink-0">
          <img src={founderFitLogo} alt="FounderFit" className="h-20 w-auto" />
        </a>

        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-medium">
            <li><a href="#privacy-policy" className="transition-colors hover:text-blue-600">Privacy Policy</a></li>
            <li><a href="#terms-of-service" className="transition-colors hover:text-blue-600">Terms of Service</a></li>
            <li><a href="mailto:support@founderfit.com" className="transition-colors hover:text-blue-600">Contact Support</a></li>
            <li><a href="#success-stories" className="transition-colors hover:text-blue-600">Success Stories</a></li>
          </ul>
        </nav>

        <p className="text-center text-sm text-primary/60 lg:text-right">
          &copy; {new Date().getFullYear()} FounderFit. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
