export default class ArtPiece {
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
}
