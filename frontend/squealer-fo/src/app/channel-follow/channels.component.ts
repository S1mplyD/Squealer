// account-list.component.ts
import { Component, OnInit } from '@angular/core';
import { User } from 'app/interfaces/account.interface';
import { Subject, takeUntil } from 'rxjs';
import { UsersService } from 'app/services/users.service';
import { AuthService } from 'app/services/auth.service';
import { ChannelsService } from 'app/services/channels.service';
import { Channel } from 'app/interfaces/channels.interface';

@Component({
  selector: 'app-account-list',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss'],
})
export class ChannelListsComponent implements OnInit{
  followResp: string = '';
  unfollowResp: string = '';
  officialChannels: ModChannel = {
    channel: [],
    isFollowed: []
  };
  userId: string = '';
  userChannels: ModChannel = {
    channel: [],
    isFollowed: []
  };
  keywordChannels: ModChannel = {
    channel: [],
    isFollowed: []
  };
  username: string = '';
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private channelService: ChannelsService) {}

    ngOnInit(): void {
      this.authService.isAuthenticated()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.username = res.username;
        this.userId = res._id;
      });
      this.channelService.getOfficialChannels()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
          this.officialChannels.channel = res;
          for (const k of this.officialChannels.channel) {
            var followed = false;
            for (const l of k.allowedRead) {
              if (l === this.userId) {
                followed = true;
                break;
              }
            }
            this.officialChannels.isFollowed.push(followed);
          }
        });
      this.channelService.getUserChannels()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.userChannels.channel = res;
          for (const k of this.userChannels.channel) {
            var followed = false;
            for (const l of k.allowedRead) {
              if (l === this.userId) {
                followed = true;
                break;
              }
            }
            this.userChannels.isFollowed.push(followed);
          }
      });
      this.channelService.getKeywordsChannels()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.keywordChannels.channel = res;
        for (const k of this.keywordChannels.channel) {
          var followed = false;
          for (const l of k.allowedRead) {
            if (l === this.userId) {
              followed = true;
              break;
            }
          }
          this.keywordChannels.isFollowed.push(followed);
        }
        console.log(this.keywordChannels);

      });
    }

    followChannel(name: string): void  {
      this.channelService.followChannel(name)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.followResp = res;
      });
      window.location.reload();
    }

    unfollowChannel(name: string): void  {
      this.channelService.unfollowChannel(name)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.unfollowResp = res;
      });
      window.location.reload();
    }

}

export interface ModChannel {
  channel: Channel[],
  isFollowed: boolean[]
}
