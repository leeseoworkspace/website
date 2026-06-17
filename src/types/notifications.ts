export interface CardSoldPayload {
	buyer_username?: string;
	idol_name?: string;
	group_name?: string;
	card_short_id?: string;
	total?: number;
}

export interface Notification {
    id: number;
    type: string;
    payload: any;
    read: boolean;
    createdAt: Date;
    userId: string;
}
