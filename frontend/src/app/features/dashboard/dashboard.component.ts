import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NewsfeedService, NewsfeedPost, NewsfeedComment } from '../../core/services/newsfeed.service';
import { ContactsService } from '../../core/services/contacts.service';
import { DocumentsService, Document } from '../../core/services/documents.service';
import { TasksService, Task } from '../../core/services/tasks.service';
import { ExternalLinksService, ExternalLink } from '../../core/services/external-links.service';
import { UsersService, User } from '../../core/services/users.service';
import { FileManagerService, FileItem } from '../../core/services/file-manager.service';

// Personal Contact Interface
export interface PersonalContact {
  id: number;
  user_id: number;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// File Manager Interface
export interface PersonalFile {
  id: number;
  user_id: number;
  filename: string;
  original_filename: string;
  mime_type: string;
  size: number;
  path: string;
  created_at: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-blue-50">
      <!-- Header -->
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">Intranet Dashboard</h1>

          <!-- User Menu Dropdown -->
          <div class="relative">
            <button
              (click)="toggleUserMenu()"
              class="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
            >
              <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {{ (user?.first_name?.charAt(0) || 'A') + (user?.last_name?.charAt(0) || 'U') }}
              </div>
              <span>▼</span>
            </button>

            <!-- Dropdown Menu -->
            <div *ngIf="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border" style="z-index: 9999;" (click)="$event.stopPropagation()">
              <div class="py-1">
                <button
                  (click)="openUserProfile()"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </button>
                <button
                  *ngIf="isAdmin()"
                  (click)="openUserManagement()"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Manage Users
                </button>
                <div class="border-t border-gray-100"></div>
                <button
                  (click)="logout()"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left side - Dominant Newsfeed -->
          <div class="lg:col-span-2">
            <!-- Newsfeed Widget -->
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold mb-4">Newsfeed</h2>
              <div class="space-y-4">
                <!-- New Post Form -->
                <div class="border-b pb-4">
                  <input
                    [(ngModel)]="newPostTitle"
                    placeholder="Post title..."
                    class="w-full p-2 border border-gray-300 rounded mb-2 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <textarea
                    [(ngModel)]="newPostContent"
                    placeholder="What's on your mind?"
                    class="w-full p-2 border border-gray-300 rounded resize-none bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  ></textarea>
                  <button
                    (click)="createPost()"
                    [disabled]="!newPostTitle.trim() || !newPostContent.trim() || loading"
                    class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    Post
                  </button>
                </div>

                <!-- Posts -->
                <div *ngFor="let post of posts" class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 last:mb-0">
                  <div class="flex items-center space-x-2 mb-2">
                    <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                      {{ post.user.first_name.charAt(0) }}{{ post.user.last_name.charAt(0) }}
                    </div>
                    <div>
                      <span class="font-medium">{{ post.user.first_name }} {{ post.user.last_name }}</span>
                      <span class="text-gray-500 text-sm ml-2">{{ formatDate(post.created_at) }}</span>
                    </div>
                  </div>
                  <div *ngIf="post.title" class="font-semibold text-gray-900 mb-1">{{ post.title }}</div>
                  <p class="text-gray-800 mb-2">{{ post.content }}</p>
                  <div class="flex items-center space-x-4 text-sm text-gray-600">
                    <button
                      (click)="toggleLike(post)"
                      class="flex items-center space-x-1 hover:text-blue-600"
                    >
                      <span>👍</span>
                      <span>{{ post.likes_count || 0 }}</span>
                    </button>
                    <span>💬 {{ post.comments_count || 0 }}</span>
                  </div>

                  <!-- Comments Section -->
                  <div *ngIf="post.comments && post.comments.length > 0" class="mt-4 border-t pt-4">
                    <div class="space-y-3">
                      <div *ngFor="let comment of post.comments" class="flex space-x-3">
                        <div class="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {{ comment.user.first_name.charAt(0) }}{{ comment.user.last_name.charAt(0) }}
                        </div>
                        <div class="flex-1">
                          <div class="bg-gray-100 rounded-lg px-3 py-2">
                            <div class="font-medium text-sm text-gray-900">{{ comment.user.first_name }} {{ comment.user.last_name }}</div>
                            <div class="text-sm text-gray-700">{{ comment.content }}</div>
                          </div>
                          <div class="flex items-center justify-between mt-1">
                            <div class="text-xs text-gray-500">{{ formatDate(comment.created_at) }}</div>
                            <button
                              (click)="toggleCommentLike(comment)"
                              class="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-500"
                            >
                              <span>❤️</span>
                              <span>{{ comment.likes_count || 0 }}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Add Comment -->
                  <div class="mt-4 border-t pt-4">
                    <div class="flex space-x-3">
                      <input
                        [(ngModel)]="commentInputs[post.id]"
                        (keyup.enter)="addComment(post.id)"
                        placeholder="Write a comment..."
                        class="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <button
                        (click)="addComment(post.id)"
                        [disabled]="!commentInputs[post.id]?.trim()"
                        class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>

