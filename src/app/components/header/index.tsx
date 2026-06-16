import Nav from "./nav";

export default function Header() {
    return (
        <header className="fixed left-3 inset-y-0 flex">
            <section
                className="bg-secondary bg-[url('/noise.webp')] h-[98vh] left-0 md:w-52 w-16 flex flex-col pt-6 px-4 z-50 overflow-hidden relative"
            >
                <div className="z-50">
                    <div className="absolute bottom-0 -left-19 w-full h-15 bg-[url('/wave.svg')] bg-repeat-x bg-size-[100%_60px] scale-y-[-1]" />
                    <div className="absolute bottom-0 left-0 w-full h-15 bg-[url('/wave.svg')] bg-repeat-x bg-size-[100%_60px] scale-y-[-1]" />
                    <div className="absolute bottom-0 left-19 w-full h-15 bg-[url('/wave.svg')] bg-repeat-x bg-size-[100%_60px] scale-y-[-1]" />
                </div>
                <h1 className="text-4xl ml-3 mb-6">Leeseo</h1>
                <Nav />
            </section>
        </header>
    )
}