import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 p-8 text-center">
			<div className="relative">
				<h1 className="text-9xl italic opacity-10 select-none">404</h1>
				<div className="absolute inset-0 flex items-center justify-center">
					<h2 className="text-4xl italic">Página não encontrada</h2>
				</div>
			</div>
			
			<p className="text-text/60 max-w-md">
				A página que você está procurando não existe ou foi movida.
			</p>

			<Link 
				href="/"
				className="bg-secondary bg-[url('/noise.webp')] text-text px-8 py-3 rounded-2xl transition-transform hover:scale-105 active:scale-95 shadow-xl mt-4"
			>
				Voltar para o início
			</Link>
		</div>
	);
}