                <div *ngIf="posts.length === 0 && !loading" class="text-center text-gray-500 py-8">
                  No posts yet. Be the first to share something!
                </div>
              </div>
            </div>
          </div>

          <!-- Right Sidebar -->
          <div class="space-y-6">
            <!-- Task List Widget -->
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold mb-4">Task List</h2>
              <div class="space-y-4">
                <!-- Add Task Form -->
                <div class="border-b pb-4">
                  <input
                    [(ngModel)]="newTaskTitle"
                    placeholder="Add a new task..."
                    class="w-full p-2 border rounded"
                    (keyup.enter)="createTask()"
                  />
                  <button
                    (click)="createTask()"
                    [disabled]="!newTaskTitle.trim() || loading"
                    class="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
                  >
                    Add Task
                  </button>
                </div>

                <!-- Tasks -->
                <div class="space-y-2">
                  <div *ngFor="let task of tasks.slice(0, 5)" class="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      [checked]="task.is_completed"
                      (change)="toggleTask(task)"
                      class="rounded"
                    />
                    <span
                      [ngClass]="{'line-through text-gray-500': task.is_completed}"
                      class="flex-1 text-sm"
                    >
                      {{ task.title }}
                    </span>
                    <button
                      (click)="deleteTask(task.id)"
                      class="text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div *ngIf="tasks.length === 0 && !loading" class="text-center text-gray-500 py-4">
                  No tasks yet. Add one above!
                </div>
              </div>
            </div>

            <!-- Contacts Widget -->
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">Contacts</h2>
                <button
                  (click)="openPersonalContactForm()"
                  class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  + Add Contact
                </button>
              </div>
              <div class="space-y-3">
                <!-- Organization Users (always visible) -->
                <div *ngIf="contacts.length > 0" class="mb-4">
                  <h4 class="text-sm font-medium text-gray-600 mb-2">Team Members</h4>
                  <div *ngFor="let contact of contacts.slice(0, 5)" class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                      {{ contact.first_name.charAt(0) }}{{ contact.last_name.charAt(0) }}
                    </div>
                    <div class="flex-1">
                      <div class="font-medium text-sm">{{ contact.first_name }} {{ contact.last_name }}</div>
                      <div class="text-xs text-gray-500">{{ contact.email }}</div>
                    </div>
                    <div class="flex items-center">
                      <div
                        class="w-3 h-3 rounded-full"
                        [ngClass]="{
                          'bg-green-500': contact.status === 'online',
                          'bg-yellow-500': contact.status === 'away',
                          'bg-gray-400': contact.status === 'offline'
                        }"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- Personal Contacts -->
                <div *ngIf="personalContacts.length > 0">
                  <h4 class="text-sm font-medium text-gray-600 mb-2">Personal Contacts</h4>
                  <div *ngFor="let contact of personalContacts.slice(0, 3)" class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer" (click)="viewPersonalContact(contact)">
                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-600">
                      {{ contact.name.charAt(0).toUpperCase() }}
                    </div>
                    <div class="flex-1">
                      <div class="font-medium text-sm">{{ contact.name }}</div>
                      <div class="text-xs text-gray-500">{{ contact.email || contact.phone || 'No contact info' }}</div>
                    </div>
                    <div class="flex space-x-1">
                      <button
                        (click)="$event.stopPropagation(); deletePersonalContact(contact.id)"
                        class="text-xs px-2 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>

                <div *ngIf="contacts.length === 0 && personalContacts.length === 0 && !loading" class="text-center text-gray-500 py-4">
                  No contacts yet. Add some team members or personal contacts above.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Row - Full Width Widgets -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <!-- Documents Widget -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold">Company Documents</h2>
              <button
                (click)="triggerFileUpload()"
                class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Upload
              </button>
            </div>
            <input
              #fileInput
              type="file"
              (change)="onFileSelected($event)"
              class="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
            />
            <div class="space-y-3">
              <div *ngFor="let doc of documents.slice(0, 3)" class="border rounded p-3">
                <div class="font-medium text-sm">{{ doc.original_filename }}</div>
                <div class="text-xs text-gray-500">{{ doc.user.first_name }} {{ doc.user.last_name }}</div>
                <div class="text-xs text-gray-400">{{ formatFileSize(doc.size) }}</div>
              </div>
              <div *ngIf="documents.length === 0 && !loading" class="text-center text-gray-500 py-4">
                No documents uploaded yet.
              </div>
            </div>
          </div>

          <!-- External Links Widget -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4">External Links</h2>
            <div class="space-y-3">
              <div *ngFor="let link of externalLinks.slice(0, 3)" class="border rounded p-3">
                <a [href]="link.url" target="_blank" class="font-medium text-sm text-blue-600 hover:text-blue-800">
                  {{ link.name }}
                </a>
                <div class="text-xs text-gray-500 mt-1">{{ link.description }}</div>
              </div>
              <div *ngIf="externalLinks.length === 0 && !loading" class="text-center text-gray-500 py-4">
                No external links configured.
              </div>
            </div>
          </div>

