import Nav from "./nav";
import User from "./user";

export default function Sidebar() {
	return (
		<header className="fixed bottom-3 md:bottom-auto md:left-3 md:inset-y-0 flex z-50 w-full md:w-auto px-3 md:px-0">
			<section className="bg-secondary bg-[url('/noise.webp')] h-20 md:h-[98vh] w-full md:w-52 flex flex-row md:flex-col items-center md:items-stretch md:pt-6 px-4 md:px-4 z-50 overflow-hidden relative rounded-3xl rounded-b-none md:rounded-none md:rounded-r-none">
				<div className="hidden md:block z-50 pointer-events-none">
					<div className="absolute -bottom-12 -left-19 w-full h-15 bg-[url('/wave.svg')] bg-repeat-x bg-size-[100%_60px] scale-y-[-1]" />
					<div className="absolute -bottom-12 left-0 w-full h-15 bg-[url('/wave.svg')] bg-repeat-x bg-size-[100%_60px] scale-y-[-1]" />
					<div className="absolute -bottom-12 left-19 w-full h-15 bg-[url('/wave.svg')] bg-repeat-x bg-size-[100%_60px] scale-y-[-1]" />
				</div>

				<div className="md:hidden z-50 pointer-events-none">
					<div className="absolute -bottom-13 -left-57 w-full h-15 bg-[url('/wave.svg')] bg-repeat-x bg-size-[100%_60px] scale-y-[-1]" />
					<div className="absolute -bottom-13 -left-76 w-full h-15 bg-[url('/wave.svg')] bg-repeat-x bg-size-[100%_60px] scale-y-[-1]" />
					<div className="absolute -bottom-13 -left-89 w-full h-15 bg-[url('/wave.svg')] bg-repeat-x bg-size-[100%_60px] scale-y-[-1]" />
					<div className="absolute -bottom-13 -left-38 w-full h-15 bg-[url('/wave.svg')] bg-repeat-x bg-size-[100%_60px] scale-y-[-1]" />
					<div className="absolute -bottom-13 -left-19 w-full h-15 bg-[url('/wave.svg')] bg-repeat-x bg-size-[100%_60px] scale-y-[-1]" />
					<div className="absolute -bottom-13 left-0 w-full h-15 bg-[url('/wave.svg')] bg-repeat-x bg-size-[100%_60px] scale-y-[-1]" />
					<div className="absolute -bottom-13 left-19 w-full h-15 bg-[url('/wave.svg')] bg-repeat-x bg-size-[100%_60px] scale-y-[-1]" />
					<div className="absolute -bottom-13 left-38 w-full h-15 bg-[url('/wave.svg')] bg-repeat-x bg-size-[100%_60px] scale-y-[-1]" />
					<div className="absolute -bottom-13 left-57 w-full h-15 bg-[url('/wave.svg')] bg-repeat-x bg-size-[100%_60px] scale-y-[-1]" />
					<div className="absolute -bottom-13 left-76 w-full h-15 bg-[url('/wave.svg')] bg-repeat-x bg-size-[100%_60px] scale-y-[-1]" />
					<div className="absolute -bottom-13 left-89 w-full h-15 bg-[url('/wave.svg')] bg-repeat-x bg-size-[100%_60px] scale-y-[-1]" />
				</div>
				<h1 className="hidden md:block text-2xl md:text-4xl md:ml-3 md:mb-6 mr-4 md:mr-0 shrink-0">Leeseo</h1>
				<Nav />
				<div className="md:mt-auto">
					<User />
				</div>
			</section>
		</header>
	);
}
