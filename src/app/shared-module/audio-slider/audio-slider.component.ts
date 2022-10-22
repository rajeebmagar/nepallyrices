import { Component, OnInit,Input, Output,EventEmitter } from '@angular/core';
@Component({
  selector: 'nl-audio-slider',
  templateUrl: './audio-slider.component.html',
  styleUrls: ['./audio-slider.component.css']
})
export class AudioSliderComponent implements OnInit {
  @Input() currentTime: number;
  @Input() duration: number;
  @Input() bufferCss: string;
  @Input() bufferedTime: number;
  @Output() change =new EventEmitter<number>();
  @Output() sliding = new EventEmitter<boolean>();

  @Input() disabled: boolean;

  constructor() { }

  ngOnInit() {
     if(this.duration==0)
       this.duration=.5;//otherwise thumb will go to max
  }

  getPercentByDuration(value:number):number{
     if(this.duration>0)
        return (value/this.duration)*100;
     return 0;
  }
  seekAudioPlayerTo(sliderChangeEvent: any):void{
    this.change.next(sliderChangeEvent.value);
  }
  sliderThumbMoving(event:any):void{
    this.sliding.next(event.source._isSliding);
  }
}
