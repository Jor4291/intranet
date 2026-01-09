import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <button
              (click)="goBack()"
              class="text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </button>
            <h1 class="text-2xl font-bold text-gray-900">My Profile</h1>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center space-x-6 mb-6">
            <div class="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-medium">
              {{ user?.first_name?.charAt(0) }}{{ user?.last_name?.charAt(0) }}
            </div>
            <div>
              <h2 class="text-xl font-semibold">{{ user?.first_name }} {{ user?.last_name }}</h2>
              <p class="text-gray-600">{{ user?.email }}</p>
              <p class="text-sm text-gray-500">{{ user?.roles?.[0]?.display_name || 'User' }}</p>
              <p *ngIf="!isAuthenticated" class="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded mt-1">
                🔒 Demo Mode - Log in to edit your profile
              </p>
            </div>
          </div>

          <div class="space-y-6">
            <!-- Profile Information -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
              <form (ngSubmit)="updateProfile()" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      [(ngModel)]="profileData.first_name"
                      name="first_name"
                      type="text"
                      required
                      class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      [(ngModel)]="profileData.last_name"
                      name="last_name"
                      type="text"
                      required
                      class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    [(ngModel)]="profileData.email"
                    name="email"
                    type="email"
                    required
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  [disabled]="loading"
                  class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {{ loading ? 'Updating...' : 'Update Profile' }}
                </button>
              </form>
            </div>

            <!-- Change Password -->
            <div class="border-t pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
              <form (ngSubmit)="changePassword()" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    [(ngModel)]="passwordData.current_password"
                    name="current_password"
                    type="password"
                    required
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    [(ngModel)]="passwordData.new_password"
                    name="new_password"
                    type="password"
                    required
                    minlength="8"
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    [(ngModel)]="passwordData.confirm_password"
                    name="confirm_password"
                    type="password"
                    required
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  [disabled]="loading || passwordData.new_password !== passwordData.confirm_password"
                  class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {{ loading ? 'Changing...' : 'Change Password' }}
                </button>

                <p *ngIf="passwordData.new_password && passwordData.confirm_password && passwordData.new_password !== passwordData.confirm_password"
                   class="text-red-600 text-sm">
                  Passwords do not match
                </p>
              </form>
            </div>

            <!-- Account Information -->
            <div class="border-t pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
              <div class="space-y-2 text-sm text-gray-600">
                <p><span class="font-medium">Username:</span> {{ user?.username }}</p>
                <p><span class="font-medium">Member since:</span> {{ formatDate(user?.created_at) }}</p>
                <p><span class="font-medium">Last login:</span> {{ formatDate(user?.last_seen_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  user: any = null;
  loading = false;

  profileData = {
    first_name: '',
    last_name: '',
    email: ''
  };

  passwordData = {
    current_password: '',
    new_password: '',
    confirm_password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Make authService available in template
  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }

      this.user = user;

      // Initialize form data with user data
      this.profileData = {
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || ''
      };
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  async updateProfile(): Promise<void> {
    if (!this.profileData.first_name.trim() || !this.profileData.last_name.trim() || !this.profileData.email.trim()) {
      return;
    }

    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      alert('You must be logged in to update your profile. This is currently showing demo data.');
      return;
    }

    this.loading = true;
    try {
      const updatedUser = await firstValueFrom(this.authService.updateProfile(this.profileData));
      this.user = updatedUser;
      // Show success message
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      console.error('Error details:', error.error);
      console.error('Status:', error.status);
      console.error('Status text:', error.statusText);

      let errorMessage = 'Failed to update profile. Please try again.';

      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.errors) {
        // Handle validation errors
        const validationErrors = Object.values(error.error.errors).flat();
        errorMessage = validationErrors.join('\n');
      } else if (error.status === 401) {
        errorMessage = 'You are not authorized to update this profile. Please log in.';
      } else if (error.status === 422) {
        errorMessage = 'Please check your input and try again.';
      } else if (error.status === 0) {
        errorMessage = 'Cannot connect to the server. Please check your internet connection.';
      }

      alert(errorMessage);
    } finally {
      this.loading = false;
    }
  }

  async changePassword(): Promise<void> {
    if (!this.passwordData.current_password || !this.passwordData.new_password ||
        this.passwordData.new_password !== this.passwordData.confirm_password) {
      return;
    }

    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      alert('You must be logged in to change your password. This is currently showing demo data.');
      return;
    }

    this.loading = true;
    try {
      const passwordData = {
        current_password: this.passwordData.current_password,
        password: this.passwordData.new_password,
        password_confirmation: this.passwordData.confirm_password
      };

      await firstValueFrom(this.authService.changePassword(passwordData));

      // Clear the form
      this.passwordData = {
        current_password: '',
        new_password: '',
        confirm_password: ''
      };

      // Show success message
      alert('Password changed successfully!');
    } catch (error: any) {
      console.error('Error changing password:', error);
      console.error('Error details:', error.error);
      console.error('Status:', error.status);

      let errorMessage = 'Failed to change password. Please try again.';

      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.errors) {
        // Handle validation errors
        const validationErrors = Object.values(error.error.errors).flat();
        errorMessage = validationErrors.join('\n');
      } else if (error.status === 401) {
        errorMessage = 'You are not authorized to change this password. Please log in.';
      } else if (error.status === 422) {
        errorMessage = 'Please check your input and try again.';
      } else if (error.status === 0) {
        errorMessage = 'Cannot connect to the server. Please check your internet connection.';
      }

      alert(errorMessage);
    } finally {
      this.loading = false;
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
