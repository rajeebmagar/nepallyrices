import { Component, OnInit, Input } from "@angular/core";
import { TagInputOption } from "../../shared-models/tag-input-option";

@Component({
  selector: "nl-tag-input-option",
  templateUrl: "./tag-input-option.component.html",
  styleUrls: ["./tag-input-option.component.css"],
})
export class TagInputOptionComponent implements OnInit {
  @Input() option: TagInputOption;
  constructor() {}

  ngOnInit() {}
}
