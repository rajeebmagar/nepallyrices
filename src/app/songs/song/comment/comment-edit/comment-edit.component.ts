import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";
import { SongService } from "app/shared-songs/song.service";
import { Comment } from "app/shared/entities/comment";

@Component({
  selector: "nl-comment-edit",
  templateUrl: "./comment-edit.component.html",
  styleUrls: ["./comment-edit.component.css"],
})
export class CommentEditComponent implements OnInit {
  @Input() comment: Comment;
  textValue: string;
  @Output()
  editedComment: EventEmitter<Comment> = new EventEmitter<Comment>();

  constructor(private songService: SongService) {}

  ngOnInit() {
    this.textValue = this.comment.comment;
  }

  patchComment(newComment: string): void {
    this.songService
      .patchComment(this.comment.id, newComment)
      .subscribe((val) => {
        var itemMap = val;
        this.comment.edited = false;
        this.editedComment.emit(this.comment);
      });
  }
  cancel(): void {
    this.editedComment.emit(this.comment);
  }
}
