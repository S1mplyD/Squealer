// tweet.service.ts
import { Injectable } from '@angular/core';
import { Squeal } from 'app/interfaces/squeal.interface';
@Injectable({
  providedIn: 'root'
})
export class SquealService {
  private squeals: Squeal[] = [
    // Example tweets
    {
      id: 1,
      username: 'john_doe',
      content: 'Hello, Squealer!',
      timestamp: new Date()
    },
    {
      id: 2,
      username: 'jane_smith',
      content: 'Angular is awesome!',
      timestamp: new Date()
    },
    {
      id: 3,
      username: 'marco_rossi',
      content: 'Hello, Squealer!',
      timestamp: new Date()
    },
    {
      id: 4,
      username: 'fabio_vitali',
      content: 'Che figata!',
      timestamp: new Date()
    },
    {
      id: 5,
      username: 'luca_bennati',
      content: 'SIUUUUM!',
      timestamp: new Date()
    },
    {
      id: 6,
      username: 'mia_khalifa',
      content: 'GLUB!',
      timestamp: new Date()
    },
    {
      id: 7,
      username: 'master_chief',
      content: 'Sir, finishing this Big Mac!',
      timestamp: new Date()
    }
    // Add more tweets as needed
  ];

  getTweets(): Squeal[] {
    // Sort tweets by timestamp in descending order
    return this.squeals.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}
