import { SongAudio } from "app/shared-models/song-audio";
import { ShuffleHelper } from "app/shared/helpers/shuffle-helper";
export class SongAudioPlayList {
  public songAudios: SongAudio[];
  private songAudioMap: Map<number, SongAudio>;
  private shuffleHelper = new ShuffleHelper();

  private queueIndex: number = 0;

  constructor() {
    this.songAudioMap = new Map<number, SongAudio>();
    this.songAudios = [];
  }

  isInQueue(songAudio: SongAudio): boolean {
    return this.songAudioMap.has(songAudio.id);
  }
  removeFromQueue(songAudio: SongAudio) {
    if (this.isInQueue(songAudio)) {
      this.songAudioMap.delete(songAudio.id);
      var index = this.songAudios.indexOf(songAudio);
      this.songAudios.splice(index, 1);
    }
  }
  addToQueue(songAudio: SongAudio) {
    if (!this.isInQueue(songAudio)) {
      this.songAudioMap.set(songAudio.id, songAudio);
      this.songAudios.push(songAudio);
    }
  }
  addToQueueToPlayNext(songAudio: SongAudio) {
    if (!this.songAudioMap.has(songAudio.id)) {
      this.songAudioMap.set(songAudio.id, songAudio);
      this.songAudios.splice(this.queueIndex + 1, 0, songAudio);
    }
  }
  getCurrent(): SongAudio {
    return this.songAudios[this.queueIndex];
  }
  getAll(): SongAudio[] {
    return this.songAudios;
  }
  getNext(): SongAudio {
    if (this.hasNext()) {
      this.queueIndex++;
      return this.getCurrent();
    } else {
      throw new RangeError("play list completed");
    }
  }
  getAudioCount(): number {
    return this.songAudios.length;
  }
  getRandom(): SongAudio {
    this.queueIndex = this.shuffleHelper.getRandom(this.getAudioCount());
    return this.getCurrent();
  }
  getPrevious(): SongAudio {
    if (this.hasPrevious()) {
      this.queueIndex--;
      return this.getCurrent();
    } else {
      throw new RangeError("No previous item exist");
    }
  }
  hasPrevious(): boolean {
    return this.queueIndex > 0;
  }
  hasNext(): boolean {
    return this.queueIndex < this.songAudios.length - 1;
  }
  isEmpty(): boolean {
    return this.songAudios.length == 0;
  }
  clear(): void {
    this.queueIndex = -1;
    this.songAudioMap.clear();
    this.songAudios = [];
  }
  clearExcept(exceptSongAudio: SongAudio): void {
    if (this.isInQueue(exceptSongAudio)) {
      while (this.songAudios.length > 1) {
        let songAudio = this.songAudios.filter(
          (sa) => sa.id != exceptSongAudio.id
        )[0];
        this.removeFromQueue(songAudio);
      }
    }
  }
  setCurrentPlaying(songAudio: SongAudio) {
    if (this.songAudioMap.has(songAudio.id)) {
      this.queueIndex = this.songAudios.findIndex((s) => s.id == songAudio.id);
    }
  }
  rewind(): void {
    this.queueIndex = 0;
  }
}