          <!-- File Manager Widget -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold">File Manager</h2>
              <button
                (click)="triggerPersonalFileUpload()"
                class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                Upload File
              </button>
            </div>
            <input
              #personalFileInput
              type="file"
              (change)="onPersonalFileSelected($event)"
              class="hidden"
              multiple
            />
            <div class="space-y-2">
              <div *ngFor="let file of personalFiles.slice(0, 3)" class="border rounded p-3">
                <div class="font-medium text-sm">{{ file.original_filename }}</div>
                <div class="text-xs text-gray-400">{{ formatFileSize(file.size) }}</div>
              </div>
              <div *ngIf="personalFiles.length === 0 && !loading" class="text-center text-gray-500 py-4">
                No personal files yet.
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- User Management Modal -->
      <div *ngIf="showUserForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">{{ editingUser ? 'Edit User' : 'Add New User' }}</h3>
            <button (click)="closeUserForm()" class="text-gray-500 hover:text-gray-700">
              <span class="text-xl">&times;</span>
            </button>
          </div>

          <form (ngSubmit)="saveUser()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                [(ngModel)]="newUser.username"
                name="username"
                type="text"
                required
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                [(ngModel)]="newUser.email"
                name="email"
                type="email"
                required
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  [(ngModel)]="newUser.first_name"
                  name="first_name"
                  type="text"
                  required
                  class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="First name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  [(ngModel)]="newUser.last_name"
                  name="last_name"
                  type="text"
                  required
                  class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div *ngIf="!editingUser">
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                [(ngModel)]="newUser.password"
                name="password"
                type="password"
                required
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
            </div>

