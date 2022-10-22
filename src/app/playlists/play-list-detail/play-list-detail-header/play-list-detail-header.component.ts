import {
  Component,
  OnInit,
  Input,
  AfterContentInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { PlayList } from "app/shared/entities/play-list";
import { PlayListService } from "app/add-to-play-list/play-list.service";
import { UserAuthService } from "app/identity/user-auth-service.service";
@Component({
  selector: "nl-play-list-detail-header",
  templateUrl: "./play-list-detail-header.component.html",
  styleUrls: ["./play-list-detail-header.component.css"],
})
export class PlayListDetailHeaderComponent implements OnInit, AfterContentInit {
  profilePictureSize: any;
  _playlist: PlayList;
  @Input()
  set playlist(playlist: PlayList) {
    this._playlist = playlist;
  }
  get playlist(): PlayList {
    return this._playlist;
  }

  @ViewChild("profilepicture", { static: true })
  profilepicture: ElementRef;

  isEditable = false;
  constructor(
    private authService: UserAuthService,
    private playListService: PlayListService
  ) {}

  ngOnInit() {
    this.setIsEditable();
    this.authService.userLoggedInEvent.subscribe((user) => {
      this.setIsEditable();
    });
  }
  ngAfterContentInit() {
    if (this.profilepicture) {
      this.profilePictureSize = this.profilepicture.nativeElement.offsetWidth;
    }
  }
  setIsEditable(): void {
    this.isEditable = this.authService.isEditable(this._playlist);
  }
  updateTitle() {
    this.playListService
      .updateTitle(this._playlist.id, this._playlist.title)
      .subscribe((response) => {});
  }
  changeAccessibility() {
    this.playListService
      .updateAccessibility(this._playlist.id, !this._playlist.private)
      .subscribe((response) => {
        this._playlist.private = !this._playlist.private;
      });
  }
}
