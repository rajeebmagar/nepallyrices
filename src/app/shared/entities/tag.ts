export class Tag {
    tagId:number;
    name:string;

    public static NewTagId = -101;
    public static NewTag(tagName):Tag{
        return {
            tagId: this.NewTagId,
            name: `Add new tag '${tagName}'`
        } as Tag;
    }
}
