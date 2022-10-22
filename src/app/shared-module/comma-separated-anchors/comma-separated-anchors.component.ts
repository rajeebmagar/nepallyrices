import { Component, OnInit, Input } from "@angular/core";
import { Anchor } from "app/shared-models/anchor";

@Component({
  selector: "nl-comma-separated-anchors",
  templateUrl: "./comma-separated-anchors.component.html",
  styleUrls: ["./comma-separated-anchors.component.css"],
})
export class CommaSeparatedAnchorsComponent implements OnInit {
  @Input()
  anchors: Anchor[];

  @Input() cssClasses: string;
  constructor() {}

  @Input() seperator: string = ",";

  ngOnInit() {}
}
