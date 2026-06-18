import { getCardUrl } from "@/lib/cards";
import type { ShopListingWithCard } from "@/types/shop";
import { Modal, Button as HeroButton } from "@heroui/react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import Button from "../mixed/button";

function BuyModal({ listing, locale }: { listing: ShopListingWithCard; locale: string }) {
    const formatter = new Intl.NumberFormat(locale);

    const dateLocale = locale === "pt-BR" ? ptBR : enUS;

    const userBalance = 60345;
    const balanceAfterPurchase = userBalance - listing.price;

    return (
        <Modal>
            <HeroButton
                className="hover:scale-105 transition-transform shadow-lg disabled:cursor-not-allowed bg-defaultsecondary text-defaulttext rounded-lg p-2 px-3 text-sm w-full cursor-pointer"
            >
                Comprar
            </HeroButton>

            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-150 bg-background">
                        <Modal.CloseTrigger className="bg-text/5 dark:bg-text/1 size-10 text-text hover:scale-108 transition-transform shadow-lg" />
                        <Modal.Header>
                            <Modal.Heading className="text-xl text-text">Confirmação de compra</Modal.Heading>
                        </Modal.Header>

                        <Modal.Body className="py-6">
                            <div className="flex md:gap-4 flex-col md:flex-row">
                                <div className="flex gap-4 md:mr-1 mr-2">
                                    <div className="relative w-28 h-44 md:w-40 md:h-60 overflow-hidden">
                                        <Image
                                            src={getCardUrl(listing.card_id)}
                                            alt={listing.idol_name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col md:hidden">
                                        <div className="flex flex-col w-full px-1 mb-3 text-text">
                                            <div className="flex items-start w-full md:flex-row flex-col md:items-center">
                                                <span className="text-xl md:text-2xl flex">{listing.idol_name}</span>
                                                <span className="text-xs md:text-lg">{listing.short_id}</span>
                                            </div>
                                            <div className="flex md:items-center items-start flex-col w-full md:flex-row">
                                                <span className="grow flex text-text/90 md:text-lg">{listing.group_name}</span>
                                                <span className="text-text/75 text-sm md:text-base max-w-60 mt-1">{listing.era_name}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xl text-text mb-1">
                                                Vendedor(a)
                                            </p>
                                            <p className=" text-lg text-text">{listing.seller_username}</p>
                                            <p className="text-text/70">
                                                ID: {listing.seller_id}
                                            </p>
                                            <p className="text-text/60 mt-1">
                                                Listado {formatDistanceToNow(listing.listed_at, {
                                                    addSuffix: true,
                                                    locale: dateLocale,
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col md:gap-4">
                                    <div className="md:flex flex-col w-full mt-2 px-1 md:min-h-8 min-h-30 text-text hidden">
                                        <div className="flex items-start w-full md:flex-row flex-col md:items-center">
                                            <span className="text-xl md:text-2xl grow flex">{listing.idol_name}</span>
                                            <span className="text-xs md:text-lg">{listing.short_id}</span>
                                        </div>
                                        <div className="flex md:items-center items-start flex-col w-full md:flex-row">
                                            <span className="grow flex text-text/90 md:text-lg">{listing.group_name}</span>
                                            <span className="text-text/75 text-sm md:text-base max-w-60 mt-1">{listing.era_name}</span>
                                        </div>
                                    </div>

                                    <div className="hidden md:flex flex-col">
                                        <p className="text-2xl text-text mb-1">
                                            Vendedor(a)
                                        </p>
                                        <p className="text-lg text-text">{listing.seller_username}</p>
                                        <p className="text-text/70">
                                            ID: {listing.seller_id}
                                        </p>
                                        <p className="text-text/60 mt-1">
                                            Listado {formatDistanceToNow(listing.listed_at, {
                                                addSuffix: true,
                                                locale: dateLocale,
                                            })}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-2xl text-text mb-1">
                                            Total
                                        </p>
                                        <p className="text-xl text-text">
                                            {formatter.format(listing.price)} Mangos
                                        </p>
                                        <p className="text-sm text-text/80">
                                            Seu saldo após a compra:{" "}
                                            <span className="text-text">
                                                {formatter.format(balanceAfterPurchase)} Mangos
                                            </span>
                                        </p>

                                    </div>

                                    <div className="md:mr-1 mr-2 mt-3 md:mt-0">
                                        <HeroButton
                                            className="hover:scale-103 transition-transform shadow-lg disabled:cursor-not-allowed bg-defaultsecondary text-defaulttext rounded-lg h-10 text-sm w-full cursor-pointer"
                                        >
                                            Confirmar Compra
                                        </HeroButton>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}

export default BuyModal;