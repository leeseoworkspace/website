export default function CollectionPage() {
	return (
		<div className="flex flex-col gap-4 p-8">
			<h1 className="text-4xl font-bold italic">Minha Coleção</h1>
			<p className="text-text/60">
				Aqui você poderá ver todos os itens que você já adquiriu.
			</p>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<div
						key={i}
						className="h-40 bg-secondary rounded-3xl"
					/>
				))}
			</div>
		</div>
	);
}