            <div class="flex space-x-3 pt-4">
              <button
                type="button"
                (click)="closeUserForm()"
                class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="!newUser.username || !newUser.email || !newUser.first_name || !newUser.last_name || (!editingUser && !newUser.password)"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ editingUser ? 'Update' : 'Create' }} User
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Personal Contact Modal -->
      <div *ngIf="showPersonalContactForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Add Personal Contact</h3>
            <button (click)="closePersonalContactForm()" class="text-gray-500 hover:text-gray-700">
              <span class="text-xl">&times;</span>
            </button>
          </div>

          <form (ngSubmit)="savePersonalContact()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                [(ngModel)]="newPersonalContact.name"
                name="name"
                type="text"
                required
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Contact name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                [(ngModel)]="newPersonalContact.email"
                name="email"
                type="email"
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                [(ngModel)]="newPersonalContact.phone"
                name="phone"
                type="tel"
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                [(ngModel)]="newPersonalContact.notes"
                name="notes"
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
                placeholder="Additional notes..."
              ></textarea>
            </div>

            <div class="flex space-x-3 pt-4">
              <button
                type="button"
                (click)="closePersonalContactForm()"
                class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="!newPersonalContact.name.trim()"
                class="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Contact
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Personal Contact Details Modal -->
      <div *ngIf="showPersonalContactDetails && selectedPersonalContact" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Contact Details</h3>
            <button (click)="closePersonalContactDetails()" class="text-gray-500 hover:text-gray-700">
              <span class="text-xl">&times;</span>
            </button>
          </div>

          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-xl font-medium text-green-600">
                {{ selectedPersonalContact.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <h4 class="text-xl font-semibold">{{ selectedPersonalContact.name }}</h4>
                <p class="text-sm text-gray-500">Personal Contact</p>
              </div>
            </div>

            <div class="border-t pt-4 space-y-3">
              <div *ngIf="selectedPersonalContact.email">
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <p class="text-sm text-gray-900">{{ selectedPersonalContact.email }}</p>
              </div>

              <div *ngIf="selectedPersonalContact.phone">
                <label class="block text-sm font-medium text-gray-700">Phone</label>
                <p class="text-sm text-gray-900">{{ selectedPersonalContact.phone }}</p>
              </div>

              <div *ngIf="selectedPersonalContact.notes">
                <label class="block text-sm font-medium text-gray-700">Notes</label>
                <p class="text-sm text-gray-900 whitespace-pre-line">{{ selectedPersonalContact.notes }}</p>
              </div>

              <div class="text-xs text-gray-500 border-t pt-2">
                <p>Created: {{ formatDate(selectedPersonalContact.created_at) }}</p>
                <p>Last updated: {{ formatDate(selectedPersonalContact.updated_at) }}</p>
              </div>
            </div>

            <div class="flex space-x-3 pt-4">
              <button
                (click)="closePersonalContactDetails()"
                class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Close
              </button>
              <button
                (click)="deletePersonalContact(selectedPersonalContact.id); closePersonalContactDetails()"
                class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      @apply bg-white rounded-lg shadow p-6;
    }
  `]
})
export class DashboardComponent implements OnInit {
  user: any = null;
  loading = false;
  showUserMenu = false;

  // Newsfeed
  posts: NewsfeedPost[] = [];
  newPostTitle = '';
  newPostContent = '';
  commentInputs: { [postId: number]: string } = {};
  isUsingDummyPosts = false;

  // Dummy data for demo purposes
  private dummyPosts: NewsfeedPost[] = [
    {
      id: 1,
      user_id: 1,
      title: 'Welcome to the Company Intranet!',
      content: 'Excited to launch our new intranet platform. This will be our central hub for communication, collaboration, and company updates. Feel free to explore all the features!',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: 1,
        first_name: 'Admin',
        last_name: 'User',
        avatar: undefined
      },
      comments_count: 2,
      likes_count: 5,
      is_liked: false,
      comments: [
        {
          id: 1,
          post_id: 1,
          user_id: 2,
          content: 'This looks amazing! Great work on the design.',
          created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          user: {
            id: 2,
            first_name: 'John',
            last_name: 'Doe',
            avatar: undefined
          },
          likes_count: 3,
          is_liked: false
        },
        {
          id: 2,
          post_id: 1,
          user_id: 3,
          content: 'Can\'t wait to start using this for our daily updates!',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          user: {
            id: 3,
            first_name: 'Jane',
            last_name: 'Smith',
            avatar: undefined
          },
          likes_count: 1,
          is_liked: true
        }
      ]
    },
    {
      id: 2,
      user_id: 2,
      title: 'Q4 Goals Review',
      content: 'Just finished our quarterly goals review. Great progress across all teams! Our development team has exceeded targets, and sales are looking strong. Let\'s keep up the momentum into Q1.',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: 2,
        first_name: 'John',
        last_name: 'Doe',
        avatar: undefined
      },
      comments_count: 0,
      likes_count: 3,
      is_liked: true
    },
    {
      id: 3,
      user_id: 1,
      content: 'Just wrapped up an amazing client presentation. The new dashboard features really impressed them! Looking forward to feedback.',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      user: {
        id: 1,
        first_name: 'Admin',
        last_name: 'User',
        avatar: undefined
      },
      comments_count: 1,
      likes_count: 2,
      is_liked: false,
      comments: [
        {
          id: 3,
          post_id: 3,
          user_id: 2,
          content: 'Congrats on the successful presentation! 🎉',
          created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          user: {
            id: 2,
            first_name: 'John',
            last_name: 'Doe',
            avatar: undefined
          },
          likes_count: 2,
          is_liked: false
        }
      ]
    }
  ];

  // Contacts
  contacts: User[] = [];
  personalContacts: PersonalContact[] = [];

  // Dummy contacts for demo purposes
  private dummyContacts: User[] = [
    {
      id: 2,
      organization_id: 1,
      username: 'john.doe',
      email: 'john.doe@company.com',
      first_name: 'John',
      last_name: 'Doe',
      avatar: undefined,
      status: 'online',
      last_seen_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      roles: [{ id: 2, name: 'employee', display_name: 'Employee' }]
    },
    {
      id: 3,
      organization_id: 1,
      username: 'jane.smith',
      email: 'jane.smith@company.com',
      first_name: 'Jane',
      last_name: 'Smith',
      avatar: undefined,
      status: 'away',
      last_seen_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      roles: [{ id: 2, name: 'employee', display_name: 'Employee' }]
    },
    {
      id: 4,
      organization_id: 1,
      username: 'mike.johnson',
      email: 'mike.johnson@company.com',
      first_name: 'Mike',
      last_name: 'Johnson',
      avatar: undefined,
      status: 'online',
      last_seen_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      roles: [{ id: 2, name: 'employee', display_name: 'Employee' }]
    },
    {
      id: 5,
      organization_id: 1,
      username: 'sarah.wilson',
      email: 'sarah.wilson@company.com',
      first_name: 'Sarah',
      last_name: 'Wilson',
      avatar: undefined,
      status: 'offline',
      last_seen_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      roles: [{ id: 2, name: 'employee', display_name: 'Employee' }]
    }
  ];

  // Tasks
  tasks: Task[] = [];
  newTaskTitle = '';
  isUsingDummyTasks = false;

  // Dummy tasks for demo purposes
  private dummyTasks: Task[] = [
    {
      id: 1,
      user_id: 1,
      title: 'Review Q4 performance reports',
      description: 'Go through all department performance reports and prepare summary for executive team',
      is_completed: false,
      priority: 'high',
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      user_id: 1,
      title: 'Schedule team meeting for next sprint planning',
      description: 'Coordinate with team leads to find a time that works for everyone',
      is_completed: true,
      priority: 'medium',
      due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      user_id: 1,
      title: 'Update project documentation',
      description: 'Make sure all recent changes are documented in the wiki',
      is_completed: false,
      priority: 'medium',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 4,
      user_id: 2,
      title: 'Client presentation preparation',
      description: 'Prepare slides and demo for upcoming client meeting',
      is_completed: false,
      priority: 'high',
      due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 5,
      user_id: 2,
      title: 'Code review for feature branch',
      description: 'Review the new authentication feature implementation',
      is_completed: true,
      priority: 'medium',
      due_date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    }
  ];

  // Documents
  documents: Document[] = [];

  // Personal Files
  personalFiles: PersonalFile[] = [];

  // Dummy documents for demo purposes
  private dummyDocuments: Document[] = [
    {
      id: 1,
      user_id: 1,
      original_filename: 'Company_Policies_2024.pdf',
      filename: 'company_policies_2024.pdf',
      path: 'documents/',
      mime_type: 'application/pdf',
      size: 2457600,
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: 1,
        first_name: 'Admin',
        last_name: 'User'
      }
    },
    {
      id: 2,
      user_id: 1,
      original_filename: 'Employee_Handbook.pdf',
      filename: 'employee_handbook.pdf',
      path: 'documents/',
      mime_type: 'application/pdf',
      size: 1843200,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: 1,
        first_name: 'Admin',
        last_name: 'User'
      }
    },
    {
      id: 3,
      user_id: 2,
      original_filename: 'Q4_Quarterly_Report.xlsx',
      filename: 'q4_quarterly_report.xlsx',
      path: 'documents/',
      mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: 512000,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: 2,
        first_name: 'John',
        last_name: 'Doe'
      }
    }
  ];

  // Dummy personal files for demo purposes
  private dummyPersonalFiles: PersonalFile[] = [
    {
      id: 1,
      user_id: 1,
      filename: 'vacation_photos.zip',
      original_filename: 'Vacation Photos 2024.zip',
      mime_type: 'application/zip',
      size: 52428800,
      path: 'files/',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      user_id: 1,
      filename: 'project_notes.txt',
      original_filename: 'Project Notes.txt',
      mime_type: 'text/plain',
      size: 15360,
      path: 'files/',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      user_id: 1,
      filename: 'presentation.pptx',
      original_filename: 'Q4 Presentation.pptx',
      mime_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      size: 2097152,
      path: 'files/',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ];

  // External Links
  externalLinks: ExternalLink[] = [];

  // Dummy external links for demo purposes
  private dummyExternalLinks: ExternalLink[] = [
    {
      id: 1,
      organization_id: 1,
      name: 'Company Website',
      url: 'https://www.company.com',
      description: 'Official company website and marketing materials',
      icon: '🌐',
      order: 1,
      is_active: true,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      organization_id: 1,
      name: 'HR Portal',
      url: 'https://hr.company.com',
      description: 'Human resources portal for benefits and policies',
      icon: '👥',
      order: 2,
      is_active: true,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      organization_id: 1,
      name: 'Project Management',
      url: 'https://projects.company.com',
      description: 'Jira/Asana project management system',
      icon: '📋',
      order: 3,
      is_active: true,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 4,
      organization_id: 1,
      name: 'Git Repository',
      url: 'https://git.company.com',
      description: 'Source code repository and version control',
      icon: '💻',
      order: 4,
      is_active: true,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 5,
      organization_id: 1,
      name: 'Time Tracking',
      url: 'https://time.company.com',
      description: 'Time tracking and project time management',
      icon: '⏰',
      order: 5,
      is_active: true,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ];

  // User Management (Admin Only)
  users: User[] = [];
  showUserForm = false;
  editingUser: User | null = null;
  newUser = {
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: ''
  };

  // Personal Contacts
  showPersonalContactForm = false;
  showPersonalContactDetails = false;
  selectedPersonalContact: PersonalContact | null = null;
  newPersonalContact = {
    name: '',
    email: '',
    phone: '',
    notes: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private newsfeedService: NewsfeedService,
    private contactsService: ContactsService,
    private tasksService: TasksService,
    private documentsService: DocumentsService,
    private externalLinksService: ExternalLinksService,
    private usersService: UsersService,
    private fileManagerService: FileManagerService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (!user) {
        this.router.navigate(['/login']);
      } else {
        this.loadDashboardData();
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const dropdown = target.closest('.relative');
      if (!dropdown) {
        this.showUserMenu = false;
      }
    });
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  openUserProfile(): void {
    this.showUserMenu = false;
    this.router.navigate(['/profile']);
  }

  openUserManagement(): void {
    this.showUserMenu = false;
    this.openUserForm(); // Reuse existing user management modal
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadDashboardData(): void {
    this.loading = true;
    this.loadPosts();
    this.loadContacts();
    this.loadPersonalContacts();
    this.loadUsers();
    this.loadTasks();
    this.loadDocuments();
    this.loadPersonalFiles();
    this.loadExternalLinks();
    this.loading = false;
  }

  // Newsfeed methods
  loadPosts(): void {
    this.newsfeedService.getPosts().subscribe({
      next: (posts) => {
        // Show dummy data if no real posts exist
        if (posts.length > 0) {
          this.posts = posts;
          this.isUsingDummyPosts = false;
        } else {
          this.posts = this.dummyPosts;
          this.isUsingDummyPosts = true;
        }
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        // Show dummy data on error
        this.posts = this.dummyPosts;
        this.isUsingDummyPosts = true;
      }
    });
  }

  createPost(): void {
    if (!this.newPostTitle.trim() || !this.newPostContent.trim()) return;

    // If using dummy data, create post locally
    if (this.isUsingDummyPosts) {
      const newPost: NewsfeedPost = {
        id: Math.max(...this.dummyPosts.map(p => p.id)) + 1,
        user_id: this.user?.id || 1,
        title: this.newPostTitle,
        content: this.newPostContent,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          id: this.user?.id || 1,
          first_name: this.user?.first_name || 'Admin',
          last_name: this.user?.last_name || 'User',
          avatar: this.user?.avatar
        },
        comments: [],
        comments_count: 0,
        likes_count: 0,
        is_liked: false
      };
      this.dummyPosts.unshift(newPost);
      this.newPostTitle = '';
      this.newPostContent = '';
      return;
    }

    // Otherwise, use API
    this.newsfeedService.createPost(this.newPostTitle, this.newPostContent).subscribe({
      next: (post) => {
        this.posts.unshift(post);
        this.newPostTitle = '';
        this.newPostContent = '';
      },
      error: (err) => console.error('Error creating post:', err)
    });
  }

  toggleLike(post: NewsfeedPost): void {
    // Check if this is a dummy post
    const isDummyPost = this.isUsingDummyPosts;

    if (isDummyPost) {
      // Handle dummy post likes locally
      post.is_liked = !post.is_liked;
      post.likes_count = (post.likes_count || 0) + (post.is_liked ? 1 : -1);
    } else {
      // Handle real post likes via API
      const method = post.is_liked ? 'unlikePost' : 'likePost';
      this.newsfeedService[method](post.id).subscribe({
        next: () => {
          post.is_liked = !post.is_liked;
          post.likes_count = (post.likes_count || 0) + (post.is_liked ? 1 : -1);
        },
        error: (err) => console.error('Error toggling like:', err)
      });
    }
  }

  toggleCommentLike(comment: NewsfeedComment): void {
    // Check if this is a dummy post (which would contain dummy comments)
    const isDummyPost = this.isUsingDummyPosts;

    if (isDummyPost) {
      // Handle dummy comment likes locally
      comment.is_liked = !comment.is_liked;
      comment.likes_count = (comment.likes_count || 0) + (comment.is_liked ? 1 : -1);
    } else {
      // Handle real comment likes via API
      const method = comment.is_liked ? 'unlikeComment' : 'likeComment';
      this.newsfeedService[method](comment.id).subscribe({
        next: () => {
          comment.is_liked = !comment.is_liked;
          comment.likes_count = (comment.likes_count || 0) + (comment.is_liked ? 1 : -1);
        },
        error: (err) => console.error('Error toggling comment like:', err)
      });
    }
  }

  addComment(postId: number): void {
    const commentContent = this.commentInputs[postId]?.trim();
    if (!commentContent) return;

    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    // Check if this is a dummy post (doesn't exist in backend)
    const isDummyPost = this.isUsingDummyPosts;

    if (isDummyPost) {
      // Handle dummy post comments locally
      const dummyComment: NewsfeedComment = {
        id: Date.now(), // Temporary ID
        post_id: postId,
        user_id: this.user?.id || 1,
        content: commentContent,
        created_at: new Date().toISOString(),
        user: {
          id: this.user?.id || 1,
          first_name: this.user?.first_name || 'Admin',
          last_name: this.user?.last_name || 'User',
          avatar: this.user?.avatar
        },
        likes_count: 0,
        is_liked: false
      };

      if (!post.comments) post.comments = [];
      post.comments.push(dummyComment);
      post.comments_count = (post.comments_count || 0) + 1;
      this.commentInputs[postId] = '';
    } else {
      // Handle real post comments via API
      this.newsfeedService.commentOnPost(postId, commentContent).subscribe({
        next: (comment) => {
          if (!post.comments) post.comments = [];
          post.comments.push(comment);
          post.comments_count = (post.comments_count || 0) + 1;
          this.commentInputs[postId] = '';
        },
        error: (err) => console.error('Error adding comment:', err)
      });
    }
  }

  // Contacts methods
  loadContacts(): void {
    this.contactsService.getContacts().subscribe({
      next: (contacts: User[]) => {
        // Show dummy data if no real contacts exist
        this.contacts = contacts.length > 0 ? contacts : this.dummyContacts;
      },
      error: (err: any) => {
        console.error('Error loading contacts:', err);
        // Show dummy data on error
        this.contacts = this.dummyContacts;
      }
    });
  }

  loadPersonalContacts(): void {
    const contacts = JSON.parse(localStorage.getItem('personalContacts') || '[]');
    // Filter to only show contacts for current user
    this.personalContacts = contacts.filter((c: any) => c.user_id === this.user?.id);
  }

  openPersonalContactForm(): void {
    this.showPersonalContactForm = true;
    this.newPersonalContact = {
      name: '',
      email: '',
      phone: '',
      notes: ''
    };
  }

  closePersonalContactForm(): void {
    this.showPersonalContactForm = false;
    this.newPersonalContact = {
      name: '',
      email: '',
      phone: '',
      notes: ''
    };
  }

  savePersonalContact(): void {
    if (!this.newPersonalContact.name.trim()) return;

    // For now, we'll store personal contacts locally in localStorage
    // In a real app, this would be an API call
    const contacts = JSON.parse(localStorage.getItem('personalContacts') || '[]');
    const newContact = {
      id: Date.now(),
      user_id: this.user?.id,
      ...this.newPersonalContact,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    contacts.push(newContact);
    localStorage.setItem('personalContacts', JSON.stringify(contacts));
    this.personalContacts = contacts;

    this.closePersonalContactForm();
  }

  viewPersonalContact(contact: PersonalContact): void {
    this.selectedPersonalContact = contact;
    this.showPersonalContactDetails = true;
  }

  closePersonalContactDetails(): void {
    this.showPersonalContactDetails = false;
    this.selectedPersonalContact = null;
  }

  deletePersonalContact(id: number): void {
    const contacts = JSON.parse(localStorage.getItem('personalContacts') || '[]');
    const filteredContacts = contacts.filter((c: any) => c.id !== id);
    localStorage.setItem('personalContacts', JSON.stringify(filteredContacts));
    this.personalContacts = filteredContacts;
  }

  // Tasks methods
  loadTasks(): void {
    this.tasksService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        // Show dummy data if no real tasks exist
        if (tasks.length > 0) {
          this.tasks = tasks;
          this.isUsingDummyTasks = false;
        } else {
          this.tasks = this.dummyTasks;
          this.isUsingDummyTasks = true;
        }
      },
      error: (err: any) => {
        console.error('Error loading tasks:', err);
        // Show dummy data on error
        this.tasks = this.dummyTasks;
        this.isUsingDummyTasks = true;
      }
    });
  }

  createTask(): void {
    if (!this.newTaskTitle.trim()) return;

    // If using dummy data, create task locally
    if (this.isUsingDummyTasks) {
      const newTask: Task = {
        id: this.dummyTasks.length > 0 ? Math.max(...this.dummyTasks.map(t => t.id)) + 1 : 1,
        user_id: 1,
        title: this.newTaskTitle,
        description: '',
        is_completed: false,
        priority: 'medium',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.dummyTasks.unshift(newTask);
      this.newTaskTitle = '';
      return;
    }

    // Otherwise, use API
    this.tasksService.createTask({ title: this.newTaskTitle }).subscribe({
      next: (task) => {
        this.tasks.unshift(task);
        this.newTaskTitle = '';
      },
      error: (err: any) => console.error('Error creating task:', err)
    });
  }

  toggleTask(task: Task): void {
    // If using dummy data, toggle task locally
    if (this.isUsingDummyTasks) {
      task.is_completed = !task.is_completed;
      return;
    }

    // Otherwise, use API
    this.tasksService.updateTask(task.id, { is_completed: !task.is_completed }).subscribe({
      next: () => {
        task.is_completed = !task.is_completed;
      },
      error: (err: any) => console.error('Error toggling task:', err)
    });
  }

  deleteTask(id: number): void {
    // If using dummy data, delete task locally
    if (this.isUsingDummyTasks) {
      const index = this.dummyTasks.findIndex(t => t.id === id);
      if (index !== -1) {
        this.dummyTasks.splice(index, 1);
      }
      return;
    }

    // Otherwise, use API
    this.tasksService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== id);
      },
      error: (err) => console.error('Error deleting task:', err)
    });
  }

  // Documents methods
  loadDocuments(): void {
    this.documentsService.getDocuments().subscribe({
      next: (documents: Document[]) => {
        // Show dummy data if no real documents exist
        this.documents = documents.length > 0 ? documents : this.dummyDocuments;
      },
      error: (err: any) => {
        console.error('Error loading documents:', err);
        // Show dummy data on error
        this.documents = this.dummyDocuments;
      }
    });
  }

  loadPersonalFiles(): void {
    this.fileManagerService.getFiles().subscribe({
      next: (files: PersonalFile[]) => {
        // Show dummy data if no real files exist
        this.personalFiles = files.length > 0 ? files : this.dummyPersonalFiles;
      },
      error: (err: any) => {
        console.error('Error loading personal files:', err);
        // Show dummy data on error
        this.personalFiles = this.dummyPersonalFiles;
      }
    });
  }

  triggerFileUpload(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (file) {
      this.uploadDocument(file);
    }
    // Reset the input
    if (fileInput) {
      fileInput.value = '';
    }
  }

  uploadDocument(file: File): void {
    // For demo purposes with dummy data, just add to the local array
    if (this.documents === this.dummyDocuments) {
      const newDoc: Document = {
        id: Math.max(...this.dummyDocuments.map(d => d.id)) + 1,
        user_id: this.user?.id || 1,
        filename: file.name,
        original_filename: file.name,
        mime_type: file.type,
        size: file.size,
        path: 'documents/',
        created_at: new Date().toISOString(),
        user: {
          id: this.user?.id || 1,
          first_name: this.user?.first_name || 'Admin',
          last_name: this.user?.last_name || 'User'
        }
      };
      this.dummyDocuments.unshift(newDoc);
      return;
    }

    // For real API, upload to server
    this.documentsService.uploadDocument(file).subscribe({
      next: (document) => {
        this.documents.unshift(document);
      },
      error: (err) => {
        console.error('Error uploading document:', err);
        // Fallback to local addition for demo
        const newDoc: Document = {
          id: Date.now(),
          user_id: this.user?.id || 1,
          filename: file.name,
          original_filename: file.name,
          mime_type: file.type,
          size: file.size,
          path: 'documents/',
          created_at: new Date().toISOString(),
          user: {
            id: this.user?.id || 1,
            first_name: this.user?.first_name || 'Admin',
            last_name: this.user?.last_name || 'User'
          }
        };
        this.documents.unshift(newDoc);
      }
    });
  }

  triggerPersonalFileUpload(): void {
    const fileInput = document.querySelector('input[accept]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onPersonalFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const files = fileInput?.files;
    if (files && files.length > 0) {
      // Handle multiple files
      Array.from(files).forEach(file => {
        this.uploadPersonalFile(file);
      });
    }
    // Reset the input
    if (fileInput) {
      fileInput.value = '';
    }
  }

  uploadPersonalFile(file: File): void {
    // For demo purposes with dummy data, just add to the local array
    if (this.personalFiles === this.dummyPersonalFiles) {
      const newFile: PersonalFile = {
        id: Math.max(...this.dummyPersonalFiles.map(f => f.id)) + 1,
        user_id: this.user?.id || 1,
        filename: file.name,
        original_filename: file.name,
        mime_type: file.type,
        size: file.size,
        path: 'files/',
        created_at: new Date().toISOString(),
      };
      this.dummyPersonalFiles.unshift(newFile);
      return;
    }

    // For real API, upload to server
    this.fileManagerService.uploadFile(file).subscribe({
      next: (uploadedFile) => {
        this.personalFiles.unshift(uploadedFile);
      },
      error: (err) => {
        console.error('Error uploading personal file:', err);
        // Fallback to local addition for demo
        const newFile: PersonalFile = {
          id: Math.max(...this.dummyPersonalFiles.map(f => f.id)) + 1,
          user_id: this.user?.id || 1,
          filename: file.name,
          original_filename: file.name,
          mime_type: file.type,
          size: file.size,
          path: 'files/',
          created_at: new Date().toISOString(),
        };
        this.dummyPersonalFiles.unshift(newFile);
      }
    });
  }

  // External Links methods
  loadExternalLinks(): void {
    this.externalLinksService.getLinks().subscribe({
      next: (links: ExternalLink[]) => {
        // Show dummy data if no real links exist
        this.externalLinks = links.length > 0 ? links : this.dummyExternalLinks;
      },
      error: (err: any) => {
        console.error('Error loading external links:', err);
        // Show dummy data on error
        this.externalLinks = this.dummyExternalLinks;
      }
    });
  }

  // User Management methods
  loadUsers(): void {
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => console.error('Error loading users:', err)
    });
  }

  openUserForm(user?: User): void {
    this.showUserForm = true;
    if (user) {
      this.editingUser = user;
      this.newUser = {
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        password: ''
      };
    } else {
      this.editingUser = null;
      this.newUser = {
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: ''
      };
    }
  }

  closeUserForm(): void {
    this.showUserForm = false;
    this.editingUser = null;
    this.newUser = {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: ''
    };
  }

  saveUser(): void {
    if (this.editingUser) {
      this.usersService.updateUser(this.editingUser.id, this.newUser).subscribe({
        next: (user) => {
          const index = this.users.findIndex(u => u.id === user.id);
          if (index !== -1) {
            this.users[index] = user;
          }
          this.closeUserForm();
        },
        error: (err) => console.error('Error updating user:', err)
      });
    } else {
      this.usersService.createUser(this.newUser).subscribe({
        next: (user) => {
          this.users.push(user);
          this.closeUserForm();
        },
        error: (err) => console.error('Error creating user:', err)
      });
    }
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete ${user.first_name} ${user.last_name}?`)) {
      this.usersService.deleteUser(user.id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== user.id);
          this.contacts = this.contacts.filter(c => c.id !== user.id);
        },
        error: (err) => console.error('Error deleting user:', err)
      });
    }
  }

  isAdmin(): boolean {
    return this.user?.roles?.some((role: any) => role.name === 'administrator') || false;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
