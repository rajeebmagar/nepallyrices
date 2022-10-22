import { Injectable } from '@angular/core';

@Injectable()
export class ProfilePhotoHelper {
    public IMAGE_WIDTH: any = 600;
    public IMAGE_HEIGHT: any = 600;
    public CROP_OFFSET = 10;
    getCropWidth(): any {
        this.getCropRatio() * this.IMAGE_WIDTH;
    }
    getCropHeight(): any {
        this.getCropRatio() * this.IMAGE_HEIGHT;
    }
    getCropRatio(): any {
        let widthRatio = this.getWidthRatio();
        let heightRatio = this.getHeightRatio();
        if(widthRatio<heightRatio)
            return widthRatio;
        else
            return heightRatio;
    }
    getHeightRatio():any{
        let ratio = 420/this.IMAGE_HEIGHT;
        if (ratio >= 1) {
            return 1;
        }
        else if (ratio >= 0.5) {
            return 0.5;
        }
        else {
            return 0.25;
        }
    }
    getWidthRatio():any{
        let totalWidth = (window.innerWidth * 0.7);
        let ratio = totalWidth/this.IMAGE_WIDTH;
        if (ratio >= 1) {
            return 1;
        }
        else if (ratio >= 0.5) {
            return 0.5;
        }
        else {
            return 0.25;
        }
    }
}
