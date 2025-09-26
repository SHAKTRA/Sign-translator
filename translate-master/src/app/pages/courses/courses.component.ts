import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonBadge,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent
} from '@ionic/angular/standalone';
import { UdemyApiService, UdemyCourse, CourseFilters } from '../../services/udemy-api.service';
import { Subject, takeUntil } from 'rxjs';
import { star, time, people, school, play, bookmark, share, open } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonLabel,
    IonSpinner,
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
    IonBadge,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonRefresher,
    IonRefresherContent
  ]
})
export class CoursesComponent implements OnInit, OnDestroy {
  courses: UdemyCourse[] = [];
  filteredCourses: UdemyCourse[] = [];
  isLoading = false;
  hasApiKey = false;
  
  // API Credentials
  clientId = '';
  clientSecret = '';
  
  // Filters
  searchTerm = '';
  selectedLevel = 'all';
  selectedPrice = 'all';
  selectedCategory = 'all';
  currentPage = 1;
  hasMorePages = true;
  
  // Course categories
  categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'sign-language-basics', label: 'Sign Language Basics' },
    { value: 'asl', label: 'American Sign Language (ASL)' },
    { value: 'bsl', label: 'British Sign Language (BSL)' },
    { value: 'deaf-culture', label: 'Deaf Culture' },
    { value: 'interpretation', label: 'Sign Language Interpretation' }
  ];
  
  levels = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'expert', label: 'Advanced' }
  ];
  
  priceFilters = [
    { value: 'all', label: 'All Prices' },
    { value: 'free', label: 'Free' },
    { value: 'paid', label: 'Paid' }
  ];

  private destroy$ = new Subject<void>();

  constructor(private udemyService: UdemyApiService) {
    addIcons({ star, time, people, school, play, bookmark, share, open });
  }

  ngOnInit() {
    this.hasApiKey = this.udemyService.hasCredentials();
    
    if (this.hasApiKey) {
      this.loadCourses();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setApiCredentials() {
    if (this.clientId.trim() && this.clientSecret.trim()) {
      this.udemyService.setCredentials(this.clientId.trim(), this.clientSecret.trim());
      this.hasApiKey = true;
      this.clientId = '';
      this.clientSecret = '';
      this.loadCourses();
    }
  }

  loadCourses(refresh = false) {
    if (refresh) {
      this.currentPage = 1;
      this.courses = [];
      this.hasMorePages = true;
    }

    this.isLoading = true;
    
    const filters: CourseFilters = {
      search: this.getSearchTerm(),
      page: this.currentPage,
      page_size: 12
    };

    if (this.selectedLevel !== 'all') {
      filters.instructional_level = this.selectedLevel as any;
    }
    
    if (this.selectedPrice !== 'all') {
      filters.price = this.selectedPrice as any;
    }

    this.udemyService.searchCourses(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (refresh) {
            this.courses = response.results;
          } else {
            this.courses = [...this.courses, ...response.results];
          }
          
          this.filteredCourses = this.courses;
          this.hasMorePages = !!response.next;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading courses:', error);
          this.isLoading = false;
        }
      });
  }

  private getSearchTerm(): string {
    if (this.searchTerm.trim()) {
      return `${this.searchTerm} sign language`;
    }
    
    if (this.selectedCategory !== 'all') {
      return this.selectedCategory.replace('-', ' ');
    }
    
    return 'sign language';
  }

  onSearch() {
    this.loadCourses(true);
  }

  onFilterChange() {
    this.loadCourses(true);
  }

  loadMore(event: any) {
    if (this.hasMorePages && !this.isLoading) {
      this.currentPage++;
      this.loadCourses();
    }
    event.target.complete();
  }

  onRefresh(event: any) {
    this.loadCourses(true);
    event.target.complete();
  }

  openCourse(course: UdemyCourse) {
    window.open(course.url, '_blank');
  }

  shareCourse(course: UdemyCourse, event: Event) {
    event.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: course.headline,
        url: course.url
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(course.url);
      // You could show a toast here
    }
  }

  bookmarkCourse(course: UdemyCourse, event: Event) {
    event.stopPropagation();
    // Implement bookmark functionality
    // You could save to localStorage or a user service
    const bookmarks = JSON.parse(localStorage.getItem('courseBookmarks') || '[]');
    const isBookmarked = bookmarks.some((b: any) => b.id === course.id);
    
    if (isBookmarked) {
      const index = bookmarks.findIndex((b: any) => b.id === course.id);
      bookmarks.splice(index, 1);
    } else {
      bookmarks.push({
        id: course.id,
        title: course.title,
        url: course.url,
        image: course.image_240x135
      });
    }
    
    localStorage.setItem('courseBookmarks', JSON.stringify(bookmarks));
  }

  isBookmarked(course: UdemyCourse): boolean {
    const bookmarks = JSON.parse(localStorage.getItem('courseBookmarks') || '[]');
    return bookmarks.some((b: any) => b.id === course.id);
  }

  getStarArray(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= Math.floor(rating));
    }
    return stars;
  }

  formatPrice(course: UdemyCourse): string {
    if (course.price === 'Free') {
      return 'Free';
    }
    return course.price_detail?.price_string || course.price || 'N/A';
  }

  formatStudentCount(count: number): string {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  }

  getLevelColor(level: string): string {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'expert': return 'danger';
      default: return 'medium';
    }
  }
}
