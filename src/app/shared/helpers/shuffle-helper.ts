export class ShuffleHelper {
    uniqueRandoms:number[] = [];
    constructor() {

    }
    getRandom(totalRandomCount: number):number {
        this.refillIfNecessary(totalRandomCount);
        var randomIndex = this.getRandomIndex();
        var uniqueRandomValue = this.uniqueRandoms[randomIndex];
        this.removeRandomValueFromIndex(randomIndex);

        return uniqueRandomValue;
    }

    private refillIfNecessary(totalRandomCount:number):void{
        if (this.isEmptyRandoms()) {
            this.refillRandoms(totalRandomCount);
        }
    }

    private getRandomIndex(){
        return Math.floor(Math.random() * this.uniqueRandoms.length);
    }

    private removeRandomValueFromIndex(index:number){
        this.uniqueRandoms.splice(index, 1);
    }

    private isEmptyRandoms():boolean{
        return this.uniqueRandoms.length==0;
    }
    private refillRandoms(totalRandomCount:number) {
        for (var i = 0; i < totalRandomCount; i++) {
            this.uniqueRandoms.push(i);
        }
    }
}
