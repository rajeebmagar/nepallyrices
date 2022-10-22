import { Injectable } from '@angular/core';

@Injectable()
export class CoverPhotoHelper {
    public IMAGE_WIDTH: any = 1000;
    public IMAGE_HEIGHT: any = 400;
    public CONTAINER_HEIGHT = 300;
    public CROP_OFFSET = 100;
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
        let ratio =  totalWidth/this.IMAGE_WIDTH;
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
    getYOffset(originalOffsetPercentage: any): any {
        originalOffsetPercentage = originalOffsetPercentage * -1;
        if (originalOffsetPercentage > 0) {
            let scaledImageHeight = this.getScaledImageHeight();
            let excessHeight = scaledImageHeight - this.IMAGE_HEIGHT;
            if (excessHeight > 0) {
                let offsetHeight = (originalOffsetPercentage / 100) * scaledImageHeight;
                if (excessHeight >= offsetHeight)
                    return -offsetHeight;
                else
                    return -excessHeight;
            }
            else{
                return 0;
            }
        }
        return 0;
    }
    getOffsetPercentage(offset: any): any {
        let scaledImageHeight = this.getScaledImageHeight();
        return (offset / scaledImageHeight) * 100;
    }
    getScaledImageHeight(): any {
        var imageRatio = this.IMAGE_HEIGHT / this.IMAGE_WIDTH;
        var containeerRatio = this.CONTAINER_HEIGHT / window.innerWidth;
        let actualImageHeight = 0;
        if (containeerRatio > imageRatio) {
            return this.CONTAINER_HEIGHT;
        }
        else {
            return window.innerWidth * imageRatio;
        }
    }
}
