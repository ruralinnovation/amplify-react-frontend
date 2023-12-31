import ArtPiece from "./ArtPiece";
import User from "../../models";

export default class ArtPieceBid extends ArtPiece {
    id: string;
    title: string;
    artist: string;
    description: string;
    altTitle: string;
    height: string;
    objectFit: string;
    src: string;
    mininmumBid: number;
    inStock: boolean;
    readyForPickup: boolean;
    sold: boolean;
    finalBid: number | null;
    userBid: number;
    winner: User | null;

    constructor(piece: ArtPiece, bid: number) {
        super();
        this.id = piece.id;
        this.title = piece.title;
        this.artist = piece.artist;
        this.description = piece.description;
        this.altTitle = piece.altTitle;
        this.height = piece.height;
        this.objectFit = piece.objectFit;
        this.src = piece.src;
        this.mininmumBid = piece.mininmumBid;
        this.inStock = piece.inStock;
        this.readyForPickup = piece.readyForPickup;
        this.sold = piece.sold;
        this.finalBid = piece.finalBid;
        this.userBid = bid;
        this.winner = null;
    }
}
