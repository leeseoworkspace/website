import { getCardUrl } from "@/lib/cards";
import type { ShopListingWithCard } from "@/types/shop";
import { Modal, Button as HeroButton } from "@heroui/react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { useI18n } from "@/context/i18n";
import { useAuth } from "@/context/auth";
import { useState } from "react";
import { LoadingText } from "../mixed/loading-text";
import { useRouter } from "next/navigation";
import { IconCheck } from "@tabler/icons-react";

function BuyModal({ listing, locale, onPurchaseSuccess }: { listing: ShopListingWithCard; locale: string; onPurchaseSuccess: (remaining: number) => void }) {
    const { t } = useI18n();
    const { user, refreshUser } = useAuth();
    const router = useRouter();
    const formatter = new Intl.NumberFormat(locale);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);
    const [remainingQty, setRemainingQty] = useState(0);

    const dateLocale = locale === "pt-BR" ? ptBR : enUS;

    const userBalance = user?.cash ?? 0;
    const balanceAfterPurchase = userBalance - listing.price;

    const handleConfirmPurchase = async () => {
        if (!user) {
            router.push("/api/discord/auth/login");
            return;
        }

        setIsPurchasing(true);
        try {
            const res = await fetch("/api/shop", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    listingId: listing.listing_id,
                    quantity: 1,
                }),
            });

            const data = await res.json();
            if (data.ok) {
                await refreshUser();
                setRemainingQty(data.remaining ?? 0);
                setPurchaseSuccess(true);
            } else {
                alert(data.reason || "Erro ao realizar compra");
            }
        } catch (error) {
            console.error(error);
            alert("Erro na requisição");
        } finally {
            setIsPurchasing(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open && purchaseSuccess) {
            onPurchaseSuccess(remainingQty);
            setPurchaseSuccess(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={handleOpenChange}>
            <HeroButton
                onPress={() => setIsOpen(true)}
                className="hover:scale-105 transition-transform shadow-lg disabled:cursor-not-allowed bg-defaultsecondary text-defaulttext rounded-lg p-2 px-3 text-sm w-full cursor-pointer"
            >
                {t("shop.buy")}
            </HeroButton>

            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-150 bg-background">
                        {({ close }) => (
                            <>
                                <Modal.CloseTrigger className="bg-text/5 dark:bg-text/1 size-10 text-text hover:scale-108 transition-transform shadow-lg" />
                                <Modal.Header>
                                    <Modal.Heading className="text-xl text-text">
                                        {t("shop.confirm_purchase")}
                                    </Modal.Heading>
                                </Modal.Header>

                                <Modal.Body className="py-6">
                                    {purchaseSuccess ? (
                                        <div className="flex flex-col items-center justify-center py-6 text-center text-text animate-fadeIn">
                                            <IconCheck className="w-16 h-16 text-green-500 mb-4" />
                                            <h3 className="text-2xl mb-2">{t("shop.purchase_success")}</h3>
                                            <p className="text-text/75 mb-6 max-w-sm">
                                                {t("shop.purchase_success_desc")}
                                            </p>
                                            <HeroButton
                                                onPress={() => {
                                                    close();
                                                    onPurchaseSuccess(remainingQty);
                                                    setPurchaseSuccess(false);
                                                }}
                                                className="hover:scale-103 transition-transform shadow-lg bg-defaultsecondary text-defaulttext rounded-lg h-10 text-sm px-6 cursor-pointer"
                                            >
                                                {t("buttons.close")}
                                            </HeroButton>
                                        </div>
                                    ) : (
                                        <div className="flex md:gap-4 flex-col md:flex-row">
                                            <div className="flex gap-4 md:mr-1 mr-2">
                                                <div className="relative w-28 h-44 md:w-45 md:h-70 overflow-hidden">
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
                                                            {t("shop.seller")}
                                                        </p>
                                                        <p className=" text-lg text-text">{listing.seller_username}</p>
                                                        <p className="text-text/70">
                                                            {t("shop.seller_id", { id: listing.seller_id })}
                                                        </p>
                                                        <p className="text-text/60 mt-1">
                                                            {t("shop.listed_at", {
                                                                time: formatDistanceToNow(listing.listed_at, {
                                                                    addSuffix: true,
                                                                    locale: dateLocale,
                                                                })
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
                                                        {t("shop.seller")}
                                                    </p>
                                                    <p className="text-lg text-text">{listing.seller_username}</p>
                                                    <p className="text-text/70">
                                                        {t("shop.seller_id", { id: listing.seller_id })}
                                                    </p>
                                                    <p className="text-text/60 mt-1">
                                                        {t("shop.listed_at", {
                                                            time: formatDistanceToNow(listing.listed_at, {
                                                                    addSuffix: true,
                                                                    locale: dateLocale,
                                                            })
                                                        })}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-2xl text-text mb-1">
                                                        {t("shop.total")}
                                                    </p>
                                                    <p className="text-xl text-text">
                                                        {formatter.format(listing.price)} {t("shop.currency")}
                                                    </p>
                                                    {user && (
                                                        <div className="mt-2 space-y-1">
                                                            <p className="text-sm text-text/80">
                                                                Saldo atual:{" "}
                                                                <span className="text-text font-bold">
                                                                    {formatter.format(userBalance)} {t("shop.currency")}
                                                                </span>
                                                            </p>
                                                            {balanceAfterPurchase >= 0 && (
                                                                <p className="text-sm text-text/80">
                                                                    {t("shop.balance_after", {
                                                                        amount: formatter.format(balanceAfterPurchase)
                                                                    })}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}

                                                </div>

                                                <div className="md:mr-1 mr-2 mt-3 md:mt-0">
                                                    <HeroButton
                                                        onPress={handleConfirmPurchase}
                                                        isDisabled={isPurchasing || (user ? userBalance < listing.price : false)}
                                                        className="hover:scale-103 transition-transform shadow-lg disabled:cursor-not-allowed bg-defaultsecondary text-defaulttext rounded-lg h-10 text-sm w-full cursor-pointer"
                                                    >
                                                        {isPurchasing ? (
                                                            <LoadingText text={t("shop.confirming_purchase")} />
                                                        ) : (
                                                            user ? (
                                                                userBalance < listing.price
                                                                    ? "Saldo insuficiente"
                                                                    : t("shop.confirm_purchase")
                                                            ) : t("shop.login_with_discord")
                                                        )}
                                                    </HeroButton>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Modal.Body>
                            </>
                        )}
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}

export default BuyModal;