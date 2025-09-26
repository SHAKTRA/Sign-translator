import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface UdemyCourse {
  id: number;
  title: string;
  headline: string;
  description: string;
  image_240x135: string;
  image_480x270: string;
  url: string;
  price: string;
  price_detail: {
    amount: number;
    currency: string;
    price_string: string;
  };
  visible_instructors: Array<{
    display_name: string;
    job_title: string;
    image_100x100: string;
  }>;
  rating: number;
  num_reviews: number;
  num_subscribers: number;
  content_info: string;
  published_time: string;
  instructional_level: string;
  locale: {
    locale: string;
    english_title: string;
  };
}

export interface UdemySearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UdemyCourse[];
}

export interface CourseFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  language?: string;
  price?: 'paid' | 'free';
  instructional_level?: 'beginner' | 'intermediate' | 'expert' | 'all';
  duration?: 'short' | 'medium' | 'long' | 'extraLong';
  ratings?: number;
  page?: number;
  page_size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UdemyApiService {
  private readonly baseUrl = 'https://www.udemy.com/api-2.0';
  private clientId: string = '';
  private clientSecret: string = '';
  
  // Loading state
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  // Popular sign language search terms
  private signLanguageKeywords = [
    'sign language',
    'ASL',
    'American Sign Language',
    'British Sign Language',
    'BSL',
    'deaf culture',
    'sign language interpretation',
    'fingerspelling',
    'deaf communication'
  ];

  constructor(private http: HttpClient) {
    this.loadCredentials();
  }

  private loadCredentials(): void {
    // Load from environment or localStorage
    this.clientId = environment.udemyClientId || localStorage.getItem('udemyClientId') || '';
    this.clientSecret = environment.udemyClientSecret || localStorage.getItem('udemyClientSecret') || '';
  }

  setCredentials(clientId: string, clientSecret: string): void {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    localStorage.setItem('udemyClientId', clientId);
    localStorage.setItem('udemyClientSecret', clientSecret);
  }

  hasCredentials(): boolean {
    return !!(this.clientId && this.clientSecret);
  }

  private getHeaders(): HttpHeaders {
    const credentials = btoa(`${this.clientId}:${this.clientSecret}`);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`
    });
  }

  /**
   * Search for courses with filters
   */
  searchCourses(filters: CourseFilters = {}): Observable<UdemySearchResponse> {
    this.loadingSubject.next(true);
    
    let params = new HttpParams();
    
    // Add search parameters
    if (filters.search) params = params.set('search', filters.search);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.subcategory) params = params.set('subcategory', filters.subcategory);
    if (filters.language) params = params.set('language', filters.language);
    if (filters.price) params = params.set('price', filters.price);
    if (filters.instructional_level) params = params.set('instructional_level', filters.instructional_level);
    if (filters.duration) params = params.set('duration', filters.duration);
    if (filters.ratings) params = params.set('ratings', filters.ratings.toString());
    
    // Pagination
    params = params.set('page', (filters.page || 1).toString());
    params = params.set('page_size', (filters.page_size || 12).toString());
    
    // Additional fields to fetch
    params = params.set('fields[course]', '@default,description,visible_instructors,rating,num_reviews,num_subscribers,content_info,instructional_level');

    const url = `${this.baseUrl}/courses/`;
    
    return this.http.get<UdemySearchResponse>(url, {
      headers: this.getHeaders(),
      params: params
    }).pipe(
      map(response => {
        this.loadingSubject.next(false);
        return response;
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Udemy API Error:', error);
        throw error;
      })
    );
  }

  /**
   * Get sign language courses specifically
   */
  getSignLanguageCourses(page: number = 1, pageSize: number = 12): Observable<UdemySearchResponse> {
    return this.searchCourses({
      search: 'sign language',
      page: page,
      page_size: pageSize,
      instructional_level: 'all'
    });
  }

  /**
   * Get ASL specific courses
   */
  getASLCourses(page: number = 1): Observable<UdemySearchResponse> {
    return this.searchCourses({
      search: 'ASL American Sign Language',
      page: page,
      page_size: 12
    });
  }

  /**
   * Get beginner sign language courses
   */
  getBeginnerSignLanguageCourses(): Observable<UdemySearchResponse> {
    return this.searchCourses({
      search: 'sign language beginner',
      instructional_level: 'beginner',
      page_size: 8
    });
  }

  /**
   * Get free sign language courses
   */
  getFreeSignLanguageCourses(): Observable<UdemySearchResponse> {
    return this.searchCourses({
      search: 'sign language',
      price: 'free',
      page_size: 6
    });
  }

  /**
   * Get course details by ID
   */
  getCourseDetails(courseId: number): Observable<UdemyCourse> {
    const url = `${this.baseUrl}/courses/${courseId}/`;
    const params = new HttpParams().set('fields[course]', '@all');
    
    return this.http.get<UdemyCourse>(url, {
      headers: this.getHeaders(),
      params: params
    });
  }

  /**
   * Get recommended courses based on user's learning progress
   */
  getRecommendedCourses(userLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner'): Observable<UdemySearchResponse> {
    const searchTerm = userLevel === 'beginner' ? 'sign language basics' : 
                     userLevel === 'intermediate' ? 'sign language conversation' : 
                     'sign language advanced interpretation';
    
    return this.searchCourses({
      search: searchTerm,
      instructional_level: userLevel === 'advanced' ? 'expert' : userLevel,
      ratings: 4,
      page_size: 6
    });
  }

  /**
   * Search courses by multiple sign language keywords
   */
  searchAllSignLanguageContent(page: number = 1): Observable<UdemyCourse[]> {
    // This method combines results from multiple searches
    const searches = this.signLanguageKeywords.map(keyword => 
      this.searchCourses({ search: keyword, page_size: 3 })
    );

    // Note: In a real implementation, you'd want to use forkJoin to combine these
    // For now, we'll just return the first search result
    return this.searchCourses({
      search: 'sign language',
      page: page,
      page_size: 20
    }).pipe(
      map(response => response.results)
    );
  }

  /**
   * Get course categories related to sign language
   */
  getSignLanguageCategories(): string[] {
    return [
      'Teaching & Academics',
      'Personal Development', 
      'Health & Fitness',
      'Lifestyle'
    ];
  }

  /**
   * Test API connection
   */
  testConnection(): Observable<boolean> {
    return this.searchCourses({ search: 'test', page_size: 1 }).pipe(
      map(() => true),
      catchError(() => {
        return [false];
      })
    );
  }
}
