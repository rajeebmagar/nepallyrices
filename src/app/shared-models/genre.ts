export class Genre {
    genreId:number;
    name:string;

    public static readonly NewGenreId = -101;
    public static NewGenre(name:string):Genre{
        return {
            genreId: this.NewGenreId,
            name: `Add new genre ${name}`
        } as Genre;
    }
}
