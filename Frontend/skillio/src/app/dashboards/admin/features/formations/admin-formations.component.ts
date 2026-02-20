import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import { TrainingService } from '../../../../core/services/training.service';
import { Training } from '../../../../core/models/training.model';

@Component({
  selector: 'app-admin-formations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule, MatButtonModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Formations Management</h1>
        <button mat-flat-button color="primary" (click)="toggleForm()" class="bg-blue-600 text-white px-4 py-2 rounded-lg">
          <mat-icon class="mr-2">add</mat-icon> {{ showForm() ? 'Cancel' : 'Add Training' }}
        </button>
      </div>

      @if (showForm()) {
        <div class="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-lg mb-8 border border-gray-200 dark:border-navy-700">
          <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{{ isEditing() ? 'Edit Training' : 'New Training' }}</h2>
          <form [formGroup]="trainingForm" (ngSubmit)="onSubmit()">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input type="text" formControlName="title" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <input type="text" formControlName="category" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Level</label>
                <select formControlName="level" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>All Levels</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
                <input type="number" formControlName="price" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thumbnail URL</label>
                <input type="text" formControlName="thumbnailUrl" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
                <input type="text" formControlName="language" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select formControlName="status" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                  <option>DRAFT</option>
                  <option>PUBLISHED</option>
                  <option>ARCHIVED</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea rows="3" formControlName="description" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
              <button type="button" (click)="toggleForm()" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors">Cancel</button>
              <button type="submit" [disabled]="trainingForm.invalid" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isEditing() ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      }

      <div class="bg-white dark:bg-navy-800 rounded-xl shadow-lg border border-gray-200 dark:border-navy-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50 dark:bg-navy-900 border-b border-gray-200 dark:border-navy-700">
              <tr>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Thumbnail</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Title</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Category</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Level</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Language</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Price</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-navy-700">
              @for (t of trainings(); track t.id) {
                <tr class="hover:bg-gray-50 dark:hover:bg-navy-700/50 transition-colors">
                  <td class="px-6 py-4">
                    <img [src]="t.thumbnailUrl || 'https://ui-avatars.com/api/?name=' + t.title" class="w-10 h-10 rounded-lg object-cover bg-gray-100">
                  </td>
                  <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ t.title }}</td>
                  <td class="px-6 py-4 text-gray-600 dark:text-gray-300">{{ t.category }}</td>
                  <td class="px-6 py-4 text-gray-600 dark:text-gray-300">{{ t.level }}</td>
                  <td class="px-6 py-4 text-gray-600 dark:text-gray-300">{{ t.language }}</td>
                  <td class="px-6 py-4 text-gray-600 dark:text-gray-300">{{ t.price | currency }}</td>
                  <td class="px-6 py-4 text-gray-600 dark:text-gray-300">{{ t.status }}</td>
                  <td class="px-6 py-4 text-right">
                    <button (click)="editTraining(t)" class="text-blue-500 hover:text-blue-600 mr-3">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button (click)="deleteTraining(t.id)" class="text-red-500 hover:text-red-600 mr-3">
                      <mat-icon>delete</mat-icon>
                    </button>
                    <button (click)="manageContents(t)" class="text-purple-500 hover:text-purple-600">
                      <mat-icon>playlist_add</mat-icon>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="8" class="px-6 py-8 text-center text-gray-500">No trainings found</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      @if (showContents()) {
        <div class="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-lg mt-6 border border-gray-200 dark:border-navy-700">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Contents — {{ currentTraining()?.title }}</h2>
            <button mat-stroked-button (click)="closeContents()">Close</button>
          </div>
          <div class="flex items-center gap-3 mb-4">
            <input [(ngModel)]="contentTitle" placeholder="Title" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white">
            <input [(ngModel)]="contentUrl" placeholder="Content URL" class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white">
            <button mat-flat-button color="primary" class="bg-violet-600" (click)="addContent()">Add</button>
          </div>
          <div class="divide-y divide-gray-200 dark:divide-navy-700">
            @for (c of contents(); track c.id) {
              <div class="py-2 flex items-center justify-between">
                <span class="text-gray-800 dark:text-gray-200">{{ c.title }}</span>
                <div class="flex items-center gap-2">
                  <a [href]="c.contentUrl" target="_blank" class="text-violet-500">Open</a>
                  <button mat-icon-button color="warn" (click)="deleteContent(c.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class AdminFormationsComponent {
  private api = inject(TrainingService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  trainings = signal<Training[]>([]);
  showForm = signal(false);
  isEditing = signal(false);
  editId: number | null = null;

  trainingForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    category: ['', Validators.required],
    level: ['Beginner', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    thumbnailUrl: [''],
    language: ['English', Validators.required],
    status: ['DRAFT', Validators.required]
  });

  showContents = signal(false);
  currentTraining = signal<Training | null>(null);
  contents = signal<{ id: number; title: string; contentUrl: string }[]>([]);
  contentTitle = '';
  contentUrl = '';

  constructor() {
    this.loadTrainings();
  }

  loadTrainings() {
    this.api.getAll().subscribe({
      next: (data) => this.trainings.set(data),
      error: () => this.toastr.error('Failed to load trainings')
    });
  }

  toggleForm() {
    this.showForm.update(v => !v);
    if (!this.showForm()) {
      this.trainingForm.reset({
        title: '',
        description: '',
        category: '',
        level: 'Beginner',
        price: 0,
        thumbnailUrl: '',
        language: 'English',
        status: 'DRAFT'
      });
      this.isEditing.set(false);
      this.editId = null;
    }
  }

  editTraining(t: Training) {
    this.isEditing.set(true);
    this.editId = t.id;
    this.trainingForm.patchValue({
      title: t.title,
      description: t.description,
      category: t.category,
      level: t.level,
      price: t.price,
      thumbnailUrl: t.thumbnailUrl,
      language: t.language,
      status: t.status
    });
    this.showForm.set(true);
  }

  deleteTraining(id: number) {
    if (confirm('Are you sure you want to delete this training?')) {
      this.api.delete(id).subscribe({
        next: () => {
          this.toastr.success('Training deleted successfully');
          this.loadTrainings();
        },
        error: () => this.toastr.error('Failed to delete training')
      });
    }
  }

  onSubmit() {
    if (this.trainingForm.valid) {
      const value = this.trainingForm.value as any;
      if (this.isEditing() && this.editId) {
        this.api.update(this.editId, value).subscribe({
          next: () => {
            this.toastr.success('Training updated successfully');
            this.loadTrainings();
            this.toggleForm();
          },
          error: () => this.toastr.error('Failed to update training')
        });
      } else {
        this.api.create(value).subscribe({
          next: () => {
            this.toastr.success('Training created successfully');
            this.loadTrainings();
            this.toggleForm();
          },
          error: () => this.toastr.error('Failed to create training')
        });
      }
    }
  }

  manageContents(t: Training) {
    this.currentTraining.set(t);
    this.api.getContents(t.id).subscribe({
      next: (items) => {
        this.contents.set(items);
        this.showContents.set(true);
      },
      error: () => this.toastr.error('Failed to load contents')
    });
  }

  closeContents() {
    this.showContents.set(false);
    this.currentTraining.set(null);
    this.contents.set([]);
    this.contentTitle = '';
    this.contentUrl = '';
  }

  addContent() {
    const ct = this.currentTraining();
    if (!ct || !this.contentTitle || !this.contentUrl) return;
    this.api.addContent(ct.id, { title: this.contentTitle, contentUrl: this.contentUrl }).subscribe({
      next: () => {
        this.api.getContents(ct.id).subscribe(items => this.contents.set(items));
        this.toastr.success('Content added');
        this.contentTitle = '';
        this.contentUrl = '';
      },
      error: () => this.toastr.error('Failed to add content')
    });
  }

  deleteContent(id: number) {
    const ct = this.currentTraining();
    if (!ct) return;
    this.api.deleteContent(id).subscribe({
      next: () => {
        this.api.getContents(ct.id).subscribe(items => this.contents.set(items));
        this.toastr.success('Content deleted');
      },
      error: () => this.toastr.error('Failed to delete content')
    });
  }
}
