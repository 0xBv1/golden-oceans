import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-blog-cart',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './blog-cart.component.html',
  styleUrl: './blog-cart.component.scss',
})
export class BlogCartComponent {
  constructor(private _DataService: DataService) {}
  @Input() blogs: any[] = []; // Used for displaying blogs passed from parent
  @Output() blogsLoaded = new EventEmitter<any[]>(); // Used only when fetching from API

  ngOnInit(): void {
    // If blogs not passed via input, fetch from API
    if (!this.blogs.length) {
      this._DataService.getBlogs().subscribe({
        next: (res) => {
          const data = res?.data?.data ?? res ?? [];
          this.blogs = data;
          this.blogsLoaded.emit(data); // Emit to parent
          
        },
        error: (err) => {
          
        },
      });
    }
  }
}
