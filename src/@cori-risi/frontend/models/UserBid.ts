import ArtPieceBid from "./ArtPieceBid";

export default class UserBid {
    bidId: string;
    bidTotal: number;
    bidItems: [ArtPieceBid];

    constructor (items: [ArtPieceBid]) {
        const minId = 100000,
            maxId = 199999;
        this.bidId = Math.floor(Math.random() * (maxId - minId + 1) + minId).toString();
        this.bidTotal = items
            .map((artPieceBid) => artPieceBid.userBid)
            .reduce((previousBidTally = 0.0, userBid) => {
                console.log("Tallying bids for individual pieces...");
                console.log("previousBidTally:", previousBidTally);
                console.log("current artPieceBid:", userBid);
                return previousBidTally + userBid;
            });
        console.log("Bid total:");
        console.log(typeof this.bidTotal);
        console.log(this.bidTotal);
        this.bidItems = [ ...items ];
    }
}
