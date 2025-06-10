import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">HOKM</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">HOKM</h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              HOKM helps you automatically classify structured data based on local and international regulations,
              including Saudi NDMO, NCA, PDPL, GDPR, and DAMA.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button>Get Started</Button>
            </Link>
            <Link href="https://github.com/iRashedK/Data-System" target="_blank" rel="noreferrer">
              <Button variant="outline">GitHub</Button>
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by Rashed. The source code for HOKM is available on{" "}
              <a
                href="https://github.com/iRashedK/Data-System"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
