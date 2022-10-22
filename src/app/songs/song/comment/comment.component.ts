import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { User } from "app/shared/entities/user";
import { UserAccountAccessService } from "app/shared-account/user-account-access.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SongService } from "../../../shared-songs/song.service";
import { Song } from "app/shared/entities/song";
import { Comment } from "app/shared/entities/comment";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { PaginationService } from "../../../shared/services/pagination.service";
import { PagedResponse } from "app/shared-models/paged-response";

@Component({
  moduleId: module.id,
  selector: "nl-comment",
  templateUrl: "comment.component.html",
  providers: [SongService],
  styleUrls: ["./comment.component.css"],
})
export class CommentComponent implements OnInit {
  comments: Comment[];
  user: User;
  postCommentForm: FormGroup;
  showEditer: boolean;
  disablePostButton: boolean;
  _pagedComment: PagedResponse<Comment>;
  hasMore: boolean;
  _song: Song;
  isSongOwner = false;
  isEditor = false;

  @Input() set song(song: Song) {
    this._song = song;
    this.getComments();
    this.setIsSongOwner();
    this.setIsEditor();
  }

  get song(): Song {
    return this._song;
  }

  constructor(
    private authService: UserAuthService,
    private userAccountAccessService: UserAccountAccessService,
    private fb: FormBuilder,
    private songService: SongService,
    private route: ActivatedRoute,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.disablePostButton = false;
    this.getComments();
    this.postCommentForm = this.fb.group({
      comment: ["", Validators.compose([Validators.required])],
    });
    this.user = this.authService.getUser();
    this.authService.userLoggedInEvent.subscribe((loggedInUser) => {
      this.user = loggedInUser;
      this.setIsSongOwner();
      this.setIsEditor();
    });
  }
  setIsSongOwner(): void {
    this.isSongOwner = this.authService.isOwnedByLoggedInUser(this.song);
  }
  setIsEditor(): void {
    this.isEditor = this.authService.isEditor();
  }
  showLogIn(): void {
    this.userAccountAccessService.showLogin();
  }

  showRegister(): void {
    this.userAccountAccessService.showRegister();
  }

  postComment(): void {
    var comment = this.postCommentForm.controls["comment"];
    this.disablePostButton = true;
    this.songService
      .postComment(comment.value, this.song.songId)
      .subscribe((postedComment) => {
        this.postCommentForm.reset();
        this.comments.unshift(postedComment);
        this.disablePostButton = false;
      });
  }

  getComments(): void {
    if (this.song.songId) {
      this.songService.getCommentsForSong(this.song.songId).subscribe((val) => {
        var itemMap = val;
        this.comments = itemMap["items"];
        this._pagedComment = val;
        this.hasMore = this.paginationService.hasNext(val.links);
      });
    }
  }

  openEditer(comment: Comment): void {
    comment.edited = true;
  }

  deleteComment(comment: Comment): void {
    this.songService.deleteComment(comment.id).subscribe((val) => {
      this.getComments();
    });
  }

  editedComment() {
    this.getComments();
  }

  getMoreComments() {
    // let nextPageSongIntroOfArtistUrl = this.paginationService
    // .getNextPageUrl(val.links);

    let nextCommentUrl = this.paginationService.getNextPageUrl(
      this._pagedComment.links
    );
    if (nextCommentUrl) {
      this.getCommentsWithUrl(nextCommentUrl);
    }
  }

  getCommentsWithUrl(nextCommentUrl: string): void {
    this.paginationService
      .getNextPageResponse<Comment>(nextCommentUrl)
      .subscribe((pagedResponse) => {
        this._pagedComment = pagedResponse;
        this.addCommentsFromPagedResponse();
        this.hasMore = this.paginationService.hasNext(pagedResponse.links);
      });
  }

  addCommentsFromPagedResponse() {
    let newComments = new Array<Comment>();
    newComments = newComments.concat(this.comments);
    for (let com of this._pagedComment.items) {
      newComments.push(com);
    }
    this.comments = newComments;
  }
}
