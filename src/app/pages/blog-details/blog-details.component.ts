import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SocialComponent } from '../../components/social/social.component';
import { DataService } from '../../core/services/data.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    SocialComponent,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.scss',
})
export class BlogDetailsComponent implements OnInit {
  constructor(
    private _DataService: DataService,
    private _ActivatedRoute: ActivatedRoute,
    private toaster: ToastrService
  ) {}

  // slug or id
  blogParam: any = '';
  blogDetails: any = {};
  tags: any = [];
  blogs: any = [];
  blogListById: any = {};
  isListId: boolean = false;
  writeReview!: FormGroup;
  isLoading: boolean = false;
  blogCategories: any = [];

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (param) => {
        // 
        this.blogParam = param.get('slug');
        // 

        if (!isNaN(Number(this.blogParam))) {
          this._DataService.getCategoriesBlog(this.blogParam).subscribe({
            next: (response) => {
              // 
              this.blogListById = response.data;
              this.isListId = true;
              response.data.created_at = this.formatDate(
                response.data.created_at
              );
            },
          });
        } else {
          this._DataService.getBlogs(this.blogParam).subscribe({
            next: (response) => {
              // 
              this.blogDetails = response.data;
              this.isListId = false;
              response.data.created_at = this.formatDate(
                response.data.created_at
              );
              this.tags = this.blogDetails.tags
                .split(',')
                .map((name: any) => name.trim());

              // this.writeReview.patchValue({ tour_id: response.data.id });
            },
          });
        }
      },
    });
    this.showBlogs();
    this.showCategoriesBlog();
    this.writeReview = new FormGroup({
      reviewer_name: new FormControl(''),
      rate: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(5),
      ]),
      // confirm: new FormControl(''),
      content: new FormControl(''),
      tour_id: new FormControl(null),
    });
  }

  getWriteReview() {
    if (this.writeReview.valid) {
      
      this.isLoading = true;
      this._DataService.postReviews(this.writeReview.value).subscribe({
        next: (response) => {
          
          if (response.status == true) {
            this.toaster.success(response.message);
            this.isLoading = false;
          }
        },
      });
      this.writeReview.reset();
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
  }

  showBlogs() {
    this._DataService.getBlogs().subscribe({
      next: (res) => {
        // 
        this.blogs = res.data.data;
      },
      error: (err) => {
        // 
      },
    });
  }

  showCategoriesBlog() {
    this._DataService.getCategoriesBlog().subscribe({
      next: (res) => {
        // 
        this.blogCategories = res.data.data;
      },
      error: (err) => {
        // 
      },
    });
  }
}
